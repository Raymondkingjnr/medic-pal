import { AppState } from "react-native";
import "react-native-url-polyfill";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
// import * as SecureStore from "expo-secure-store";

const supebaseurl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY || "";

export const supabase = createClient(supebaseurl, supabaseAnonKey, {
  auth: {
    // storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
