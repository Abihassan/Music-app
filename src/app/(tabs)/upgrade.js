// /app/(tabs)/upgrade.js
import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../../constants/theme";

const PERKS = [
  { icon: "musical-notes", title: "Ad-free listening", desc: "Uninterrupted music, all day." },
  { icon: "download", title: "Offline downloads", desc: "Take your library anywhere." },
  { icon: "flash", title: "High-fidelity audio", desc: "Studio-quality streaming." },
  { icon: "infinite", title: "Unlimited skips", desc: "Skip as many tracks as you like." },
];

const PLANS = [
  { id: "monthly", label: "Monthly", price: "$9.99", sub: "per month" },
  { id: "yearly", label: "Yearly", price: "$79.99", sub: "per year · save 33%", featured: true },
];

export default function UpgradeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="diamond" size={26} color={colors.white} />
          </View>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock the full experience — no ads, offline listening, and the best sound quality.
          </Text>
        </View>

        <View style={styles.perkList}>
          {PERKS.map((p) => (
            <View key={p.title} style={styles.perkRow}>
              <View style={styles.perkIcon}>
                <Ionicons name={p.icon} size={18} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.perkTitle}>{p.title}</Text>
                <Text style={styles.perkDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <View key={plan.id} style={[styles.planCard, plan.featured && styles.planCardFeatured]}>
              {plan.featured && (
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>BEST VALUE</Text>
                </View>
              )}
              <Text style={[styles.planLabel, plan.featured && styles.planLabelFeatured]}>
                {plan.label}
              </Text>
              <Text style={[styles.planPrice, plan.featured && styles.planLabelFeatured]}>
                {plan.price}
              </Text>
              <Text style={[styles.planSub, plan.featured && styles.planSubFeatured]}>{plan.sub}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.ctaBtn}>
          <Text style={styles.ctaText}>Start Free Trial</Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Cancel anytime. Trial converts to a paid subscription automatically.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  hero: { alignItems: "center", paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  heroTitle: { fontSize: 26, fontWeight: "900", color: colors.text },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 19,
  },
  perkList: { marginTop: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.md },
  perkRow: { flexDirection: "row", alignItems: "center" },
  perkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  perkTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  perkDesc: { fontSize: 12, fontWeight: "500", color: colors.textMuted, marginTop: 1 },
  plans: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  planCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  planCardFeatured: { backgroundColor: colors.black, borderColor: colors.black },
  planBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentYellow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    marginBottom: 8,
  },
  planBadgeText: { fontSize: 9, fontWeight: "900", color: colors.black },
  planLabel: { fontSize: 13, fontWeight: "700", color: colors.text },
  planLabelFeatured: { color: colors.white },
  planPrice: { fontSize: 20, fontWeight: "900", color: colors.text, marginTop: 6 },
  planSub: { fontSize: 11, fontWeight: "500", color: colors.textMuted, marginTop: 2 },
  planSubFeatured: { color: "rgba(255,255,255,0.65)" },
  ctaBtn: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.black,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  ctaText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  disclaimer: {
    marginTop: spacing.md,
    textAlign: "center",
    fontSize: 11,
    color: colors.textFaint,
    paddingHorizontal: spacing.xl,
  },
});
