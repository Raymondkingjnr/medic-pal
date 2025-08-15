import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { images } from "@/constants/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const Profile = () => {
  const [profile, setProfile] = useState<IProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error) setProfile(data);
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, []);

  if (loadingProfile) return <ActivityIndicator style={{ flex: 1 }} />;

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert("Logout Failed", error.message);
            } else {
              router.push("/login");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const onHandleEditPage = () => {
    if (profile.is_doctor) {
      router.push("/edit-profile/edit-doc");
    } else router.push("/edit-profile/edit-user");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>
        <View style={styles.profilepic}>
          {profile.is_doctor ? (
            <Image
              source={images.profilePic}
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          ) : (
            <Image
              source={images.user_pic}
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          )}
          <Text
            style={{
              color: "#000",
              fontFamily: "Spartan_700Bold",
              textTransform: "capitalize",
              fontSize: 20,
            }}
          >
            {profile.is_doctor && "Dr."} {profile?.full_name ?? "Not Found"}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            marginTop: 40,
            gap: 25,
            paddingBottom: 40,
          }}
        >
          <TouchableOpacity
            style={styles.quickLinks}
            onPress={onHandleEditPage}
          >
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="person-add-sharp" size={20} />
              </View>
              <Text style={styles.textStyle}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} />
          </TouchableOpacity>

          {!profile.is_doctor && (
            <TouchableOpacity
              style={styles.quickLinks}
              onPress={() => router.push("/doctor-reg")}
            >
              <View style={styles.flex}>
                <View style={styles.icon}>
                  <Ionicons name="medical-sharp" size={20} />
                </View>
                <Text style={styles.textStyle}>Register As a doctor</Text>
              </View>
              <Ionicons name="chevron-forward-sharp" size={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.quickLinks}>
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="heart-sharp" size={20} />
              </View>
              <Text style={styles.textStyle}>Favourite</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinks}>
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="notifications-sharp" size={20} />
              </View>
              <Text style={styles.textStyle}>Notification</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinks}>
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="settings-sharp" size={20} />
              </View>
              <Text style={styles.textStyle}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinks}>
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="help-sharp" size={20} />
              </View>
              <Text style={styles.textStyle}>Help And support</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinks}>
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="shield-sharp" size={20} />
              </View>
              <Text style={styles.textStyle}>terms and condition</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinks} onPress={handleLogout}>
            <View style={styles.flex}>
              <View style={styles.icon}>
                <Ionicons name="log-out-outline" size={20} />
              </View>
              <Text style={styles.textStyle}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profilepic: {
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    height: 40,
    width: 40,
    backgroundColor: "#eeeeee",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "Spartan_700Bold",
    fontSize: 17,
    textTransform: "capitalize",
  },
  quickLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 10,
    borderBottomColor: "#cccccc",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
