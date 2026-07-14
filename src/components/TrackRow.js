// /components/TrackRow.js
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../constants/theme";

export default function TrackRow({
  song,
  isActive = false,
  isPlaying = false,
  rank,
  onPress,
  onMenuPress,
  subtitleOverride,
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      {rank != null && <Text style={styles.rank}>{rank}</Text>}

      <View style={styles.artworkWrap}>
        <Image source={{ uri: song.artwork }} style={styles.artwork} />
        <View style={styles.playIcon}>
          <Ionicons name={isActive && isPlaying ? "pause" : "play"} size={11} color={colors.white} />
        </View>
      </View>

      <View style={styles.meta}>
        <Text numberOfLines={1} style={[styles.title, isActive && styles.titleActive]}>
          {song.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitleOverride ?? (song.plays ? `${song.plays} Played` : song.artist)}
        </Text>
      </View>

      {onMenuPress && (
        <Pressable hitSlop={10} onPress={onMenuPress} style={styles.menuBtn}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textFaint} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
  },
  rank: {
    width: 22,
    fontSize: 14,
    fontWeight: "700",
    color: colors.textFaint,
    marginRight: 6,
  },
  artworkWrap: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  playIcon: {
    position: "absolute",
    bottom: -4,
    right: -4,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  meta: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  titleActive: {
    color: colors.black,
    textDecorationLine: "underline",
    textDecorationColor: colors.accentYellow,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: 2,
  },
  menuBtn: {
    padding: 4,
  },
});
