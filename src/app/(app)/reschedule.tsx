import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Status } from "@/constants/enum";
import { Spartan_600SemiBold } from "@expo-google-fonts/spartan";
import Custombtn from "@/components/custombtn";

const RescheduleAppointment = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedTime, setSelectedTime] = useState("");
  const [scheduledTimes, setScheduledTimes] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  // 1️⃣ Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      setLoadingAppointment(true);
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        Alert.alert("Error", "Could not load appointment details.");
        router.back();
        return;
      }

      setAddress(data.client_address || "");
      setAppointmentDate(data.appointment_date);
      setSelectedTime(data.appointment_time);

      setDoctorId(data.doctor_id);
      setClientId(data.client_id);

      if (data.appointment_date) {
        const parsedDate = new Date(data.appointment_date);
        setDate(parsedDate);
      }

      setLoadingAppointment(false);
    };

    fetchAppointment();
  }, [id]);

  // 2️⃣ Fetch doctor's working hours
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!doctorId) return;
      const { data, error } = await supabase
        .from("doctors")
        .select("working_hours")
        .eq("id", doctorId)
        .single();

      if (!error && data?.working_hours) {
        setScheduledTimes(data.working_hours);
      }
    };
    fetchDoctorSchedule();
  }, [doctorId]);

  // 3️⃣ Fetch booked slots for selected date
  const fetchBookedTimes = async (dateString: string) => {
    if (!doctorId) return;
    const { data, error } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("doctor_id", doctorId)
      .eq("appointment_date", dateString)
      .eq("status", Status.UPCOMING);

    if (!error && data) {
      setBookedTimes(data.map((appt) => appt.appointment_time));
    }
  };

  // 4️⃣ Date selection
  const handleConfirmDate = async (selectedDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert("Invalid Date", "You cannot pick a past date.");
      return;
    }

    const dateString = selectedDate.toISOString().split("T")[0];
    setDate(selectedDate);
    setAppointmentDate(dateString);
    setSelectedTime("");
    await fetchBookedTimes(dateString);
    setShowDatePicker(false);
  };

  // 5️⃣ Reschedule appointment
  const handleReschedule = async () => {
    if (!address || !appointmentDate || !selectedTime) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    // Prevent double booking
    const { data: existingAppointments, error: existingError } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctorId)
      .eq("appointment_date", appointmentDate)
      .eq("appointment_time", selectedTime)
      .eq("status", Status.UPCOMING)
      .neq("id", id); // ignore the current appointment

    if (existingError) {
      Alert.alert("Error", "Could not verify time slot.");
      return;
    }

    if (existingAppointments && existingAppointments.length > 0) {
      Alert.alert(
        "Slot Taken",
        "This time slot is already booked. Please select another."
      );
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        client_address: address,
        appointment_date: appointmentDate,
        appointment_time: selectedTime,
        status: Status.UPCOMING,
      })
      .eq("id", id);

    if (updateError) {
      Alert.alert("Error", updateError.message);
      setLoading(false);
      return;
    }

    Alert.alert("Success", "Appointment rescheduled!");
    router.back();
    setLoading(false);
  };

  if (loadingAppointment) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Reschedule Appointment</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder="Enter Address"
              style={styles.input}
              placeholderTextColor="#888"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Date Picker */}
          <View style={styles.section}>
            <Text style={styles.label}>Pick Date</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{
                  color: appointmentDate ? "#000" : "#888",
                  fontFamily: "Spartan_600SemiBold",
                }}
              >
                {appointmentDate || "Select a date"}
              </Text>
            </Pressable>
          </View>

          {/* Time Slots */}
          {appointmentDate ? (
            <View style={styles.section}>
              <Text style={styles.label}>Select Time Slot</Text>
              <View style={styles.timeSlotsContainer}>
                {scheduledTimes.length > 0 ? (
                  scheduledTimes.map((slot) => {
                    const isBooked = bookedTimes.includes(slot);
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeSlot,
                          selectedTime === slot && styles.timeSlotSelected,
                          isBooked && styles.timeSlotDisabled,
                        ]}
                        disabled={isBooked}
                        onPress={() => setSelectedTime(slot)}
                      >
                        <Text
                          style={[
                            styles.timeSlotText,
                            selectedTime === slot &&
                              styles.timeSlotTextSelected,
                            isBooked && styles.timeSlotTextDisabled,
                          ]}
                        >
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={{ color: "#888" }}>
                    No available working hours found
                  </Text>
                )}
              </View>
            </View>
          ) : null}

          <Custombtn
            text="Confirm"
            isLoading={loading}
            onClick={handleReschedule}
            customStyle={styles.bookbtn}
          />
        </KeyboardAvoidingView>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={date}
          onConfirm={handleConfirmDate}
          onCancel={() => setShowDatePicker(false)}
          themeVariant="dark"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RescheduleAppointment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10 },
  flexTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 12,
  },
  HeaderText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    color: "#000",
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
  bookbtn: {
    marginTop: 40,
    marginHorizontal: 10,
  },
  bookBtnText: {
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Spartan_700Bold",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
  },
  timeSlotSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  timeSlotDisabled: {
    backgroundColor: "#e3e3e3",
    borderColor: "#ccc",
  },
  timeSlotText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Spartan_600SemiBold",
  },
  timeSlotTextSelected: {
    color: "#fff",
  },
  timeSlotTextDisabled: {
    color: "#888",
  },
});
