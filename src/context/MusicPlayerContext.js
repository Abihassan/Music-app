// /context/MusicPlayerContext.js
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { songs as allSongs } from "../data/mockData";

const MusicPlayerContext = createContext(null);

const TICK_MS = 500;

export function MusicPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // seconds
  const [queueList, setQueueList] = useState([]);
  const [history, setHistory] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // off | all | one
  const [likedIds, setLikedIds] = useState([]);

  // expo-audio's AudioPlayer instance, created lazily and reused via
  // player.replace() for every subsequent track — matches the guidance in
  // the expo-audio docs to avoid tearing down/recreating a player per track.
  const playerRef = useRef(null);
  const statusSubRef = useRef(null);
  const tickRef = useRef(null);
  const handleTrackEndRef = useRef(() => {});

  // Because this dataset ships without real audio files, playback is
  // simulated with a local timer that advances `playbackProgress`. If real
  // audio assets are supplied (track.audioUrl), the same context swaps to
  // driving expo-audio's AudioPlayer instead — see loadTrack() below.
  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "duck",
    });

    return () => {
      clearTick();
      statusSubRef.current?.remove?.();
      playerRef.current?.remove?.();
    };
  }, [clearTick]);

  const attachStatusListener = useCallback((player) => {
    statusSubRef.current?.remove?.();
    statusSubRef.current = player.addListener("playbackStatusUpdate", (status) => {
      if (!status.isLoaded) return;
      setIsPlaying(status.playing);
      setPlaybackProgress(status.currentTime ?? 0);
      if (status.didJustFinish) {
        handleTrackEndRef.current();
      }
    });
  }, []);

  const advanceTick = useCallback(() => {
    setPlaybackProgress((prev) => {
      if (!currentTrack) return prev;
      const next = prev + TICK_MS / 1000;
      if (next >= currentTrack.duration) {
        handleTrackEndRef.current();
        return 0;
      }
      return next;
    });
  }, [currentTrack]);

  // Only run the simulated timer for tracks without a real audioUrl — real
  // tracks get their progress from expo-audio's playbackStatusUpdate event.
  useEffect(() => {
    clearTick();
    if (isPlaying && currentTrack && !currentTrack.audioUrl) {
      tickRef.current = setInterval(advanceTick, TICK_MS);
    }
    return clearTick;
  }, [isPlaying, currentTrack, advanceTick, clearTick]);

  const loadTrack = useCallback(
    async (track, queue) => {
      setCurrentTrack(track);
      setPlaybackProgress(0);
      setIsPlaying(true);

      if (queue) setQueueList(queue);

      setHistory((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 30));

      if (track.audioUrl) {
        try {
          if (!playerRef.current) {
            playerRef.current = createAudioPlayer(track.audioUrl);
            attachStatusListener(playerRef.current);
          } else {
            playerRef.current.replace(track.audioUrl);
          }
          playerRef.current.play();
        } catch (e) {
          // Fall back silently to simulated playback if the source fails.
        }
      } else if (playerRef.current) {
        // Switching to a mock track — make sure a previously loaded real
        // player doesn't keep playing underneath the simulated timer.
        try {
          playerRef.current.pause();
        } catch (e) {
          // no-op
        }
      }
    },
    [attachStatusListener]
  );

  const playTrack = useCallback(
    async (track, queueOverride) => {
      const queue = queueOverride ?? allSongs;
      await loadTrack(track, queue);
    },
    [loadTrack]
  );

  const togglePlayPause = useCallback(() => {
    if (currentTrack?.audioUrl && playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
    setIsPlaying((prev) => !prev);
  }, [currentTrack, isPlaying]);

  const getAdjacent = useCallback(
    (direction) => {
      if (!currentTrack || queueList.length === 0) return null;
      if (shuffle) {
        const candidates = queueList.filter((t) => t.id !== currentTrack.id);
        if (candidates.length === 0) return currentTrack;
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
      const idx = queueList.findIndex((t) => t.id === currentTrack.id);
      if (idx === -1) return queueList[0];
      const nextIdx = (idx + direction + queueList.length) % queueList.length;
      return queueList[nextIdx];
    },
    [currentTrack, queueList, shuffle]
  );

  const skipToNext = useCallback(async () => {
    const next = getAdjacent(1);
    if (next) await loadTrack(next);
  }, [getAdjacent, loadTrack]);

  const skipToPrevious = useCallback(async () => {
    if (playbackProgress > 3) {
      setPlaybackProgress(0);
      if (currentTrack?.audioUrl && playerRef.current) {
        playerRef.current.seekTo(0);
      }
      return;
    }
    const prev = getAdjacent(-1);
    if (prev) await loadTrack(prev);
  }, [getAdjacent, loadTrack, playbackProgress, currentTrack]);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === "one") {
      setPlaybackProgress(0);
      if (currentTrack?.audioUrl && playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.play();
      }
      return;
    }
    const isLast =
      currentTrack && queueList.findIndex((t) => t.id === currentTrack.id) === queueList.length - 1;
    if (isLast && repeatMode === "off" && !shuffle) {
      setIsPlaying(false);
      setPlaybackProgress(0);
      if (currentTrack?.audioUrl && playerRef.current) {
        playerRef.current.pause();
        playerRef.current.seekTo(0);
      }
      return;
    }
    skipToNext();
  }, [repeatMode, currentTrack, queueList, shuffle, skipToNext]);

  // Kept in a ref so the playbackStatusUpdate listener and the simulated
  // timer (both defined before handleTrackEnd) always call the latest
  // version without needing to be re-subscribed on every render.
  useEffect(() => {
    handleTrackEndRef.current = handleTrackEnd;
  }, [handleTrackEnd]);

  const seekTo = useCallback(
    (seconds) => {
      setPlaybackProgress(seconds);
      if (currentTrack?.audioUrl && playerRef.current) {
        playerRef.current.seekTo(seconds);
      }
    },
    [currentTrack]
  );

  const toggleShuffle = useCallback(() => setShuffle((p) => !p), []);
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      const order = ["off", "all", "one"];
      return order[(order.indexOf(prev) + 1) % order.length];
    });
  }, []);

  const toggleLike = useCallback((songId) => {
    setLikedIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  }, []);

  const removeFromQueue = useCallback((songId) => {
    setQueueList((prev) => prev.filter((t) => t.id !== songId));
  }, []);

  const reorderQueue = useCallback((fromIndex, toIndex) => {
    setQueueList((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    playbackProgress,
    queueList,
    history,
    shuffle,
    repeatMode,
    likedIds,
    playTrack,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
    toggleLike,
    removeFromQueue,
    reorderQueue,
  };

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  return ctx;
}
