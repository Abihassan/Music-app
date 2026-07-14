// /components/ProgressSlider.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { colors, radii } from "../constants/theme";

const formatTime = (seconds) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function ProgressSlider({ position, duration, onSeek }) {
  const [trackWidth, setTrackWidth] = useState(1);
  const dragX = useSharedValue(null);
  const [dragging, setDragging] = useState(false);

  const ratio = duration > 0 ? Math.min(position / duration, 1) : 0;

  const commit = (r) => {
    onSeek(Math.max(0, Math.min(1, r)) * duration);
    setDragging(false);
  };

  const pan = Gesture.Pan()
    .onStart((e) => {
      runOnJS(setDragging)(true);
      dragX.value = e.x;
    })
    .onUpdate((e) => {
      dragX.value = Math.max(0, Math.min(trackWidth, e.x));
    })
    .onEnd((e) => {
      const r = Math.max(0, Math.min(trackWidth, e.x)) / trackWidth;
      runOnJS(commit)(r);
      dragX.value = null;
    });

  const fillStyle = useAnimatedStyle(() => {
    const r = dragX.value !== null ? dragX.value / trackWidth : ratio;
    return { width: `${Math.max(0, Math.min(1, r)) * 100}%` };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const r = dragX.value !== null ? dragX.value / trackWidth : ratio;
    const clamped = Math.max(0, Math.min(1, r));
    return {
      left: `${clamped * 100}%`,
      transform: [{ translateX: -7 }, { scale: dragging ? 1.3 : 1 }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={pan}>
        <View
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          style={styles.hitArea}
          hitSlop={{ top: 12, bottom: 12 }}
        >
          <View style={styles.track}>
            <Animated.View style={[styles.fill, fillStyle]} />
          </View>
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>-{formatTime(Math.max(0, duration - position))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  hitArea: { height: 26, justifyContent: "center" },
  track: {
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.black,
  },
  thumb: {
    position: "absolute",
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: colors.black,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
