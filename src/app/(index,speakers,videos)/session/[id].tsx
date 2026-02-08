import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Share } from "react-native";
import * as AC from "@bacons/apple-colors";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useConferenceData } from "@/components/conference-data";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

export default function SessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading } = useConferenceData();

  const session = useMemo(
    () => data?.sessions.find((s) => s.id === id),
    [data, id]
  );

  const speakerDetails = useMemo(
    () =>
      session?.speakers
        .map((sid) => data?.speakers.find((s) => s.id === sid))
        .filter(Boolean) ?? [],
    [session, data]
  );

  const roomName = useMemo(() => {
    if (!session || !data?.rooms) return "";
    return data.rooms.find((r) => r.id === session.roomId)?.name ?? "";
  }, [session, data]);

  const description = useMemo(() => {
    if (!session) return "";
    return (
      session.description ||
      session.questionAnswers?.find((qa) => qa.questionId === 99885)
        ?.answerValue ||
      "No description available"
    );
  }, [session]);

  const shareSession = () => {
    Share.share({
      message: `Check out "${session?.title}" at React Conf 2025`,
    });
  };

  if (loading || !session || !data) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16 }}
      >
        <Text style={{ fontSize: 17, color: AC.secondaryLabel, textAlign: "center", marginTop: 80 }}>
          {loading ? "Loading..." : "Session not found"}
        </Text>
      </ScrollView>
    );
  }

  const durationMin = Math.round(
    (new Date(session.endsAt).getTime() -
      new Date(session.startsAt).getTime()) /
      60000
  );

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        <Link.AppleZoomTarget>
          <View
            style={{
              backgroundColor: AC.secondarySystemGroupedBackground,
              borderRadius: 20,
              borderCurve: "continuous",
              padding: 20,
              gap: 16,
            }}
          >
            <Text
              selectable
              style={{ fontSize: 26, fontWeight: "700", color: AC.label }}
            >
              {session.title}
            </Text>

            {/* Speakers */}
            <View style={{ gap: 12 }}>
              {speakerDetails.map((speaker: any) => (
                <Link key={speaker.id} href={`/speaker/${speaker.id}`} asChild>
                  <Link.Trigger withAppleZoom>
                    <Pressable
                      style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
                    >
                      {speaker.profilePicture ? (
                        <Image
                          source={{ uri: speaker.profilePicture }}
                          style={{ width: 52, height: 52, borderRadius: 26 }}
                          contentFit="cover"
                        />
                      ) : (
                        <View
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: AC.systemBlue,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source="sf:person.fill"
                            style={{ fontSize: 22, color: "white" }}
                          />
                        </View>
                      )}
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          selectable
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: AC.label,
                          }}
                        >
                          {speaker.fullName}
                        </Text>
                        {speaker.tagLine ? (
                          <Text
                            style={{ fontSize: 14, color: AC.secondaryLabel }}
                          >
                            {speaker.tagLine}
                          </Text>
                        ) : null}
                      </View>
                      <Image
                        source="sf:chevron.right"
                        style={{ fontSize: 14, color: AC.tertiaryLabel }}
                      />
                    </Pressable>
                  </Link.Trigger>
                  <Link.Preview />
                </Link>
              ))}
            </View>
          </View>
        </Link.AppleZoomTarget>

        {/* Session info card */}
        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 16,
            gap: 14,
          }}
        >
          <InfoRow
            label="Time"
            value={new Date(session.startsAt).toLocaleString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <InfoRow label="Duration" value={`${durationMin} minutes`} />
          {roomName ? <InfoRow label="Room" value={roomName} /> : null}
        </View>

        {/* Description */}
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
            {description}
          </Text>
        </View>
      </ScrollView>

      <Stack.Screen options={{ title: session.title }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          onPress={shareSession}
        />
        <Stack.Toolbar.Button icon="star" onPress={() => {}} />
      </Stack.Toolbar>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{ fontSize: 15, fontWeight: "500", color: AC.secondaryLabel }}
      >
        {label}
      </Text>
      <Text
        selectable
        style={{
          fontSize: 15,
          color: AC.label,
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value}
      </Text>
    </View>
  );
}
