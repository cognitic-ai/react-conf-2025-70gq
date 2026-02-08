import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Share } from "react-native";
import * as AC from "@bacons/apple-colors";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useConferenceData } from "@/components/conference-data";

export default function SpeakerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading } = useConferenceData();

  const speaker = useMemo(
    () => data?.speakers.find((s) => s.id === id),
    [data, id]
  );

  const speakerSessions = useMemo(
    () =>
      data?.sessions.filter((s) => s.speakers.includes(id ?? "")) ?? [],
    [data, id]
  );

  const shareSpeaker = () => {
    Share.share({
      message: `Check out ${speaker?.fullName} at React Conf 2025`,
    });
  };

  if (loading || !speaker) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16 }}
      >
        <Text
          style={{
            fontSize: 17,
            color: AC.secondaryLabel,
            textAlign: "center",
            marginTop: 80,
          }}
        >
          {loading ? "Loading..." : "Speaker not found"}
        </Text>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {/* Hero section with zoom target */}
        <Link.AppleZoomTarget>
          <View
            style={{
              backgroundColor: AC.secondarySystemGroupedBackground,
              borderRadius: 24,
              borderCurve: "continuous",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {speaker.profilePicture ? (
              <Image
                source={{ uri: speaker.profilePicture }}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  backgroundColor: AC.systemBlue,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source="sf:person.fill"
                  style={{ fontSize: 80, color: "white" }}
                />
              </View>
            )}
            <View style={{ padding: 20, gap: 6 }}>
              <Text
                selectable
                style={{ fontSize: 28, fontWeight: "700", color: AC.label }}
              >
                {speaker.fullName}
              </Text>
              {speaker.tagLine ? (
                <Text
                  selectable
                  style={{ fontSize: 17, color: AC.secondaryLabel }}
                >
                  {speaker.tagLine}
                </Text>
              ) : null}
            </View>
          </View>
        </Link.AppleZoomTarget>

        {/* Bio */}
        {speaker.bio ? (
          <View
            style={{
              backgroundColor: AC.secondarySystemGroupedBackground,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 16,
              gap: 8,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: AC.label }}
            >
              About
            </Text>
            <Text
              selectable
              style={{ fontSize: 16, color: AC.label, lineHeight: 24 }}
            >
              {speaker.bio}
            </Text>
          </View>
        ) : null}

        {/* Links */}
        {speaker.links?.length > 0 ? (
          <View
            style={{
              backgroundColor: AC.secondarySystemGroupedBackground,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 16,
              gap: 10,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "600", color: AC.label }}
            >
              Links
            </Text>
            {speaker.links.map((link, i) => (
              <View key={i} style={{ gap: 2 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: AC.secondaryLabel,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {link.title}
                </Text>
                <Text
                  selectable
                  style={{ fontSize: 15, color: AC.systemBlue }}
                >
                  {link.url}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Sessions by this speaker */}
        {speakerSessions.length > 0 ? (
          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: AC.label,
                paddingHorizontal: 4,
              }}
            >
              Sessions
            </Text>
            {speakerSessions.map((session) => (
              <Link
                key={session.id}
                href={`/session/${session.id}`}
                asChild
              >
                <Link.Trigger>
                  <Pressable
                    style={{
                      backgroundColor: AC.secondarySystemGroupedBackground,
                      borderRadius: 16,
                      borderCurve: "continuous",
                      padding: 14,
                      gap: 6,
                    }}
                  >
                    <Text
                      selectable
                      style={{
                        fontSize: 17,
                        fontWeight: "600",
                        color: AC.label,
                      }}
                    >
                      {session.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: AC.secondaryLabel,
                          fontVariant: ["tabular-nums"],
                        }}
                      >
                        {new Date(session.startsAt).toLocaleString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Image
                        source="sf:chevron.right"
                        style={{ fontSize: 14, color: AC.tertiaryLabel }}
                      />
                    </View>
                  </Pressable>
                </Link.Trigger>
                <Link.Preview />
              </Link>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <Stack.Screen options={{ title: speaker.fullName }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          onPress={shareSpeaker}
        />
      </Stack.Toolbar>
    </>
  );
}
