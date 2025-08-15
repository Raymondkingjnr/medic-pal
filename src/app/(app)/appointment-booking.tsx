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
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import Custombtn from "@/components/custombtn";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Status } from "@/constants/enum";

const DoctorModal = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Doctor's id from route

  // Form fields
  const [address, setAddress] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Data fetching states
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState(null);

  // Doctor schedule data
  const [scheduledTimes, setScheduledTimes] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  // Fetch logged-in user profile
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

  // Fetch doctor's scheduled hours
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("working_hours, user_id")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("Error", "Could not fetch doctor schedule.");
        return;
      }

      setScheduledTimes(data?.working_hours || []);
    };

    fetchDoctorSchedule();
  }, [id]);

  // Fetch booked slots for selected date
  const fetchBookedTimes = async (dateString: string) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("doctor_id", id)
      .eq("appointment_date", dateString)
      .eq("status", Status.UPCOMING);

    if (!error && data) {
      setBookedTimes(data.map((appt) => appt.appointment_time));
    }
  };

  // Handle booking
  const handleBooking = async () => {
    if (!address || !appointmentDate || !selectedTime) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    // Get logged in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "Could not fetch user info.");
      return;
    }

    // Prevent self-booking
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("user_id")
      .eq("id", id)
      .single();

    if (doctorError) {
      Alert.alert("Error", "Could not fetch doctor info.");
      return;
    }

    if (doctorData.user_id === user.id) {
      Alert.alert("Error", "You cannot book an appointment with yourself.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Check if slot is already booked
      const { data: existingAppointments, error: existingError } =
        await supabase
          .from("appointments")
          .select("id")
          .eq("doctor_id", id)
          .eq("appointment_date", appointmentDate)
          .eq("appointment_time", selectedTime)
          .eq("status", Status.UPCOMING);

      if (existingError) {
        Alert.alert("Error", "Could not verify time slot.");
        setLoading(false);
        return;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        Alert.alert(
          "Slot Taken",
          "This time slot is already booked. Please select another."
        );
        setLoading(false);
        return;
      }

      // ✅ Insert appointment
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          doctor_id: id,
          client_id: user.id,
          client_name: profile?.full_name || user.email,
          appointment_date: appointmentDate,
          appointment_time: selectedTime,
          client_address: address,
          status: Status.UPCOMING, // ensure correct status
        });

      if (insertError) {
        Alert.alert("Error", insertError.message);
        return;
      }

      Alert.alert("Success", "Appointment booked successfully!");
      router.back();
    } catch (error) {
      console.error("Error booking appointment", error);
      Alert.alert(error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Book An Appointment</Text>
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

          {/* Book Button */}
          <Custombtn
            text="Proceed"
            onClick={handleBooking}
            isLoading={loading}
            customStyle={styles.btn}
          />
        </KeyboardAvoidingView>
        <DateTimePicker
          isVisible={showDatePicker}
          mode="date"
          date={date}
          onConfirm={async (selectedDate) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
              Alert.alert("Invalid Date", "You cannot pick a past date.");
              return;
            }

            setDate(selectedDate);
            const dateString = selectedDate.toISOString().split("T")[0];
            setAppointmentDate(dateString);
            setSelectedTime("");
            await fetchBookedTimes(dateString);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
          themeVariant="dark"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorModal;

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
    fontFamily: "Spartan_700Bold",
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
  btn: {
    marginHorizontal: 10,
    marginVertical: 20,
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
    fontFamily: "Spartan_700Bold",
  },
  timeSlotTextSelected: {
    color: "#fff",
  },
  timeSlotTextDisabled: {
    color: "#888",
  },
});
