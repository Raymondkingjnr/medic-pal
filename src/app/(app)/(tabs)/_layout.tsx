import React from "react";
import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          paddingBottom: 65,
          height: 51,

          position: "absolute",
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="home-sharp"
              color={`${focused ? (color = "#1f5feb") : (color = "#9CA3AF")}`}
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "location",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="location-sharp"
              color={`${focused ? (color = "#1f5feb") : (color = "#9CA3AF")}`}
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "book",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="calendar-sharp"
              color={`${focused ? (color = "#1f5feb") : (color = "#9CA3AF")}`}
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="person-sharp"
              color={`${focused ? (color = "#1f5feb") : (color = "#9CA3AF")}`}
              size={20}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
