import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { categories, DemoDoctors } from "@/constants/data";

import DoctorCard from "@/components/doctor-card";

const categoryName = ["All", ...categories.map((names) => names.name)];

const Doctors = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexTop}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>
        <Text style={styles.HeaderText}>All Doctors</Text>
      </View>
      <View style={styles.relativeform}>
        <TextInput
          style={styles.input}
          placeholder="Search Doctor"
          placeholderTextColor="#9CA3AF"
          autoCapitalize={"none"}
        />
      </View>
      <View>
        <FlatList
          data={categoryName}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            marginVertical: 6,
            gap: 2,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tabContainer}>
              <Text style={styles.tabText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.doctorsFound}>
        <Text style={[styles.tabText, styles.doctorsFoundText]}>
          300 Doctors Found
        </Text>

        <FlatList
          data={DemoDoctors}
          keyExtractor={(item) => item.id.toLocaleString()}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <DoctorCard
              Items={item}
              onClick={() => router.push(`/doctor-details?id=${item.id}`)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Doctors;

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
  tabContainer: {
    backgroundColor: "#ffff",
    paddingHorizontal: 10,
    borderRadius: 20,
    padding: 10,
    height: 36,
    borderWidth: 1,
    borderColor: "#1C2A3A",
    width: "auto",
  },
  tabText: {
    fontFamily: "Spartan_600SemiBold",
    color: "#222930",
    fontWeight: "500",
    paddingBottom: 10,
    textTransform: "capitalize",
  },
  HeaderText: {
    fontSize: 20,
    fontFamily: "Spartan_700Bold",
    textAlign: "center",
  },
  relativeform: {
    position: "relative",
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    marginTop: 20,
  },

  input: {
    color: "#1C2A3A",
    fontFamily: "Spartan_600SemiBold",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    height: 45,
    borderRadius: 7,
    fontSize: 18,
    paddingLeft: 10,
    width: "100%",
    fontWeight: "500",
  },
  doctorsFound: {
    flex: 1,
    paddingHorizontal: 7,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#fdfdfd",
  },
  doctorsFoundText: {
    fontFamily: "Spartan_800ExtraBold",
  },
});
