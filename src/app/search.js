// /app/search.js
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../constants/theme";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import TrackRow from "../components/TrackRow";
import { songs, albums, artists, recentSearches } from "../data/mockData";

export default function SearchModal() {
  const router = useRouter();
  const { playTrack } = useMusicPlayer();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return { songs: [], albums: [], artists: [] };
    return {
      songs: songs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)),
      albums: albums.filter((a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
    };
  }, [q]);

  const hasResults = results.songs.length || results.albums.length || results.artists.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.searchBar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={16} color={colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search songs, artists, albums"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={16} color={colors.textFaint} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {q.length === 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.chipRow}>
              {recentSearches.map((term) => (
                <Pressable key={term} style={styles.chip} onPress={() => setQuery(term)}>
                  <Text style={styles.chipText}>{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {q.length > 0 && !hasResults && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={32} color={colors.textFaint} />
            <Text style={styles.emptyText}>No results for "{query}"</Text>
          </View>
        )}

        {results.songs.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Songs</Text>
            {results.songs.map((s) => (
              <TrackRow key={s.id} song={s} onPress={() => playTrack(s, results.songs)} />
            ))}
          </View>
        )}

        {results.albums.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Albums</Text>
            {results.albums.map((a) => (
              <View key={a.id} style={styles.row}>
                <Image source={{ uri: a.artwork }} style={styles.thumbSquare} />
                <View style={styles.rowMeta}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {a.title}
                  </Text>
                  <Text style={styles.rowSubtitle}>Album · {a.artist}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {results.artists.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Artists</Text>
            {results.artists.map((a) => (
              <View key={a.id} style={styles.row}>
                <Image source={{ uri: a.image }} style={styles.avatarRound} />
                <View style={styles.rowMeta}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {a.name}
                  </Text>
                  <Text style={styles.rowSubtitle}>Artist · {a.followers} followers</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: colors.text },
  recentSection: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.text },
  resultSection: { marginTop: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: spacing.lg },
  thumbSquare: { width: 48, height: 48, borderRadius: radii.sm, backgroundColor: colors.surface },
  avatarRound: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface },
  rowMeta: { flex: 1, marginLeft: spacing.md },
  rowTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  rowSubtitle: { fontSize: 12, fontWeight: "500", color: colors.textMuted, marginTop: 2 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 13, fontWeight: "600", color: colors.textFaint },
});
