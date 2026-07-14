// /app/(tabs)/library.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing } from "../../constants/theme";
import PillFilters from "../../components/PillFilters";
import { useMusicPlayer } from "../../context/MusicPlayerContext";
import { playlists as initialPlaylists, artists, albums, songs } from "../../data/mockData";

const FILTERS = ["Playlists", "Songs", "Albums", "Artists", "Downloaded"];

export default function LibraryScreen() {
  const { playTrack } = useMusicPlayer();
  const [activeFilter, setActiveFilter] = useState("Playlists");
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const createPlaylist = () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    const newPlaylist = {
      id: `p-local-${Date.now()}`,
      title: name,
      isSystem: false,
      artwork: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`,
      trackCount: 0,
      songIds: [],
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setNewPlaylistName("");
    setModalVisible(false);
  };

  const renderContent = () => {
    if (activeFilter === "Artists") {
      return artists.map((a) => (
        <Pressable key={a.id} style={styles.row}>
          <Image source={{ uri: a.image }} style={styles.avatarRound} />
          <View style={styles.rowMeta}>
            <Text style={styles.rowTitle}>{a.name}</Text>
            <Text style={styles.rowSubtitle}>Artist · {a.followers} followers</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </Pressable>
      ));
    }

    if (activeFilter === "Albums") {
      return albums.map((al) => (
        <Pressable key={al.id} style={styles.row}>
          <Image source={{ uri: al.artwork }} style={styles.thumbSquare} />
          <View style={styles.rowMeta}>
            <Text style={styles.rowTitle}>{al.title}</Text>
            <Text style={styles.rowSubtitle}>Album · {al.artist} · {al.year}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </Pressable>
      ));
    }

    if (activeFilter === "Downloaded") {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="cloud-download-outline" size={36} color={colors.textFaint} />
          <Text style={styles.emptyText}>No downloaded music yet</Text>
        </View>
      );
    }

    if (activeFilter === "Songs") {
      return songs.map((s) => (
        <Pressable key={s.id} style={styles.row} onPress={() => playTrack(s, songs)}>
          <Image source={{ uri: s.artwork }} style={styles.thumbSquare} />
          <View style={styles.rowMeta}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {s.title}
            </Text>
            <Text style={styles.rowSubtitle}>{s.artist}</Text>
          </View>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textFaint} />
        </Pressable>
      ));
    }

    // Playlists (default)
    return playlists.map((p) => (
      <Pressable key={p.id} style={styles.row}>
        <Image source={{ uri: p.artwork }} style={styles.thumbSquare} />
        <View style={styles.rowMeta}>
          <Text style={styles.rowTitle}>{p.title}</Text>
          <Text style={styles.rowSubtitle}>Playlist · {p.trackCount} tracks</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </Pressable>
    ));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Text style={styles.header}>Your Library</Text>

      <PillFilters items={FILTERS} activeItem={activeFilter} onSelect={setActiveFilter} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140, paddingTop: spacing.sm }}>
        {renderContent()}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>New Playlist</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Playlist</Text>
            <TextInput
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Playlist name"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={() => {
                  setModalVisible(false);
                  setNewPlaylistName("");
                }}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnSolid]} onPress={createPlaylist}>
                <Text style={styles.modalBtnSolidText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  thumbSquare: { width: 52, height: 52, borderRadius: radii.sm, backgroundColor: colors.surface },
  avatarRound: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface },
  rowMeta: { flex: 1, marginLeft: spacing.md },
  rowTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  rowSubtitle: { fontSize: 12, fontWeight: "500", color: colors.textMuted, marginTop: 2 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 13, fontWeight: "600", color: colors.textFaint },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.black,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: radii.pill,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: colors.white, fontWeight: "700", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  modalTitle: { fontSize: 17, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  modalActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: "center",
  },
  modalBtnGhost: { backgroundColor: colors.surface },
  modalBtnGhostText: { fontWeight: "700", color: colors.textMuted },
  modalBtnSolid: { backgroundColor: colors.black },
  modalBtnSolidText: { fontWeight: "700", color: colors.white },
});
