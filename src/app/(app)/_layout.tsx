import { Stack } from "expo-router";
import { useAuth } from "@/app/provider/Provider";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public routes */}
      <Stack.Screen name="index" /> {/* Onboarding screen */}
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
      {/* Protected routes - only visible when authenticated */}
      {session && (
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: true,
            animationTypeForReplace: "push",
          }}
        />
      )}
    </Stack>
  );
}
