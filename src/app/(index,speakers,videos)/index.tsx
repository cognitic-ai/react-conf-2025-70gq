import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import * as AC from "@bacons/apple-colors";
import { Link, Stack } from "expo-router";
import { Image } from "expo-image";
import { useConferenceData } from "@/components/conference-data";
import useSearch from "@/components/use-search";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

export default function ScheduleScreen() {
  const { data, loading } = useConferenceData();
  const search = useSearch({ placeholder: "Search sessions..." });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const conferenceDays = useMemo(() => {
    if (!data?.sessions) return [];
    const dates = data.sessions.map(
      (session) => new Date(session.startsAt).toDateString()
    );
    return [...new Set(dates)].sort();
  }, [data]);

  const sessionsForDay = useMemo(() => {
    if (!data?.sessions || conferenceDays.length === 0) return data?.sessions ?? [];
    const selectedDay = conferenceDays[selectedDayIndex];
    return data.sessions.filter(
      (s) => new Date(s.startsAt).toDateString() === selectedDay
    );
  }, [data, conferenceDays, selectedDayIndex]);

  const filteredSessions = useMemo(() => {
    if (!search) return sessionsForDay;
    const q = search.toLowerCase();
    return sessionsForDay.filter(
      (session) =>
        session.title.toLowerCase().includes(q) ||
        session.speakers.some((sid) => {
          const speaker = data?.speakers.find((s) => s.id === sid);
          return speaker?.fullName.toLowerCase().includes(q);
        }) ||
        session.description?.toLowerCase().includes(q)
    );
  }, [sessionsForDay, search, data]);

  if (loading) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <Text style={{ fontSize: 17, color: AC.secondaryLabel, textAlign: "center", marginTop: 80 }}>
            Loading sessions...
          </Text>
        }
      />
    );
  }

  return (
    <FlatList
      data={filteredSessions}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 12 }}
      ListHeaderComponent={
        <>
          <Text
            style={{
              fontSize: 15,
              color: AC.secondaryLabel,
              marginBottom: 8,
            }}
          >
            {filteredSessions.length} sessions
          </Text>
          {conferenceDays.length > 1 && (
            <SegmentedControl
              values={conferenceDays.map((day) => {
                const date = new Date(day);
                return date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
              })}
              selectedIndex={selectedDayIndex}
              onChange={(e) =>
                setSelectedDayIndex(e.nativeEvent.selectedSegmentIndex)
              }
              style={{ marginBottom: 4 }}
            />
          )}
        </>
      }
      renderItem={({ item }) => (
        <SessionCard session={item} speakers={data?.speakers ?? []} />
      )}
      ListEmptyComponent={
        <View
          style={{
            alignItems: "center",
            paddingTop: 80,
            gap: 12,
          }}
        >
          <Image
            source="sf:magnifyingglass"
            style={{ fontSize: 40, color: AC.systemGray }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: AC.label,
            }}
          >
            No sessions found
          </Text>
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>
            Try adjusting your search
          </Text>
        </View>
      }
    />
  );
}

function SessionCard({
  session,
  speakers,
}: {
  session: any;
  speakers: any[];
}) {
  const firstSpeaker = speakers.find((s) => s.id === session.speakers[0]);

  return (
    <Link href={`/session/${session.id}`} asChild>
      <Link.Trigger>
        <Pressable
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <View style={{ padding: 14, gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {firstSpeaker?.profilePicture ? (
                <Link.AppleZoom>
                  <Image
                    source={{ uri: firstSpeaker.profilePicture }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </Link.AppleZoom>
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: AC.systemBlue,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source="sf:person.fill"
                    style={{ fontSize: 20, color: "white" }}
                  />
                </View>
              )}
              <View style={{ flex: 1, justifyContent: "center", gap: 3 }}>
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
                <Text
                  selectable
                  style={{ fontSize: 15, color: AC.secondaryLabel }}
                >
                  {session.speakers
                    .map((id: string) => speakers.find((s) => s.id === id)?.fullName)
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: AC.tertiaryLabel,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {new Date(session.startsAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Image
                source="sf:chevron.right"
                style={{ fontSize: 14, color: AC.tertiaryLabel }}
              />
            </View>
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction title="Share Session" icon="square.and.arrow.up" onPress={() => {}} />
        <Link.MenuAction title="Add to Favorites" icon="star" onPress={() => {}} />
      </Link.Menu>
    </Link>
  );
}
