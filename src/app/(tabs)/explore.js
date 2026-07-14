// /app/(tabs)/explore.js
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../../constants/theme";
import { useMusicPlayer } from "../../context/MusicPlayerContext";
import SectionHeader from "../../components/SectionHeader";
import TrackRow from "../../components/TrackRow";
import {
  exploreShortcuts,
  moodsAndGenres,
  topSongsChart,
  topVideosChart,
  trendingArtistsChart,
} from "../../data/mockData";

const SHORTCUT_ICONS = {
  ex1: "sparkles",
  ex2: "trending-up",
  ex3: "color-palette",
  ex4: "flame",
};

export default function ExploreScreen() {
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();
  const [chartTab, setChartTab] = useState("songs"); // songs | videos | artists
  const [selectedGenre, setSelectedGenre] = useState(null);

  const chartData =
    chartTab === "songs" ? topSongsChart : chartTab === "videos" ? topVideosChart : trendingArtistsChart;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <Text style={styles.header}>Explore</Text>

        {/* Top Shortcuts Grid */}
        <View style={styles.shortcutGrid}>
          {exploreShortcuts.map((s) => (
            <Pressable key={s.id} style={[styles.shortcutCard, { backgroundColor: s.color }]}>
              <Ionicons name={SHORTCUT_ICONS[s.id]} size={20} color={colors.white} />
              <Text style={styles.shortcutText}>{s.title}</Text>
            </Pressable>
          ))}
        </View>

        {/* Charts */}
        <SectionHeader title="Charts" />
        <View style={styles.chartTabs}>
          {[
            { key: "songs", label: "Top 50 Songs" },
            { key: "videos", label: "Top 50 Videos" },
            { key: "artists", label: "Trending Artists" },
          ].map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setChartTab(t.key)}
              style={[styles.chartTabBtn, chartTab === t.key && styles.chartTabBtnActive]}
            >
              <Text style={[styles.chartTabText, chartTab === t.key && styles.chartTabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: spacing.sm }}>
          {chartTab === "artists"
            ? chartData.slice(0, 10).map((artist) => (
                <Pressable key={artist.id} style={styles.artistRow}>
                  <Text style={styles.rank}>{artist.rank}</Text>
                  <Image source={{ uri: artist.image }} style={styles.artistAvatar} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.title} numberOfLines={1}>
                      {artist.name}
                    </Text>
                    <Text style={styles.subtitle}>{artist.followers} followers</Text>
                  </View>
                </Pressable>
              ))
            : chartData.slice(0, 10).map((song) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  rank={song.rank}
                  isActive={currentTrack?.id === song.id}
                  isPlaying={isPlaying}
                  onPress={() => playTrack(song, chartData)}
                />
              ))}
        </View>

        {/* Moods & Genres */}
        <SectionHeader title="Moods & Genres" />
        <View style={styles.genreGrid}>
          {moodsAndGenres.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => setSelectedGenre(g.id === selectedGenre ? null : g.id)}
              style={[styles.genreCard, { backgroundColor: g.color }]}
            >
              <Text style={styles.genreText}>{g.name}</Text>
            </Pressable>
          ))}
        </View>

        {selectedGenre && (
          <View style={{ marginTop: spacing.md }}>
            <SectionHeader
              title={`${moodsAndGenres.find((g) => g.id === selectedGenre)?.name} — Top Tracks`}
            />
            {topSongsChart.slice(0, 6).map((song) => (
              <TrackRow
                key={song.id}
                song={song}
                isActive={currentTrack?.id === song.id}
                isPlaying={isPlaying}
                onPress={() => playTrack(song, topSongsChart)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
  },
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  shortcutCard: {
    width: "47.5%",
    height: 64,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shortcutText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
    flexShrink: 1,
  },
  chartTabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chartTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  chartTabBtnActive: { backgroundColor: colors.black },
  chartTabText: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  chartTabTextActive: { color: colors.white },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
  },
  rank: { width: 22, fontSize: 14, fontWeight: "700", color: colors.textFaint },
  artistAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface },
  title: { fontSize: 14, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 12, fontWeight: "500", color: colors.textMuted, marginTop: 2 },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  genreCard: {
    width: "31%",
    height: 74,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  genreText: { color: colors.white, fontWeight: "800", fontSize: 13 },
});
