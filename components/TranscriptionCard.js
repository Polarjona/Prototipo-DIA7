import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function TranscriptionCard({ item, onDelete }) {
  const formatDuration = (ms) => {
    const s = Math.floor(ms / 1000);
    return `00:${s.toString().padStart(2, "0")}`;
  };

  const isPending = !item.transcript && !item.error;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.time}>{item.timestamp.toLocaleTimeString()}</Text>
          <Text style={styles.duration}>({formatDuration(item.duration)})</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.textBtnDanger}>
            <Text style={styles.textBtnTextDanger}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {isPending ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#38BDF8" style={{ marginRight: 8 }} />
            <Text style={styles.loadingText}>Transcribiendo con Gemini...</Text>
          </View>
        ) : item.error ? (
          <Text style={styles.errorText}>Error: {item.error}</Text>
        ) : (
          <Text style={styles.transcript}>{item.transcript}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 10,
  },
  titleRow: { flexDirection: "row", alignItems: "baseline" },
  time: { color: "#F8FAFC", fontWeight: "600", fontSize: 15, marginRight: 8 },
  duration: { color: "#94A3B8", fontSize: 13 },
  actions: { flexDirection: "row", alignItems: "center" },
  textBtnDanger: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#64748B",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  textBtnTextDanger: { color: "#E2E8F0", fontSize: 11, fontWeight: "600" },
  content: { minHeight: 40 },
  transcript: {
    color: "#E2E8F0",
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
  errorText: { color: "#EF4444", fontSize: 14 },
  loadingRow: { flexDirection: "row", alignItems: "center" },
  loadingText: { color: "#94A3B8", fontSize: 14 },
});
