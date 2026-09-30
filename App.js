import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import RecordButton from "./components/RecordButton";
import TranscriptionCard from "./components/TranscriptionCard";
import { useAudioRecorder } from "./hooks/useAudioRecorder";

const MAX_RECORDINGS = 3; // Requisito del ejercicio: 3 audios de prueba

export default function App() {
  const {
    isRecording,
    isTranscribing,
    recordings,
    elapsedMs,
    startRecording,
    stopRecording,
    deleteRecording,
    canRecord,
  } = useAudioRecorder(MAX_RECORDINGS);

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatElapsed = (ms) => {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${min.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Speech to Text</Text>
          <Text style={styles.subtitle}>Prototipo — Gemini API</Text>
        </View>

        <View style={styles.recorderSection}>
          <RecordButton
            isRecording={isRecording}
            onPress={handlePress}
            disabled={!canRecord && !isRecording}
          />

          {isRecording && (
            <View style={styles.timerWrapper}>
              <View style={styles.liveDot} />
              <Text style={styles.timerText}>{formatElapsed(elapsedMs)}</Text>
            </View>
          )}

          {isTranscribing && (
            <Text style={styles.statusText}>Enviando audio a Gemini...</Text>
          )}

          <Text style={styles.counter}>
            {recordings.length}/{MAX_RECORDINGS} grabaciones
          </Text>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {recordings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Pulsa el botón para grabar un audio
              </Text>
            </View>
          ) : (
            recordings.map((item) => (
              <TranscriptionCard
                key={item.id}
                item={item}
                onDelete={deleteRecording}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Transcripción vía Gemini 3.6
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 4,
  },
  recorderSection: {
    alignItems: "center",
    paddingVertical: 8,
  },
  timerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 8,
  },
  timerText: {
    color: "#F87171",
    fontSize: 20,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  statusText: {
    color: "#38BDF8",
    fontSize: 14,
    marginBottom: 4,
  },
  counter: {
    color: "#64748B",
    fontSize: 13,
  },
  list: { flex: 1 },
  listContent: { paddingTop: 12, paddingBottom: 24 },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },
  footerText: { color: "#475569", fontSize: 12 },
});
