// /data/mockData.js
// Centralized, fully local mock dataset. No network/backend calls — every
// screen in the app reads from these arrays. Artwork uses remote placeholder
// images purely for visual variety; swap for require() assets if needed.

const art = (seed) => `https://picsum.photos/seed/${seed}/400/400`;
const avatar = (seed) => `https://i.pravatar.cc/200?img=${seed}`;

export const artists = [
  { id: "ar1", name: "Andu Bandu", image: art("andu"), followers: "1.2M", bio: "Genre-bending producer known for lush, colorful soundscapes." },
  { id: "ar2", name: "Mira Solen", image: art("mira"), followers: "845K", bio: "Indie-pop songwriter with a dreamy, minimal sound." },
  { id: "ar3", name: "Kalo Rhen", image: art("kalo"), followers: "2.4M", bio: "Chart-topping hip-hop artist and multi-instrumentalist." },
  { id: "ar4", name: "Ives Duna", image: art("ives"), followers: "530K", bio: "Electronic composer blending analog synths with field recordings." },
  { id: "ar5", name: "Tor Zeta", image: art("torzeta"), followers: "1.8M", bio: "Alt-rock trio pushing anthemic, riff-driven records." },
  { id: "ar6", name: "Nima Vosk", image: art("nima"), followers: "690K", bio: "Chillwave / lo-fi producer, weekly release schedule." },
];

export const songs = [
  { id: "s1", title: "Ekon Tui Kita Korte", artist: "Andu Bandu", artistId: "ar1", album: "Matio Na Beshi", albumId: "al1", artwork: art("s1"), duration: 200, plays: "11,768", audioUrl: null },
  { id: "s2", title: "Ami Gesi Bakka Age", artist: "Mira Solen", artistId: "ar2", album: "Kunbay Aisot", albumId: "al2", artwork: art("s2"), duration: 184, plays: "12,098", audioUrl: null },
  { id: "s3", title: "Tor Zeta Iccha Kor", artist: "Kalo Rhen", artistId: "ar3", album: "Loren Skai", albumId: "al3", artwork: art("s3"), duration: 221, plays: "9,442", audioUrl: null },
  { id: "s4", title: "Bristi Elo Raat", artist: "Ives Duna", artistId: "ar4", album: "Field Notes", albumId: "al4", artwork: art("s4"), duration: 196, plays: "7,215", audioUrl: null },
  { id: "s5", title: "Nodi Pare Ekla", artist: "Tor Zeta", artistId: "ar5", album: "Anthem Hours", albumId: "al5", artwork: art("s5"), duration: 233, plays: "15,880", audioUrl: null },
  { id: "s6", title: "Shohor Ghumaye Gele", artist: "Nima Vosk", artistId: "ar6", album: "Late Signals", albumId: "al6", artwork: art("s6"), duration: 178, plays: "5,320", audioUrl: null },
  { id: "s7", title: "Chena Mukher Bhir", artist: "Andu Bandu", artistId: "ar1", album: "Matio Na Beshi", albumId: "al1", artwork: art("s7"), duration: 204, plays: "8,102", audioUrl: null },
  { id: "s8", title: "Akash Chuye Dekha", artist: "Mira Solen", artistId: "ar2", album: "Kunbay Aisot", albumId: "al2", artwork: art("s8"), duration: 191, plays: "6,743", audioUrl: null },
  { id: "s9", title: "Rong Beronger Shopno", artist: "Kalo Rhen", artistId: "ar3", album: "Loren Skai", albumId: "al3", artwork: art("s9"), duration: 210, plays: "13,590", audioUrl: null },
  { id: "s10", title: "Dure Theko Na", artist: "Ives Duna", artistId: "ar4", album: "Field Notes", albumId: "al4", artwork: art("s10"), duration: 187, plays: "4,981", audioUrl: null },
  { id: "s11", title: "Jol Rong Bikel", artist: "Tor Zeta", artistId: "ar5", album: "Anthem Hours", albumId: "al5", artwork: art("s11"), duration: 199, plays: "10,236", audioUrl: null },
  { id: "s12", title: "Nishash Bhora Gaan", artist: "Nima Vosk", artistId: "ar6", album: "Late Signals", albumId: "al6", artwork: art("s12"), duration: 205, plays: "3,764", audioUrl: null },
];

