import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function RecordButton({ isRecording, onPress, disabled }) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      style={styles.wrapper}
    >
      <Animated.View
        style={[
          styles.outerRing,
          isRecording && styles.outerRingActive,
          { transform: [{ scale: pulseAnim }] },
          disabled && styles.disabled,
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            isRecording && styles.innerSquare,
          ]}
        />
      </Animated.View>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {disabled
          ? "Máx. alcanzado"
          : isRecording
          ? "Detener"
          : "Grabar"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", marginVertical: 24 },
  outerRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  outerRingActive: {
    borderColor: "#F97316",
  },
  innerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EF4444",
  },
  innerSquare: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#F97316",
  },
  label: {
    marginTop: 10,
    color: "#E2E8F0",
    fontWeight: "600",
    fontSize: 15,
  },
  disabled: { opacity: 0.35 },
  disabledText: { color: "#64748B" },
});
