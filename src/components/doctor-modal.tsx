// components/DoctorModal.tsx
import {
  View,
  Text,
  Modal,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { FC, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface IModalProps {
  close: () => void;
  visible: boolean;
}

const DoctorModal: FC<IModalProps> = ({ close, visible }) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [appointmentTime, setAppointmentTime] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDatePickerToggle = () => setShowDatePicker((prev) => !prev);
  const handleTimePickerToggle = () => setShowTimePicker((prev) => !prev);

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      setAppointmentDate(selectedDate.toDateString());
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
    } else if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const onTimeChange = (_event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setTime(selectedTime);
      const formatted = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setAppointmentTime(formatted);
      if (Platform.OS === "android") {
        setShowTimePicker(false);
      }
    } else if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={close}
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <StatusBar barStyle="light-content" />
          <View style={styles.flexTop}>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close-circle-sharp" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.HeaderText}>Book An Appointment</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.section}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="Enter Full Name"
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                placeholder="Enter Address"
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Select Date</Text>
              <View>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    value={date}
                    onChange={onDateChange}
                    style={styles.datePicker}
                    themeVariant={"dark"}
                    textColor={"white"}
                  />
                )}
              </View>

              <Pressable onPress={handleDatePickerToggle}>
                <TextInput
                  placeholder="Pick A Date"
                  style={styles.input}
                  value={appointmentDate}
                  editable={false}
                  placeholderTextColor="#888"
                  pointerEvents="none"
                />
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Pick Time</Text>
              {showTimePicker && (
                <View>
                  <DateTimePicker
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "clock"}
                    value={time}
                    onChange={onTimeChange}
                    themeVariant={
                      Platform.OS === "android" ? "dark" : undefined
                    }
                    textColor={Platform.OS === "ios" ? "white" : undefined}
                  />
                </View>
              )}
              <Pressable onPress={handleTimePickerToggle}>
                <TextInput
                  placeholder="Pick A Time"
                  style={styles.input}
                  value={appointmentTime}
                  editable={false}
                  placeholderTextColor="#888"
                  pointerEvents="none"
                />
              </Pressable>
            </View>
            <TouchableOpacity style={styles.bookbtn}>
              <Text
                style={{
                  color: "#000",
                  fontFamily: "Spartan_600SemiBold",
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                Proceed
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default DoctorModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 10,
  },
  flexTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 12,
  },
  HeaderText: {
    fontSize: 20,
    fontFamily: "Spartan_700Bold",
    textAlign: "center",
    flex: 1,
    color: "#fff",
  },
  section: {
    paddingHorizontal: 10,

    marginTop: 30,
  },
  label: {
    fontFamily: "Spartan_700Bold",
    fontSize: 15,
    marginVertical: 5,
    color: "#fff",
  },
  input: {
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    marginVertical: 6,
    fontSize: 17,
    justifyContent: "center",
    color: "#fff",
  },
  datePicker: {
    marginVertical: 10,
  },
  bookbtn: {
    backgroundColor: "#dcdcdc",
    borderRadius: 15,
    paddingVertical: 17,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
