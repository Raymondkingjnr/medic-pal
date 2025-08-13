import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import Custombtn, { TranparentBtn } from "@/components/custombtn";

const DoctorForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [medicalField, setMedicalField] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [profile, setProfile] = useState<IProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need location access to register you."
        );
        return;
      }

      const coords = await Location.getCurrentPositionAsync({});
      setLocation((prev) => ({
        ...prev,
        lat: coords.coords.latitude,
        lng: coords.coords.longitude,
      }));
    } catch (err) {
      console.error("getCurrentLocation error:", err);
      Alert.alert(
        "Location error",
        (err as Error).message || "Could not get location"
      );
    }
  };

  const registerDoctor = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Not signed in", "Please sign in before registering.");
      return;
    }

    // Basic validation
    if (
      !name.trim() ||
      !email.trim() ||
      !medicalField.trim() ||
      !licenseNumber.trim() ||
      !yearsExperience.trim()
    ) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Insert doctor record
      const { error: insertError } = await supabase.from("doctors").insert([
        {
          user_id: user.id,
          name: name.trim(),
          email: email.trim(),
          medical_field: medicalField.trim(),
          license_number: licenseNumber.trim(),

          years_experience: parseInt(yearsExperience, 10) || 0,
          location, // includes manual address + GPS
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      Alert.alert("Success", "Doctor registered successfully!");
      // optional: navigate back or clear form
      router.back();
    } catch (err: any) {
      console.error("registerDoctor error:", err);
      // show friendly message, also show raw message for dev
      Alert.alert(
        "Error uploading/registering",
        err.message || JSON.stringify(err)
      );
    } finally {
      setLoading(false);
    }
  };
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

  if (loadingProfile) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.flexTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Register As A Doctor</Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.inputFlex}>
            <View>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="fullname"
                placeholderTextColor="#9f9f9f"
                style={styles.input}
                value={name}
                onChangeText={setName}
                editable={true}
              />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9f9f9f"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                editable={true}
              />
            </View>
            <View>
              <Text style={styles.label}>Medical Field</Text>
              <TextInput
                placeholder="Pychathrist"
                placeholderTextColor={"#9f9f9f"}
                style={styles.input}
                value={medicalField}
                onChangeText={setMedicalField}
              />
            </View>
            <View>
              <Text style={styles.label}>Licence Number</Text>
              <TextInput
                placeholder="00000"
                placeholderTextColor={"#9f9f9f"}
                style={styles.input}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>
            <View>
              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                placeholder="2 years"
                placeholderTextColor={"#9f9f9f"}
                style={styles.input}
                value={yearsExperience}
                onChangeText={setYearsExperience}
              />
            </View>

            {/* LOCATION */}

            <Custombtn
              text=" Click To Allow Location or Input Manually"
              onClick={getCurrentLocation}
              customStyle={styles.confirmbtn}
            />
            <TextInput
              placeholder="Address"
              placeholderTextColor={"#9f9f9f"}
              value={location.address}
              onChangeText={(v) => setLocation({ ...location, address: v })}
              style={styles.input}
            />
            <TextInput
              placeholder="City"
              placeholderTextColor={"#9f9f9f"}
              value={location.city}
              onChangeText={(v) => setLocation({ ...location, city: v })}
              style={styles.input}
            />
            <TextInput
              placeholder="State"
              placeholderTextColor={"#9f9f9f"}
              value={location.state}
              onChangeText={(v) => setLocation({ ...location, state: v })}
              style={styles.input}
            />
            <TextInput
              placeholder="Country"
              placeholderTextColor={"#9f9f9f"}
              value={location.country}
              onChangeText={(v) => setLocation({ ...location, country: v })}
              style={styles.input}
            />

            <TranparentBtn
              text="Submit"
              isLoading={loading}
              onClick={registerDoctor}
              customStyle={styles.confirmbtn}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorForm;

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
    maxWidth: 300,
    minWidth: 300,
  },
  inputFlex: {
    gap: 20,
    paddingHorizontal: 12,
    marginTop: 25,
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
  label: {
    fontFamily: "Spartan_700Bold",
    fontSize: 15,
    marginVertical: 5,
    color: "#000",
  },
  confirmbtn: {
    width: "100%",
    marginVertical: 10,
  },
});