export const albums = [
  { id: "al1", title: "Matio Na Beshi", artist: "Andu Bandu", artistId: "ar1", artwork: art("s1"), year: 2025, songIds: ["s1", "s7"] },
  { id: "al2", title: "Kunbay Aisot", artist: "Mira Solen", artistId: "ar2", artwork: art("s2"), year: 2024, songIds: ["s2", "s8"] },
  { id: "al3", title: "Loren Skai", artist: "Kalo Rhen", artistId: "ar3", artwork: art("s3"), year: 2025, songIds: ["s3", "s9"] },
  { id: "al4", title: "Field Notes", artist: "Ives Duna", artistId: "ar4", artwork: art("s4"), year: 2023, songIds: ["s4", "s10"] },
  { id: "al5", title: "Anthem Hours", artist: "Tor Zeta", artistId: "ar5", artwork: art("s5"), year: 2024, songIds: ["s5", "s11"] },
  { id: "al6", title: "Late Signals", artist: "Nima Vosk", artistId: "ar6", artwork: art("s6"), year: 2026, songIds: ["s6", "s12"] },
];

export const playlists = [
  { id: "p1", title: "Listen Again", isSystem: true, artwork: art("p1"), trackCount: 6, songIds: ["s1", "s2", "s3", "s4", "s5", "s6"] },
  { id: "p2", title: "Quick Picks", isSystem: true, artwork: art("p2"), trackCount: 12, songIds: songs.map((s) => s.id) },
  { id: "p3", title: "Mixed for You", isSystem: true, artwork: art("p3"), trackCount: 8, songIds: ["s7", "s8", "s9", "s10", "s11", "s12", "s1", "s2"] },
  { id: "p4", title: "Late Night Drive", isSystem: false, artwork: art("p4"), trackCount: 14, songIds: ["s2", "s5", "s9", "s11"] },
  { id: "p5", title: "Morning Focus", isSystem: false, artwork: art("p5"), trackCount: 20, songIds: ["s4", "s6", "s10", "s12"] },
  { id: "p6", title: "Workout Energy", isSystem: false, artwork: art("p6"), trackCount: 18, songIds: ["s1", "s3", "s7", "s9"] },
];

export const moodFilters = ["Work out", "Focus", "Relax", "Commute", "Energize"];

export const moodsAndGenres = [
  { id: "g1", name: "Pop", color: "#FF5A5F" },
  { id: "g2", name: "Hip-Hop", color: "#FFB400" },
  { id: "g3", name: "Rock", color: "#2E86DE" },
  { id: "g4", name: "Electronic", color: "#8E44AD" },
  { id: "g5", name: "Indie", color: "#16A085" },
  { id: "g6", name: "Chill", color: "#E67E22" },
];

export const exploreShortcuts = [
  { id: "ex1", title: "New releases", color: "#111111" },
  { id: "ex2", title: "Charts", color: "#2E86DE" },
  { id: "ex3", title: "Moods & genres", color: "#8E44AD" },
  { id: "ex4", title: "Trending", color: "#FF5A5F" },
];

// Top 50 charts — reuse songs cyclically with synthetic rank/position deltas
const buildChart = (count) =>
  Array.from({ length: count }, (_, i) => {
    const base = songs[i % songs.length];
    return { ...base, rank: i + 1, id: `chart-${base.id}-${i}` };
  });

export const topSongsChart = buildChart(20);
export const topVideosChart = buildChart(20);
export const trendingArtistsChart = artists.map((a, i) => ({ ...a, rank: i + 1 }));

export const recentSearches = ["Andu Bandu", "Late Night Drive", "Ekon Tui Kita Korte", "Rock"];

export const mockLyrics = `Ekon tui kita korte
Ami khuji shudhu tor kotha
Rate joto tara jole
Tumi shei alo, ogochita

Chorus
Ekon tui kita korte
Ami dariye ekla pothe
Hariye jaoya shobdo gulo
Firiye dao amar rate

Bridge
Jani na kobe firbe tumi
Opekkha kori protidin
Ekon tui kita korte
Bolo na, koto aro din

Ekon tui kita korte
Ami khuji shudhu tor kotha
Rate joto tara jole
Tumi shei alo, ogochita`;

export const relatedTracks = (currentSongId) =>
  songs.filter((s) => s.id !== currentSongId).slice(0, 6);

export const findSong = (id) => songs.find((s) => s.id === id);

export const allSearchable = {
  songs,
  albums,
  artists,
};
