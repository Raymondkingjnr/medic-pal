import { Slot } from "expo-router";
import AuthProvider from "@/app/provider/Provider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
