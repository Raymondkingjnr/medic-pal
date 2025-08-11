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
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

const DoctorModal = () => {
  const [address, setAddress] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { docId } = useLocalSearchParams();

  const [appointmentTime, setAppointmentTime] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleConfirmDate = (selectedDate: Date) => {
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

  const [profile, setProfile] = useState<IProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  const handleBooking = async () => {
    if (!address || !appointmentDate || !appointmentTime) {
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

    // Get doctor info to check self-booking
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("user_id")
      .eq("id", docId)
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
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          doctor_id: docId,
          client_id: user.id,
          client_name: profile.full_name || user.email,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          client_address: address,
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

          <TouchableOpacity style={styles.bookbtn} onPress={handleBooking}>
            {loading ? (
              <ActivityIndicator size={20} />
            ) : (
              <Text style={styles.bookBtnText}>Proceed</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* Dark themed modals */}
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
