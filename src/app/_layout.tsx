import { ThemeProvider } from "@/components/theme-provider";
import { ConferenceDataProvider } from "@/components/conference-data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";
import { Tabs as WebTabs } from "expo-router/tabs";
import { useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <ConferenceDataProvider>
        {process.env.EXPO_OS === "web" ? <WebTabsLayout /> : <NativeTabsLayout />}
      </ConferenceDataProvider>
    </ThemeProvider>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
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
  );
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : {
              tabBarPosition: "bottom",
            }),
      }}
    >
      <WebTabs.Screen
        name="(index)"
        options={{
          title: "Schedule",
          tabBarIcon: (props) => <MaterialIcons {...props} name="event" />,
        }}
      />
      <WebTabs.Screen
        name="(speakers)"
        options={{
          title: "Speakers",
          tabBarIcon: (props) => <MaterialIcons {...props} name="people" />,
        }}
      />
      <WebTabs.Screen
        name="(videos)"
        options={{
          title: "Videos",
          tabBarIcon: (props) => <MaterialIcons {...props} name="play-circle-outline" />,
        }}
      />
    </WebTabs>
  );
}
