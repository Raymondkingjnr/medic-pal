import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Spartan_500Medium,
  Spartan_600SemiBold,
  Spartan_700Bold,
  Spartan_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/spartan";
import Entypo from "@expo/vector-icons/Entypo";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signupwithemail() {
    setIsLoading(true);
    if (!email || !password || !name) {
      Alert.alert("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) throw signUpError;

      if (user) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        Alert.alert(
          "Success",
          "Account created successfully! Please check your email for verification.",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace({
                  pathname: "/login",
                  params: { name }, // Pass the name as a param
                }),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred during sign up. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const [loading, error] = useFonts({
    Spartan_500Medium,
    Spartan_600SemiBold,
    Spartan_700Bold,
    Spartan_800ExtraBold,
  });

  if (!loading && !error) {
    return null;
  }

  return (
    <SafeAreaView className=" flex-1">
      <KeyboardAvoidingView
        className=" flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.container}>
            <Image source={icons.icon} />
            <Text style={styles.headertext}>
              Health<Text style={styles.spantext}>Pal</Text>{" "}
            </Text>
            <Text style={styles.welcomtext}>Create Account</Text>
            <Text style={[styles.spantext, styles.downtext]}>
              Join us to get started with your health journey
            </Text>

            <View style={styles.relativeform}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <Entypo style={styles.icon} name="user" size={15} color="black" />
            </View>

            <View style={styles.relativeform}>
              <TextInput
                autoCapitalize={"none"}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Your Email"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
              <Entypo name="mail" style={styles.icon} size={15} color="black" />
            </View>

            <View style={styles.relativeform}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={showPassword ? false : true}
                value={password}
                autoCapitalize={"none"}
                onChangeText={(text) => setPassword(text)}
              />
              <Entypo style={styles.icon} name="lock" size={15} color="black" />
              {!showPassword ? (
                <Entypo
                  name="eye-with-line"
                  style={styles.password}
                  size={25}
                  color="black"
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <Entypo
                  name="eye"
                  style={styles.password}
                  size={25}
                  color="black"
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              )}
            </View>

            <Pressable
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => signupwithemail()}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            <View style={styles.flex}>
              <View style={styles.rltline} />
              <Text>Or</Text>
              <View style={styles.rltline} />
            </View>

            <Pressable style={styles.googlebtn}>
              <Image source={icons.googleIcon} />
              <Text style={[styles.buttonText, styles.googletext]}>
                Sign up with Google
              </Text>
            </Pressable>

            <Link href={"/login"} asChild>
              <Pressable>
                <Text style={styles.signupbutton}>
                  Already have an account?{" "}
                  <Text style={styles.forgetpasswordtext}>Sign in</Text>{" "}
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  headertext: {
    textAlign: "center",
    paddingTop: 14,
    fontSize: 25,
    fontWeight: "400",
    color: "#6B7280",
    fontFamily: "Spartan_800ExtraBold",
  },
  spantext: {
    color: "#1C2A3A",
  },
  downtext: {
    paddingTop: 0,
    color: "#6B7280",
    fontSize: 19,
    textAlign: "center",
    fontWeight: "300",
    fontFamily: "Spartan_600SemiBold",
  },
  welcomtext: {
    fontWeight: "semibold",
    color: "#1C2A3A",
    fontSize: 30,
    paddingVertical: 40,
    fontFamily: "Spartan_700Bold",
  },
  input: {
    color: "#1C2A3A",
    borderColor: "#D1D5DB",
    borderWidth: 2,
    height: 45,
    borderRadius: 7,
    fontSize: 18,
    paddingLeft: 40,
    fontFamily: "Spartan_500Medium",
    width: "100%",
    fontWeight: "500",
  },
  inputFlex: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 30,
    paddingTop: 30,
  },
  relativeform: {
    position: "relative",
    width: "100%",
    marginTop: 30,
  },
  icon: {
    position: "absolute",
    bottom: 14,
    left: 10,
  },
  password: {
    position: "absolute",
    top: 9,
    right: 15,
  },
  button: {
    backgroundColor: "#1C2A3A",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
    fontFamily: "Spartan_600SemiBold",
  },
  rltline: {
    height: 1,
    width: "55%",
    backgroundColor: "#979797",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  googlebtn: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
    display: "flex",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 30,
  },
  googletext: {
    color: "#1C2A3A",
  },
  forgetpassword: {
    marginTop: 25,
  },
  forgetpasswordtext: {
    color: "#1C64F2",
    fontWeight: "600",
    fontSize: 14,
  },
  signupbutton: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: "Spartan_600SemiBold",
  },
});
