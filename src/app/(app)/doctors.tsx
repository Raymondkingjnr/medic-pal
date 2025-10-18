import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

import DoctorCard from "@/components/doctor-card";
import { supabase } from "@/lib/supabase";

const Doctors = () => {
  const [doctors, setDoctors] = useState<IDoctors[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const router = useRouter();
  const fetchDoctors = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase.from("doctors").select("*");
    if (error) {
      console.error("Error fetching doctors:", error);
    } else {
      setDoctors(data || []);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const onRefresh = useCallback(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  /** Get category list without duplicates */
  const categories = useMemo(() => {
    const uniqueFields = Array.from(
      new Set(doctors.map((doc) => doc.medical_field))
    );
    return ["All", ...uniqueFields];
  }, [doctors]);

  /** Filtered doctors based on category + search */
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesCategory =
        selectedCategory === "All" || doc.medical_field === selectedCategory;
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [doctors, selectedCategory, search]);

  // const categoryName = ["All", ...doctors.map((names) => names.medical_field)];

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
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.doctorsFound}>
        <Text style={[styles.tabText, styles.doctorsFoundText]}>
          {filteredDoctors.length} Found
        </Text>

        {/* Doctor list */}
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <DoctorCard
              Items={item}
              onClick={() => router.push(`/doctor-details?id=${item.id}`)}
              showFav={true}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3b82f6"]}
              tintColor="#3b82f6"
              title="Pull to refresh doctors"
              titleColor="#3b7280"
            />
          }
          ListHeaderComponent={
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {categories.map((item, index) => {
                  const isActive = item === selectedCategory;
                  const key = index;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.tabContainer,
                        isActive && styles.tabContainerActive,
                      ]}
                      onPress={() => setSelectedCategory(item)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          isActive && styles.tabTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text
                style={{ color: "#666", fontFamily: "Spartan_600SemiBold" }}
              >
                Sorry, can't find any doctors
              </Text>
            </View>
          }
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
    paddingTop: 20,
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
    padding: 8,
    borderWidth: 1,
    borderColor: "#085be2",
    width: "auto",
  },
  tabContainerActive: {
    backgroundColor: "#085be2",
  },
  tabText: {
    fontFamily: "Spartan_600SemiBold",
    color: "#085be2",
    fontWeight: "500",
    textTransform: "capitalize",
    fontSize: 11,
  },
  tabTextActive: {
    color: "#fff",
    fontSize: 11,
  },
  HeaderText: {
    fontSize: 13,
    fontFamily: "Spartan_700Bold",
    textAlign: "center",
    paddingHorizontal: 10,
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
    fontSize: 12,
    paddingTop: 8,
    paddingLeft: 10,
    width: "100%",
    fontWeight: "500",
  },
  doctorsFound: {
    flex: 1,
    paddingHorizontal: 7,
    marginBottom: 10,
    backgroundColor: "#fdfdfd",
  },
  doctorsFoundText: {
    fontFamily: "Spartan_800ExtraBold",
    paddingHorizontal: 6,
    paddingBottom: 9,
    fontSize: 12,
  },
});
