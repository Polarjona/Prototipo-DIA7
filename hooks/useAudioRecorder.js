import { useState, useRef, useCallback } from "react";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder as useExpoAudioRecorder,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { transcribeWithGemini } from "../services/geminiService";

export function useAudioRecorder(MAX_RECORDINGS = 3) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(null);

  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const audioRecorder = useExpoAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: "document",
  });

  const requestPermission = useCallback(async () => {
    const { granted } = await AudioModule.requestRecordingPermissionsAsync();
    setPermissionGranted(granted);
    return granted;
  }, []);

  const startRecording = useCallback(async () => {
    if (recordings.length >= MAX_RECORDINGS) return;

    let granted = permissionGranted;
    if (!granted) granted = await requestPermission();
    if (!granted) return;

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    recordingRef.current = audioRecorder;
    startTimeRef.current = Date.now();
    setIsRecording(true);
    setElapsedMs(0);

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
  }, [
    audioRecorder,
    permissionGranted,
    recordings.length,
    requestPermission,
    MAX_RECORDINGS,
  ]);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    clearInterval(timerRef.current);
    setIsRecording(false);

    const recording = recordingRef.current;
    recordingRef.current = null;

    await recording.stop();
    await setAudioModeAsync({ allowsRecording: false });

    const uri = recording.uri;
    if (!uri) return;

    const normalizedUri = uri.startsWith("file://") ? uri : `file://${uri}`;
    let fileInfo = await FileSystem.getInfoAsync(normalizedUri);

    for (let attempt = 0; !fileInfo.exists && attempt < 10; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      fileInfo = await FileSystem.getInfoAsync(normalizedUri);
    }

    if (!fileInfo.exists) {
      throw new Error("La grabación no se ha guardado correctamente.");
    }

    const duration = Date.now() - startTimeRef.current;

    const entry = {
      id: Date.now(),
      uri: normalizedUri,
      duration,
      transcript: null,
      error: null,
      timestamp: new Date(),
    };
    setRecordings((prev) => [entry, ...prev]);
    setIsTranscribing(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(normalizedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const transcript = await transcribeWithGemini(base64, "audio/m4a");

      setRecordings((prev) =>
        prev.map((r) => (r.id === entry.id ? { ...r, transcript } : r))
      );
    } catch (err) {
      setRecordings((prev) =>
        prev.map((r) =>
          r.id === entry.id ? { ...r, error: err.message } : r
        )
      );
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const deleteRecording = useCallback((id) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    isRecording,
    isTranscribing,
    recordings,
    elapsedMs,
    permissionGranted,
    requestPermission,
    startRecording,
    stopRecording,
    deleteRecording,
    canRecord: recordings.length < MAX_RECORDINGS,
  };
}
