import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Status } from "@/constants/enum";
import { supabase } from "@/lib/supabase";
import AppointmentCard from "@/components/appointment-card";

const Book = () => {
  const [appointment, setAppointment] = useState<IAppointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("client_id", user.id);
        if (!error) {
          setAppointment(data);
        }
      }
    };
    fetchAppointments();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexTop}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Bookings</Text>
      </View>
      <View style={styles.flexStatus}>
        <Text style={styles.statusText}>{Status.UPCOMING}</Text>
        <Text style={styles.statusText}>{Status.CANCELLED}</Text>
        <Text style={styles.statusText}>{Status.COMPLETED}</Text>
      </View>
      <FlatList
        data={appointment}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AppointmentCard card={item} />}
      />
    </SafeAreaView>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Spartan_800ExtraBold",
  },
  flexTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 15,
    maxWidth: 265,
    minWidth: 265,
  },
  flexStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 35,
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    fontFamily: "Spartan_700Bold",
    textTransform: "capitalize",
  },
});
