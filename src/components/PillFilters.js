// /components/PillFilters.js
import React from "react";
import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../constants/theme";

export default function PillFilters({ items, activeItem, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item) => {
        const active = item === activeItem;
        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{item}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  pillActive: {
    backgroundColor: colors.black,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  pillTextActive: {
    color: colors.white,
  },
});
