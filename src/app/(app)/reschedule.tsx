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

const RescheduleAppointment = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const [address, setAddress] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  const [doctorId, setDoctorId] = useState(null);
  const [clientId, setClientId] = useState(null);

  // Fetch appointment details
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
      setAppointmentTime(data.appointment_time);

      setDoctorId(data.doctor_id);
      setClientId(data.client_id);

      if (data.appointment_date) {
        const parsedDate = new Date(data.appointment_date);
        setDate(parsedDate);
      }
      if (data.appointment_time) {
        const [hour, minute] = data.appointment_time.split(":");
        const parsedTime = new Date();
        parsedTime.setHours(Number(hour), Number(minute));
        setTime(parsedTime);
      }

      setLoadingAppointment(false);
    };

    fetchAppointment();
  }, [id]);

  const handleConfirmDate = (selectedDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert("Invalid Date", "You cannot pick a past date.");
      return;
    }

    setDate(selectedDate);
    setAppointmentDate(selectedDate.toDateString());
    setShowDatePicker(false);
  };

  const handleConfirmTime = (selectedTime: Date) => {
    setTime(selectedTime);
    setAppointmentTime(
      selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setShowTimePicker(false);
  };

  const handleReschedule = async () => {
    if (!address || !appointmentDate || !appointmentTime) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    // 1️⃣ Update the appointment
    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        client_address: address,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: Status.UPCOMING,
      })
      .eq("id", id);

    if (updateError) {
      Alert.alert("Error", updateError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Update the doctor's appointments array
    if (doctorId) {
      await supabase.rpc("add_appointment_to_doctor", {
        doctor_id_input: doctorId,
        appointment_id_input: id,
      });
    }

    // 3️⃣ Update the client's appointments array
    if (clientId) {
      await supabase.rpc("add_appointment_to_profile", {
        profile_id_input: clientId,
        appointment_id_input: id,
      });
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

          <View style={styles.section}>
            <Text style={styles.label}>Pick Date</Text>
            <Pressable>
              <TextInput
                placeholder="Pick A Date"
                style={styles.input}
                value={appointmentDate}
                editable={false}
                placeholderTextColor="#888"
                onPress={() => setShowDatePicker(true)}
              />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Pick Time</Text>
            <Pressable>
              <TextInput
                placeholder="Pick A Time"
                style={styles.input}
                value={appointmentTime}
                editable={false}
                placeholderTextColor="#888"
                onPress={() => setShowTimePicker(true)}
              />
            </Pressable>
          </View>

          <TouchableOpacity style={styles.bookbtn} onPress={handleReschedule}>
            {loading ? (
              <ActivityIndicator size={20} />
            ) : (
              <Text style={styles.bookBtnText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={date}
          onConfirm={handleConfirmDate}
          onCancel={() => setShowDatePicker(false)}
          themeVariant="dark"
        />
        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          date={time}
          onConfirm={handleConfirmTime}
          onCancel={() => setShowTimePicker(false)}
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
    backgroundColor: "#dcdcdc",
    borderRadius: 15,
    paddingVertical: 17,
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
});
