// /app/(tabs)/index.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../../constants/theme";
import { useMusicPlayer } from "../../context/MusicPlayerContext";
import PillFilters from "../../components/PillFilters";
import SectionHeader from "../../components/SectionHeader";
import AlbumCard from "../../components/AlbumCard";
import TrackRow from "../../components/TrackRow";
import {
  moodFilters,
  songs,
  playlists,
  albums,
} from "../../data/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const { playTrack, currentTrack, isPlaying, history } = useMusicPlayer();
  const [activeMood, setActiveMood] = useState(moodFilters[0]);

  const listenAgain = history.length > 0 ? history.slice(0, 6) : songs.slice(0, 6);
  const quickPicks = songs;
  const mixedForYou = playlists.filter((p) => !p.isSystem);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>musio</Text>
        <View style={styles.topIcons}>
          <Pressable hitSlop={8} style={styles.iconBtn}>
            <Ionicons name="tv-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8} style={styles.iconBtn} onPress={() => router.push("/search")}>
            <Ionicons name="search" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=32" }}
              style={styles.avatar}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentTrack ? 130 : 40 }}
      >
        <PillFilters items={moodFilters} activeItem={activeMood} onSelect={setActiveMood} />

        {/* Listen Again */}
        <SectionHeader title="Listen Again" />
        <FlatList
          data={listenAgain}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <AlbumCard
              title={item.title}
              subtitle={item.artist}
              artwork={item.artwork}
              showPlay
              onPress={() => playTrack(item, songs)}
            />
          )}
        />

        {/* Quick Picks */}
        <SectionHeader title="Quick Picks" onSeeAll={() => {}} />
        <View style={styles.quickPicksGrid}>
          {chunk(quickPicks, 3).map((row, rowIdx) => (
            <View key={rowIdx} style={styles.quickPicksRow}>
              {row.map((song) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  isActive={currentTrack?.id === song.id}
                  isPlaying={isPlaying}
                  onPress={() => playTrack(song, quickPicks)}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Mixed for You */}
        <SectionHeader title="Mixed for You" />
        <FlatList
          data={mixedForYou}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <AlbumCard
              title={item.title}
              subtitle={`${item.trackCount} tracks`}
              artwork={item.artwork}
              size={160}
              onPress={() => {
                const firstSong = songs.find((s) => item.songIds.includes(s.id));
                if (firstSong) {
                  const queue = songs.filter((s) => item.songIds.includes(s.id));
                  playTrack(firstSong, queue);
                }
              }}
            />
          )}
        />

        {/* Recommended */}
        <SectionHeader title="Recommended" />
        <FlatList
          data={albums}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <AlbumCard
              title={item.title}
              subtitle={item.artist}
              artwork={item.artwork}
              size={150}
              onPress={() => {
                const first = songs.find((s) => item.songIds.includes(s.id));
                if (first) playTrack(first, songs.filter((s) => item.songIds.includes(s.id)));
              }}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.5,
  },
  topIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconBtn: { marginRight: 2 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
  },
  quickPicksGrid: {
    paddingTop: spacing.xs,
  },
  quickPicksRow: {
    // Rows already stack vertically via TrackRow; grouped for readability
  },
});
