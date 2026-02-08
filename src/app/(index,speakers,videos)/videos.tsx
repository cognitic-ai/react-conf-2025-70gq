import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useConferenceData } from "@/components/conference-data";
import { Stack } from "expo-router";

// Featured React Conf talks with video content
const REACT_CONF_VIDEOS = [
  {
    id: "v1",
    title: "React Conf 2025 - Day 1 Keynote",
    speaker: "React Team",
    thumbnail: "https://img.youtube.com/vi/YBXOcJybXBs/maxresdefault.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "45:00",
  },
  {
    id: "v2",
    title: "What's New in React 19",
    speaker: "React Core Team",
    thumbnail: "https://img.youtube.com/vi/T8TZQ6k4SLE/maxresdefault.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "32:00",
  },
  {
    id: "v3",
    title: "Server Components Deep Dive",
    speaker: "React Team",
    thumbnail: "https://img.youtube.com/vi/6jM_0wDOw4g/maxresdefault.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "28:00",
  },
  {
    id: "v4",
    title: "Building for the Future with Expo",
    speaker: "Expo Team",
    thumbnail: "https://img.youtube.com/vi/SqrbwGKKz6I/maxresdefault.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: "35:00",
  },
  {
    id: "v5",
    title: "React Native - The New Architecture",
    speaker: "Meta Engineering",
    thumbnail: "https://img.youtube.com/vi/Nqp8olSHTwo/maxresdefault.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    duration: "40:00",
  },
];

export default function VideosScreen() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <>
      <FlatList
        data={REACT_CONF_VIDEOS}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        ListHeaderComponent={
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>
            Featured talks and highlights
          </Text>
        }
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            isActive={activeVideoId === item.id}
            onPlay={() => setActiveVideoId(item.id)}
          />
        )}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="line.3.horizontal.decrease">
          <Stack.Toolbar.MenuAction icon="clock" isOn>
            Most Recent
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="flame">
            Most Popular
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="textformat.size">
            By Title
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
  );
}

function VideoCard({
  video,
  isActive,
  onPlay,
}: {
  video: (typeof REACT_CONF_VIDEOS)[number];
  isActive: boolean;
  onPlay: () => void;
}) {
  if (isActive) {
    return <ActiveVideoPlayer video={video} />;
  }

  return (
    <Pressable
      onPress={onPlay}
      style={{
        backgroundColor: AC.secondarySystemGroupedBackground,
        borderRadius: 20,
        borderCurve: "continuous",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: video.thumbnail }}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          contentFit="cover"
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "rgba(255,255,255,0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source="sf:play.fill"
              style={{ fontSize: 24, color: AC.systemBlue }}
            />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "white",
              fontVariant: ["tabular-nums"],
            }}
          >
            {video.duration}
          </Text>
        </View>
      </View>
      <View style={{ padding: 14, gap: 4 }}>
        <Text
          selectable
          style={{ fontSize: 17, fontWeight: "600", color: AC.label }}
        >
          {video.title}
        </Text>
        <Text style={{ fontSize: 14, color: AC.secondaryLabel }}>
          {video.speaker}
        </Text>
      </View>
    </Pressable>
  );
}

function ActiveVideoPlayer({
  video,
}: {
  video: (typeof REACT_CONF_VIDEOS)[number];
}) {
  const player = useVideoPlayer(video.videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  return (
    <View
      style={{
        backgroundColor: AC.secondarySystemGroupedBackground,
        borderRadius: 20,
        borderCurve: "continuous",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <VideoView
        player={player}
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        allowsPictureInPicture
        nativeControls
      />
      <View style={{ padding: 14, gap: 4 }}>
        <Text
          selectable
          style={{ fontSize: 17, fontWeight: "600", color: AC.label }}
        >
          {video.title}
        </Text>
        <Text style={{ fontSize: 14, color: AC.secondaryLabel }}>
          {video.speaker}
        </Text>
      </View>
    </View>
  );
}
