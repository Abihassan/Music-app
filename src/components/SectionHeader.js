// /components/SectionHeader.js
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../constants/theme";

export default function SectionHeader({ title, onSeeAll }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.text,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
