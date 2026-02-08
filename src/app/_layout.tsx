import { ThemeProvider } from "@/components/theme-provider";
import { ConferenceDataProvider } from "@/components/conference-data";
import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";

export default function Layout() {
  return (
    <ThemeProvider>
      <ConferenceDataProvider>
        <NativeTabs minimizeBehavior="onScrollDown">
          <NativeTabs.Trigger name="(schedule)">
            <Label>Schedule</Label>
            <Icon sf={{ default: "calendar", selected: "calendar" }} />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="(speakers)">
            <Label>Speakers</Label>
            <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="(videos)">
            <Label>Videos</Label>
            <Icon sf={{ default: "play.rectangle", selected: "play.rectangle.fill" }} />
          </NativeTabs.Trigger>
        </NativeTabs>
      </ConferenceDataProvider>
    </ThemeProvider>
  );
}
