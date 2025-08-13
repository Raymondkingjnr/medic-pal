import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { demoReviews } from "@/constants/data";
import DoctorCard from "@/components/doctor-card";
import ReviewCard from "@/components/review-card";
import { supabase } from "@/lib/supabase";
import Custombtn from "@/components/custombtn";

const DoctorDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<IDoctors | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return; // Ensure id is present

      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching doctor:", error);
        return;
      }

      setDoctor(data as IDoctors);
    };

    fetchDoctor();
  }, [id]);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <ActivityIndicator size={50} color={"#000"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>{doctor?.name ?? ""}</Text>
        </View>
        <View style={styles.docDet}>
          <DoctorCard Items={doctor} />

          <Custombtn
            text="Book An Appointment"
            onClick={() => router.push(`/appointment-booking?id=${id}`)}
          />
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              marginTop: 20,
              justifyContent: "space-between",
            }}
          >
            <View>
              <View style={styles.iconCover}>
                <Ionicons
                  name="people-circle-sharp"
                  color={"#085be2"}
                  size={40}
                />
              </View>
              <Text style={styles.allText}>
                {doctor?.appointments.length ?? 0}
              </Text>
              <Text style={styles.allText}>Patiants</Text>
            </View>
            <View>
              <View style={styles.iconCover}>
                <Ionicons name="trophy-sharp" color={"#085be2"} size={40} />
              </View>
              <Text style={styles.allText}>
                {doctor?.years_experience ?? 0}+
              </Text>
              <Text style={styles.allText}>Experience</Text>
            </View>
            <View>
              <View style={styles.iconCover}>
                <Ionicons name="star-sharp" color={"#085be2"} size={40} />
              </View>
              <Text style={styles.allText}>{doctor?.rating ?? 0}</Text>
              <Text style={styles.allText}>Rating</Text>
            </View>
            <View>
              <View style={styles.iconCover}>
                <Ionicons
                  name="mail-unread-sharp"
                  color={"#085be2"}
                  size={40}
                />
              </View>
              <Text style={styles.allText}>{doctor?.reviews}</Text>
              <Text style={styles.allText}>Reviews</Text>
            </View>
          </View>

          <View style={{ marginTop: 40, gap: 10 }}>
            <Text style={{ fontFamily: "Spartan_700Bold", fontSize: 20 }}>
              About Me
            </Text>
            <Text
              style={{
                fontFamily: "Spartan_600SemiBold",
                fontSize: 14,
                lineHeight: 23,
                color: "#6B7280",
              }}
            >
              {doctor.about_me}
            </Text>
          </View>

          <View style={{ marginTop: 40, gap: 10 }}>
            <Text style={{ fontFamily: "Spartan_700Bold", fontSize: 20 }}>
              Working Hours
            </Text>
            <Text
              style={{
                fontFamily: "Spartan_600SemiBold",
                fontSize: 14,
                lineHeight: 23,
                color: "#6B7280",
              }}
            >
              Monday-Friday, 08.00 AM-18.00 PM
            </Text>
          </View>

          <View style={{ marginTop: 40, gap: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontFamily: "Spartan_700Bold", fontSize: 20 }}>
                Reviews
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "Spartan_600SemiBold",
                    fontSize: 17,
                    lineHeight: 23,
                  }}
                >
                  {" "}
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <FlatList
            data={demoReviews}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, gap: 20 }}
            keyExtractor={(item) => item.client_name}
            renderItem={({ item }) => <ReviewCard items={item} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDetails;

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
    maxWidth: 290,
    minWidth: 290,
    paddingHorizontal: 10,
  },
  HeaderText: {
    fontSize: 20,
    fontFamily: "Spartan_700Bold",
    textAlign: "center",
  },
  docDet: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },

  iconCover: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    borderRadius: 9999,
    backgroundColor: "#ecf2fb",
    marginBottom: 6,
  },
  allText: {
    textAlign: "center",
    paddingVertical: 2,
    fontFamily: "Spartan_700Bold",
    fontSize: 13,
  },
});
