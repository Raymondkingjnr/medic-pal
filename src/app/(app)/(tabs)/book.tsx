import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import AppointmentCard from "@/components/appointment-card";
import { Status } from "@/constants/enum";
import Custombtn from "@/components/custombtn";

const STATUS_ALL = "All";

const Book: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>(STATUS_ALL);

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        console.warn("No user:", userErr);
        setAppointments([]);
        setLoading(false);
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
        .order("appointment_date", { ascending: true });

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
      if (filter && filter !== STATUS_ALL) {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("fetch appointments error:", error);
        setAppointments([]);
        setLoading(false);
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
      setRefreshing(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = useCallback(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (appointment: IAppointment) => {
    Alert.alert(
      "Cancel appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
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
            setLoading(false);
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
            setLoading(true);
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
            setLoading(false);
          },
        },
      ]
      // { cancelable: true }
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexTop}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Bookings</Text>
      </View>

      <View style={styles.filterRow}>
        {[STATUS_ALL, Status.UPCOMING, Status.CANCELLED, Status.COMPLETED].map(
          (s) => (
            <TouchableOpacity
              key={s}
              style={[styles.filterBtn, filter === s && styles.filterBtnActive]}
              onPress={() => setFilter(s)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === s && styles.filterTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <SafeAreaView style={styles.empty}>
            <Text style={styles.emptyText}>
              You Do Not Have Any Booking Yet
            </Text>

            <Custombtn
              text="Book An Appointment"
              customStyle={styles.bookbtn}
              onClick={() => router.push("/doctors")}
            />
          </SafeAreaView>
        }
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <AppointmentCard
            card={item}
            onCancle={() => handleCancel(item)}
            onComplete={() => handleComplete(item)}
            onReeschedule={() => router.push(`/reschedule?id=${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor={"##3b82f6"}
            title="pull to refresh appointments"
            titleColor={"##3b7280"}
          />
        }
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
  bookbtn: {
    width: 220,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#085be2",
  },
  filterBtnActive: { backgroundColor: "#085be2" },
  filterText: { color: "#085be2", fontFamily: "Spartan_700Bold" },
  filterTextActive: { color: "#fff" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  emptyText: {
    fontFamily: "Spartan_800ExtraBold",
    fontSize: 15,
    color: "#4b4b4b",
  },

  btnText: {
    textAlign: "center",
    fontFamily: "Spartan_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
