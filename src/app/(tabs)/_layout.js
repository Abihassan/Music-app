// /app/(tabs)/_layout.js
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import MiniPlayer from "../../components/MiniPlayer";
import { colors } from "../../constants/theme";

const TAB_BAR_HEIGHT = 58;

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.black,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="library" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="upgrade"
          options={{
            title: "Upgrade",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="diamond" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <MiniPlayer bottomOffset={TAB_BAR_HEIGHT + 6} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    paddingBottom: 6,
    paddingTop: 6,
  },
});
