import React, { createContext, useEffect, useState } from "react";

export interface Speaker {
  id: string;
  fullName: string;
  bio: string;
  tagLine: string;
  profilePicture: string;
  links: { title: string; url: string; linkType: string }[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  roomId: number;
  speakers: string[];
  status: string;
  questionAnswers: { questionId: number; answerValue: string }[];
}

export interface Room {
  id: number;
  name: string;
}

export interface ConferenceData {
  sessions: Session[];
  speakers: Speaker[];
  rooms: Room[];
}

export const ConferenceDataContext = createContext<{
  data: ConferenceData | null;
  loading: boolean;
}>({ data: null, loading: true });

export function ConferenceDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<ConferenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://sessionize.com/api/v2/7l5wob2t/view/All")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching conference data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <ConferenceDataContext value={{ data, loading }}>
      {children}
    </ConferenceDataContext>
  );
}

export function useConferenceData() {
  return React.use(ConferenceDataContext);
}
