// /app/player.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { colors, radii, spacing } from "../constants/theme";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import MarqueeText from "../components/MarqueeText";
import ProgressSlider from "../components/ProgressSlider";
import { mockLyrics, relatedTracks as getRelatedTracks } from "../data/mockData";

const TABS = ["Up Next", "Lyrics", "Related"];

function PlayPauseButton({ isPlaying, onPress }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.9, { damping: 12, stiffness: 220 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 10, stiffness: 200 }))}
      onPress={onPress}
    >
      <Animated.View style={[styles.playBtn, style]}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={26} color={colors.white} style={{ marginLeft: isPlaying ? 0 : 2 }} />
      </Animated.View>
    </Pressable>
  );
}

export default function PlayerModal() {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    playbackProgress,
    queueList,
    shuffle,
    repeatMode,
    likedIds,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
    toggleLike,
    removeFromQueue,
    playTrack,
  } = useMusicPlayer();

  const [activeTab, setActiveTab] = useState("Up Next");

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: spacing.lg }}>Nothing is playing.</Text>
      </SafeAreaView>
    );
  }

  const liked = likedIds.includes(currentTrack.id);
  const related = getRelatedTracks(currentTrack.id);
  const upNext = queueList.filter((t) => t.id !== currentTrack.id);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <Pressable hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Artwork */}
        <View style={styles.artworkWrap}>
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        </View>

        {/* Metadata */}
        <View style={styles.metaRow}>
          <View style={{ flex: 1, marginRight: spacing.md }}>
            <MarqueeText text={currentTrack.title} style={styles.title} />
            <Text style={styles.artist}>{currentTrack.artist}</Text>
          </View>
          <View style={styles.likeGroup}>
            <Pressable hitSlop={10} onPress={() => toggleLike(currentTrack.id)}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? colors.danger : colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <ProgressSlider position={playbackProgress} duration={currentTrack.duration} onSeek={seekTo} />
        </View>

        {/* Transport Controls */}
        <View style={styles.controlsRow}>
          <Pressable onPress={toggleShuffle} hitSlop={12}>
            <Ionicons name="shuffle" size={20} color={shuffle ? colors.text : colors.textFaint} />
          </Pressable>
          <Pressable onPress={skipToPrevious} hitSlop={12}>
            <Ionicons name="play-skip-back" size={28} color={colors.text} />
          </Pressable>

          <PlayPauseButton isPlaying={isPlaying} onPress={togglePlayPause} />

          <Pressable onPress={skipToNext} hitSlop={12}>
            <Ionicons name="play-skip-forward" size={28} color={colors.text} />
          </Pressable>
          <Pressable onPress={cycleRepeatMode} hitSlop={12} style={{ position: "relative" }}>
            <Ionicons name="repeat" size={20} color={repeatMode !== "off" ? colors.text : colors.textFaint} />
            {repeatMode === "one" && (
              <View style={styles.repeatOneBadge}>
                <Text style={styles.repeatOneText}>1</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Auxiliary Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tabBtn}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "Up Next" && (
            <>
              {upNext.length === 0 ? (
                <Text style={styles.emptyText}>Queue is empty.</Text>
              ) : (
                upNext.map((t, idx) => (
                  <View key={`${t.id}-${idx}`} style={styles.queueRow}>
                    <Image source={{ uri: t.artwork }} style={styles.queueArt} />
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text numberOfLines={1} style={styles.queueTitle}>{t.title}</Text>
                      <Text numberOfLines={1} style={styles.queueArtist}>{t.artist}</Text>
                    </View>
                    <Pressable hitSlop={10} onPress={() => removeFromQueue(t.id)}>
                      <Ionicons name="close" size={18} color={colors.textFaint} />
                    </Pressable>
                    <Ionicons name="reorder-three" size={20} color={colors.textFaint} style={{ marginLeft: 10 }} />
                  </View>
                ))
              )}
            </>
          )}

          {activeTab === "Lyrics" && (
            <Text style={styles.lyrics}>{mockLyrics}</Text>
          )}

          {activeTab === "Related" && (
            <>
              {related.map((t) => (
                <Pressable key={t.id} style={styles.queueRow} onPress={() => playTrack(t, related)}>
                  <Image source={{ uri: t.artwork }} style={styles.queueArt} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text numberOfLines={1} style={styles.queueTitle}>{t.title}</Text>
                    <Text numberOfLines={1} style={styles.queueArtist}>{t.artist}</Text>
                  </View>
                  <Ionicons name="play-circle-outline" size={22} color={colors.textFaint} />
                </Pressable>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  artworkWrap: { alignItems: "center", marginTop: spacing.lg, paddingHorizontal: spacing.xl },
  artwork: {
    width: "82%",
    aspectRatio: 1,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  title: { fontSize: 21, fontWeight: "800", color: colors.text },
  artist: { fontSize: 14, fontWeight: "500", color: colors.textMuted, marginTop: 4 },
  likeGroup: { flexDirection: "row", alignItems: "center" },
  progressWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl + 6,
    marginTop: spacing.xl,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatOneBadge: {
    position: "absolute",
    top: -6,
    right: -8,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatOneText: { color: colors.white, fontSize: 8, fontWeight: "800" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    marginTop: spacing.xl + 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBtn: { alignItems: "center", paddingBottom: 12 },
  tabText: { fontSize: 13, fontWeight: "700", color: colors.textFaint, letterSpacing: 0.5 },
  tabTextActive: { color: colors.text },
  tabUnderline: {
    marginTop: 8,
    height: 2,
    width: 26,
    backgroundColor: colors.accentYellow,
    borderRadius: 1,
  },
  tabContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  emptyText: { fontSize: 13, fontWeight: "600", color: colors.textFaint, textAlign: "center", marginTop: spacing.lg },
  queueRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  queueArt: { width: 44, height: 44, borderRadius: radii.sm, backgroundColor: colors.surface },
  queueTitle: { fontSize: 13, fontWeight: "700", color: colors.text },
  queueArtist: { fontSize: 12, fontWeight: "500", color: colors.textMuted, marginTop: 2 },
  lyrics: { fontSize: 15, lineHeight: 26, fontWeight: "500", color: colors.text },
});
