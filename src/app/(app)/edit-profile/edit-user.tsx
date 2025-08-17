import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import Custombtn from "@/components/custombtn";

const EditUser = () => {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<IProfile>(null);

  const router = useRouter();

  // fetch profiles

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(data);

        if (error || !data) {
          Alert.alert("Error", "Could not load appointment details.");
          router.back();
          return;
        }
        setEmail(data.email || "");
        setFullname(data.full_name || "");
        setUserName(data.user_name || "");
      }
    };
    fetchProfile();
  }, []);

  const hanldeUserEdit = async () => {
    setLoading(true);

    //   update profile

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: email,
        full_name: fullname,
        user_name: username,
      })
      .eq("id", profile.id);

    if (updateError) {
      Alert.alert("Error", updateError.message);
      setLoading(false);
      return;
    }

    Alert.alert("Success", "Profile updated!");
    router.back();
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>
        <View style={{ paddingHorizontal: 13 }}>
          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter Email"
              style={styles.input}
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Fullname</Text>
            <TextInput
              placeholder="Enter fullname"
              style={styles.input}
              placeholderTextColor="#888"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter username"
              style={styles.input}
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUserName}
            />
          </View>

          <Custombtn
            isLoading={loading}
            text="Update"
            onClick={hanldeUserEdit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  flexTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 26,
    marginTop: 12,
    maxWidth: 250,
    minWidth: 250,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: "Spartan_800ExtraBold",
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 10,
  },
  section: { paddingHorizontal: 10, marginTop: 30 },
  label: {
    fontFamily: "Spartan_700Bold",
    fontSize: 15,
    marginVertical: 5,
    color: "#000",
  },
  input: {
    borderWidth: 2,
    borderColor: "#e3e3e3",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    marginVertical: 6,
    fontSize: 17,
    justifyContent: "center",
    color: "#000",
    fontFamily: "Spartan_600SemiBold",
  },
});
