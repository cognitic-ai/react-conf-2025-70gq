import { useMemo } from "react";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
    ? {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: "transparent" },
        headerTitleStyle: { color: AC.label as any },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: "transparent" },
        headerBlurEffect: "systemChromeMaterial",
        headerBackButtonDisplayMode: "default",
      };

export const unstable_settings = {
  schedule: { anchor: "schedule" },
  speakers: { anchor: "speakers" },
  videos: { anchor: "videos" },
};

export default function SharedLayout({ segment }: { segment: string }) {
  const screen = segment.match(/\((.*)\)/)?.[1]!;

  const titles: Record<string, string> = {
    schedule: "React Conf 2025",
    speakers: "Speakers",
    videos: "Videos",
  };

  const options = useMemo(() => {
    return {
      title: titles[screen] ?? screen,
      headerLargeTitle: true,
    };
  }, [screen]);

  return (
    <Stack screenOptions={AppleStackPreset}>
      <Stack.Screen name={screen} options={options} />
      <Stack.Screen
        name="session/[id]"
        options={{ title: "Session", headerLargeTitle: false }}
      />
      <Stack.Screen
        name="speaker/[id]"
        options={{ title: "Speaker", headerLargeTitle: false }}
      />
    </Stack>
  );
}
