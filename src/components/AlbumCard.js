// /components/AlbumCard.js
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../constants/theme";

export default function AlbumCard({ title, subtitle, artwork, size = 140, onPress, showPlay = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.container, { width: size }]}>
      <View style={{ width: size, height: size }}>
        <Image source={{ uri: artwork }} style={[styles.image, { width: size, height: size }]} />
        {showPlay && (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={14} color={colors.white} />
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
  },
  image: {
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  },
  playBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: "rgba(17,17,17,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
