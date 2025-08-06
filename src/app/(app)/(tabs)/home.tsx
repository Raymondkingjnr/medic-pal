import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { images } from "@/constants/images";
import { carouselData, categories } from "@/constants/data";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Animated from "react-native-reanimated";
import { router } from "expo-router";

const hospitalData = [
  {
    id: 1,
    image: images.hospital_1,
    title: "sunrise clinic",
    location: "123 Oak Street, CA 98765.",
    km: "2.5 km/40min",
  },
  {
    id: 2,
    image: images.hospital_2,
    title: "Golden Cardiology Center",
    location: "555 Bridge Street, Golden Gate.",
    km: "2.5 km/40min",
  },
  {
    id: 3,
    image: images.hospital_3,
    title: "sunrise clinic",
    location: "123 Oak Street, CA 98765.",
    km: "2.5 km/40min",
  },
];

const Home = () => {
  // const [user, setUser] = React.useState<User>();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  return (
    <SafeAreaView style={styles.home}>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      <ScrollView style={styles.scroll}>
        <View style={styles.flex_between}>
          <Text style={styles.name}>
            {profile ? `Welcome, ${profile?.full_name}` : ""}
          </Text>
          <EvilIcons
            name="bell"
            size={35}
            color="black"
            style={{
              fontWeight: "700",
            }}
          />
        </View>

        <View style={styles.relativeform}>
          <TextInput
            style={styles.input}
            placeholder="Search Doctor"
            placeholderTextColor="#9CA3AF"
            autoCapitalize={"none"}
          />
          <EvilIcons
            style={styles.icon}
            name="search"
            size={30}
            color="#D1D5DB"
          />
        </View>

        <View style={styles.category}>
          <View
            style={{
              paddingTop: 30,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="flex-row justify-between items-center"
          >
            <Text style={{ fontFamily: "Spartan_700Bold", fontSize: 20 }}>
              Categories
            </Text>
            <TouchableOpacity onPress={() => router.push("/doctors")}>
              <Text
                style={{
                  fontFamily: "Spartan_600SemiBold",
                  fontSize: 17,
                  lineHeight: 23,
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              numColumns={4}
              columnWrapperStyle={{
                justifyContent: "space-between",
                gap: 10,
                paddingBottom: 5,
                marginTop: 15,
              }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image source={item.image} style={{ marginBottom: 10 }} />
                  <Text
                    className=" truncate w-[100px]"
                    style={[styles.text, styles.truncatText]}
                  >
                    {item.name.length > 10
                      ? `${item.name.substring(0, 8)}...`
                      : item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              paddingTop: 40,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Spartan_700Bold", fontSize: 20 }}>
              Nearby Medical Centers
            </Text>
            <Text
              style={{
                fontFamily: "Spartan_600SemiBold",
                fontSize: 17,
                lineHeight: 23,
              }}
            >
              See All
            </Text>
          </View>
          <View>
            <Animated.FlatList
              data={hospitalData}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 15 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "column",

                    marginTop: 10,
                  }}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: 300,
                      height: 170,
                      objectFit: "cover",
                      borderRadius: 7,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Spartan_600SemiBold",
                      fontWeight: 600,
                      paddingTop: 10,
                      paddingBottom: 8,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: "#FFFF",
    flex: 1,
    paddingHorizontal: 17,
  },
  scroll: {
    flex: 1,
  },
  category: {
    paddingHorizontal: 17,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Spartan_500Medium",
  },
  truncatText: {
    overflow: "hidden",
  },
  name: {
    fontFamily: "Spartan_600SemiBold",
    paddingTop: 7,
    fontSize: 20,
    textTransform: "capitalize",
  },
  input: {
    color: "#1C2A3A",
    fontFamily: "Spartan_600SemiBold",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    height: 45,
    borderRadius: 7,
    fontSize: 18,
    paddingLeft: 40,
    width: "100%",
    fontWeight: "500",
  },
  relativeform: {
    position: "relative",
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    marginTop: 20,
  },
  icon: {
    position: "absolute",
    bottom: 11,
    left: 10,
  },
  flex_between: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  categories: {
    fontWeight: "700",
    fontFamily: "Spartan_600SemiBold",
    fontSize: 18,
  },
});

export default Home;
