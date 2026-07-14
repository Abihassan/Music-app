// /components/MiniPlayer.js
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import { colors, radii, spacing } from "../constants/theme";

export default function MiniPlayer({ bottomOffset = 0 }) {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, skipToNext, playbackProgress } =
    useMusicPlayer();

  if (!currentTrack) return null;

  const progressRatio = Math.min(playbackProgress / currentTrack.duration, 1);

  return (
    <Pressable
      onPress={() => router.push("/player")}
      style={[styles.container, { bottom: bottomOffset }]}
    >
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
      </View>

      <View style={styles.row}>
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        <View style={styles.meta}>
          <Text numberOfLines={1} style={styles.title}>
            {currentTrack.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {currentTrack.artist}
          </Text>
        </View>

        <Pressable hitSlop={10} onPress={togglePlayPause} style={styles.iconBtn}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={colors.text} />
        </Pressable>
        <Pressable hitSlop={10} onPress={skipToNext} style={styles.iconBtn}>
          <Ionicons name="play-skip-forward" size={18} color={colors.text} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: "hidden",
  },
  progressTrack: {
    height: 2,
    width: "100%",
    backgroundColor: colors.surface,
  },
  progressFill: {
    height: 2,
    backgroundColor: colors.accentYellow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  meta: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  artist: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: 1,
  },
  iconBtn: {
    padding: 6,
  },
});
