import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";

import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Status } from "@/constants/enum";
import AppointmentCard from "@/components/appointment-card";
import Custombtn, { TranparentBtn } from "@/components/custombtn";
import { images } from "@/constants/images";

const Home = () => {
  // const [user, setUser] = React.useState<User>();
  const [profile, setProfile] = useState<IProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [appointment, setAppointments] = useState<IAppointment[]>([]);

  const [doctors, setDoctors] = useState<IDoctors[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchAppointments = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        console.warn("No user:", userErr);
        setAppointments([]);

        return;
      }

      // Check if user is a doctor (doctors.user_id = auth.uid())
      const { data: doctorRow, error: doctorErr } = await supabase
        .from("doctors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (doctorErr) {
        console.warn("doctor check error:", doctorErr);
      }

      // Build the base query: include nested doctor object
      // We alias the joined doctors row as "doctor" so it comes back as `doctor`
      let query = supabase
        .from("appointments")
        .select("*, doctor:doctors(*)")
        .limit(1)
        .eq("status", Status.UPCOMING)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      // If user is a doctor, fetch both appointments where they are the doctor OR where they are the client
      if (doctorRow && doctorRow.id) {
        query = query.or(
          `client_id.eq.${user.id},doctor_id.eq.${doctorRow.id}`
        );
      } else {
        // just the client's appointments
        query = query.eq("client_id", user.id);
      }

      // Apply status filter if not "All"

      const { data, error } = await query;

      if (error) {
        console.error("fetch appointments error:", error);
        setAppointments([]);
        return;
      }

      // Map the returned structure so that appointment.doctor_id is the doctor object
      // Supabase returns the joined table under the alias 'doctor'
      const mapped = (data || []).map((a: any) => {
        const copy: any = { ...a };

        if (copy.doctor) {
          // doctor could be an array or object depending on FK relation; normalize to object
          if (Array.isArray(copy.doctor)) {
            copy.doctor_id = copy.doctor[0] ?? copy.doctor_id;
          } else {
            copy.doctor_id = copy.doctor;
          }
          delete copy.doctor;
        }

        // If doctor_id is still a raw uuid string, leave it as is.
        return copy as IAppointment;
      });

      setAppointments(mapped);
    } catch (err) {
      console.error("unexpected fetch error:", err);
      setAppointments([]);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
    setRefreshing(true);

    // Simulate fetching data from API
    setTimeout(() => {
      console.log("Data refreshed");
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCancel = async (appointment: IAppointment) => {
    Alert.alert(
      "Cancel appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const { error } = await supabase
              .from("appointments")
              .update({ status: "cancelled" })
              .eq("id", appointment.id);

            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Cancelled", "Appointment was cancelled.");
              await fetchAppointments();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const handleComplete = async (appointment: IAppointment) => {
    Alert.alert(
      "complete appointment",
      "if you have seen you doctor press yes to make as complete",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const { error } = await supabase
              .from("appointments")
              .update({ status: Status.COMPLETED })
              .eq("id", appointment.id);

            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Completed", "Appointment was Completed.");
              await fetchAppointments();
            }
          },
        },
      ]
      // { cancelable: true }
    );
  };

  const firstAppointment = appointment[0];

  if (loadingProfile) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.home}>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />

      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175fd3"]} // Android
            tintColor="#175fd3" // iOS
          />
        }
      >
        <View style={styles.flex_between}>
          <Text style={styles.name}>
            {profile ? `Welcome, ${profile?.full_name}` : ""}
          </Text>
          <Ionicons name="notifications-sharp" color={"#175fd3"} size={25} />
        </View>

        <View
          style={{
            backgroundColor: "#3B82F6",
            marginHorizontal: 10,
            borderRadius: 14,
            padding: 10,
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Spartan_700Bold",
                fontSize: 15,
                color: "#fff",
              }}
            >
              Upcoming Appointment
            </Text>
            <TouchableOpacity onPress={() => router.push("/book")}>
              <Text
                style={{
                  fontFamily: "Spartan_700Bold",
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {firstAppointment ? (
              <AppointmentCard
                card={firstAppointment}
                onCancle={() => handleCancel(firstAppointment)}
                onComplete={() => handleComplete(firstAppointment)}
                onReeschedule={() =>
                  router.push(`/reschedule?id=${firstAppointment.id}`)
                }
              />
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  width: "auto",
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Spartan_600SemiBold",
                    fontSize: 18,
                    lineHeight: 30,
                    paddingHorizontal: 30,
                    textAlign: "center",
                  }}
                >
                  You do not have any upcoming appointment
                </Text>
                <Custombtn
                  text="Book an appointment"
                  customStyle={styles.appointbtn}
                  onClick={() => router.push("/doctors")}
                />
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 14,
            padding: 20,
            gap: 10,
          }}
        >
          <Custombtn
            text="Ask Ai"
            customStyle={styles.width}
            onClick={() => router.push("/diagnosis")}
          />
          <TranparentBtn
            text="  Registered Doctors"
            customStyle={styles.width}
            onClick={() => router.push("/doctors")}
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
          >
            <Text
              style={{
                fontFamily: "Spartan_700Bold",
                fontSize: 17,
                color: "#757575ede",
              }}
            >
              Services
            </Text>
          </View>

          {/* Flex service */}

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 20,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => router.push("/book")}
            >
              <View style={styles.iconcover}>
                <Ionicons name="calendar-sharp" size={21} color={"#3B82F6"} />
              </View>
              <Text style={{ fontFamily: "Spartan_600SemiBold", fontSize: 10 }}>
                bookings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => router.push("/doctors")}
            >
              <View style={styles.iconcover}>
                <Ionicons name="medical-sharp" size={21} color={"#22C55E"} />
              </View>
              <Text style={{ fontFamily: "Spartan_600SemiBold", fontSize: 10 }}>
                Doctors
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => router.push("/profile")}
            >
              <View style={styles.iconcover}>
                <Ionicons name="person-sharp" size={21} color={"#A855F7"} />
              </View>
              <Text style={{ fontFamily: "Spartan_600SemiBold", fontSize: 10 }}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard}>
              <View style={styles.iconcover}>
                <Ionicons
                  name="notifications-sharp"
                  size={21}
                  color={"#F97316"}
                />
              </View>
              <Text style={{ fontFamily: "Spartan_600SemiBold", fontSize: 10 }}>
                Reminders
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.docHeader}>
          <Text
            style={{
              fontFamily: "Spartan_700Bold",
              fontSize: 17,
              color: "#757575ede",
            }}
          >
            Top Doctors
          </Text>
        </View>
        <View>
          <FlatList
            data={doctors}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 15,
              marginVertical: 6,
              gap: 18,
              marginBottom: 50,
            }}
            keyExtractor={(item) => item.id.toLocaleString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.topDoc}
                onPress={() => router.push(`/doctor-details?id=${item.id}`)}
              >
                <Image
                  source={images.profilePic}
                  style={{
                    objectFit: "contain",
                    width: 60,
                    height: 60,
                    borderWidth: 1,
                    borderRadius: 9999,
                    borderColor: "#f0f0f0",
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Spartan_800ExtraBold",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  Dr. {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Spartan_600SemiBold",
                    fontSize: 14,
                    paddingTop: 6,
                  }}
                >
                  {item.medical_field}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: "#FFFF",
    flex: 1,
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
  appointbtn: {
    width: 200,
  },
  width: {
    width: 160,
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
    marginTop: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#1C2A3A",
    borderRadius: 15,
    paddingVertical: 17,
    marginVertical: 10,
    width: 170,
  },

  serviceCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(27, 27, 27, 0.35)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 6, // for Android shadow
    borderRadius: 10,
    padding: 16,
    width: 80,
  },
  iconcover: {
    width: 35,
    height: 35,
    backgroundColor: "#f3f3f3",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  docHeader: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 15,
  },
  topDoc: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    backgroundColor: "#fff",
    shadowColor: "rgba(27, 27, 27, 0.35)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 6, // for Android shadow
    borderRadius: 10,
    padding: 10,
    width: 110,
  },
});

export default Home;
