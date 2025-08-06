import React from "react";
import { Stack, Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
            <Feather
              name="home"
              color={`${focused ? (color = "#4B5563") : (color = "#9CA3AF")}`}
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
            <Entypo
              name="location"
              color={`${focused ? (color = "#4B5563") : (color = "#9CA3AF")}`}
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
            <FontAwesome
              name="calendar"
              color={`${focused ? (color = "#4B5563") : (color = "#9CA3AF")}`}
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
            <FontAwesome5
              name="user"
              color={`${focused ? (color = "#4B5563") : (color = "#9CA3AF")}`}
              size={20}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
