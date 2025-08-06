import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { DemoDoctors, demoReviews } from "@/constants/data";
import DoctorCard from "@/components/doctor-card";
import ReviewCard from "@/components/review-card";

const DoctorDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = DemoDoctors.find((doc) => doc.id === Number(id));
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>{doctor.name}</Text>
        </View>
        <View style={styles.docDet}>
          <DoctorCard Items={doctor} />
          <TouchableOpacity style={styles.bookbtn}>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Spartan_600SemiBold",
                textAlign: "center",
                fontSize: 18,
              }}
            >
              Book An Appointment
            </Text>
          </TouchableOpacity>
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
                  color={"#1C2A3A"}
                  size={40}
                />
              </View>
              <Text style={styles.allText}>2000+</Text>
              <Text style={styles.allText}>Patients</Text>
            </View>
            <View>
              <View style={styles.iconCover}>
                <Ionicons name="trophy-sharp" color={"#1C2A3A"} size={40} />
              </View>
              <Text style={styles.allText}>10+</Text>
              <Text style={styles.allText}>Experience</Text>
            </View>
            <View>
              <View style={styles.iconCover}>
                <Ionicons name="star-sharp" color={"#1C2A3A"} size={40} />
              </View>
              <Text style={styles.allText}>4.5</Text>
              <Text style={styles.allText}>Rating</Text>
            </View>
            <View>
              <View style={styles.iconCover}>
                <Ionicons
                  name="mail-unread-sharp"
                  color={"#1C2A3A"}
                  size={40}
                />
              </View>
              <Text style={styles.allText}>20+</Text>
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
              possimus qui fugit autem, perferendis quis vitae id animi
              assumenda repellendus iste beatae quae eos placeat praesentium
              obcaecati incidunt hic quos soluta et alias, facilis ex tempora
              reprehenderit. Ipsam, voluptas ea?
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
  bookbtn: {
    backgroundColor: "#1C2A3A",
    borderRadius: 15,
    paddingVertical: 17,
    marginVertical: 10,
  },
  iconCover: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    borderRadius: 9999,
    backgroundColor: "#F0F0F0",
    marginBottom: 6,
  },
  allText: {
    textAlign: "center",
    paddingVertical: 2,
    fontFamily: "Spartan_700Bold",
    fontSize: 13,
  },
});
