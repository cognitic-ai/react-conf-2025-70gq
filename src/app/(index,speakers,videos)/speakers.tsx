import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import * as AC from "@bacons/apple-colors";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { useConferenceData } from "@/components/conference-data";
import useSearch from "@/components/use-search";

export default function SpeakersScreen() {
  const { data, loading } = useConferenceData();
  const search = useSearch({ placeholder: "Search speakers..." });

  const filteredSpeakers = useMemo(() => {
    if (!data?.speakers) return [];
    if (!search) return data.speakers;
    const q = search.toLowerCase();
    return data.speakers.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.tagLine?.toLowerCase().includes(q) ||
        s.bio?.toLowerCase().includes(q)
    );
  }, [data, search]);

  if (loading) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <Text
            style={{
              fontSize: 17,
              color: AC.secondaryLabel,
              textAlign: "center",
              marginTop: 80,
            }}
          >
            Loading speakers...
          </Text>
        }
      />
    );
  }

  return (
    <FlatList
      key="speakers-2col"
      data={filteredSpeakers}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 12 }}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={({ item }) => <SpeakerCard speaker={item} />}
      ListEmptyComponent={
        <View style={{ alignItems: "center", paddingTop: 80, gap: 12 }}>
          <Image
            source="sf:person.slash"
            style={{ fontSize: 40, color: AC.systemGray }}
          />
          <Text
            style={{ fontSize: 18, fontWeight: "600", color: AC.label }}
          >
            No speakers found
          </Text>
        </View>
      }
    />
  );
}

function SpeakerCard({ speaker }: { speaker: any }) {
  return (
    <Link href={`/speaker/${speaker.id}`} asChild>
      <Link.Trigger withAppleZoom>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 20,
            borderCurve: "continuous",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {speaker.profilePicture ? (
            <Image
              source={{ uri: speaker.profilePicture }}
              style={{ width: "100%", aspectRatio: 1 }}
              contentFit="cover"
              cachePolicy="memory-disk"
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
                style={{ fontSize: 48, color: "white" }}
              />
            </View>
          )}
          <View style={{ padding: 12, gap: 3 }}>
            <Text
              selectable
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: AC.label,
              }}
            >
              {speaker.fullName}
            </Text>
            {speaker.tagLine ? (
              <Text
                numberOfLines={2}
                style={{ fontSize: 13, color: AC.secondaryLabel, lineHeight: 17 }}
              >
                {speaker.tagLine}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title="Share Speaker"
          icon="square.and.arrow.up"
          onPress={() => {}}
        />
        <Link.MenuAction
          title="View Sessions"
          icon="calendar"
          onPress={() => {}}
        />
      </Link.Menu>
    </Link>
  );
}
