import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Markdown from "react-native-markdown-display";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const Diagnosis = () => {
  const [query, setQuery] = useState("");
  const [airesponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const router = useRouter();
  const getAiGuidance = async () => {
    if (!query) return;

    setAiLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate result");
      }
      const data = await response.json();
      setAiResponse(data.message);
    } catch (error) {
      console.error("Error fetching AI guidance", error);
      setAiResponse(
        "Sorry, there was an error gettting AI guidance, please try again"
      );
    } finally {
      setAiLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.9}>
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.headerText}>
            Perform a medial check up with our Ai
          </Text>

          <TextInput
            multiline
            placeholder="Describe how you feel.."
            value={query}
            placeholderTextColor={"#a0a0a0ed"}
            style={styles.input}
            onChangeText={setQuery}
          />
          <Text style={[styles.headerText, styles.ai]}>
            Ai are not always accurate we still recommend you see a doctor
          </Text>
        </View>
        {(airesponse || aiLoading) && (
          <View style={{ marginTop: 20 }}>
            {aiLoading ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <ActivityIndicator size={"small"} />
                <Text
                  style={{
                    fontFamily: "Spartan_800ExtraBold",
                    fontSize: 16,
                    color: "#085be2",
                  }}
                >
                  Getting medical Result...
                </Text>
              </View>
            ) : (
              <View>
                <Markdown
                  style={{
                    body: {
                      paddingBottom: 20,
                      fontFamily: "Spartan_700Bold",
                      lineHeight: 32,
                      fontSize: 12,
                    },
                  }}
                >
                  {airesponse}
                </Markdown>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.btn,
            aiLoading || !query || airesponse.length > 3
              ? styles.loadingbtn
              : "",
          ]}
          onPress={getAiGuidance}
          disabled={aiLoading || !query || airesponse.length > 3}
        >
          {aiLoading ? (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator size={"small"} color={"white"} />
            </View>
          ) : (
            <Text style={styles.btnText}>Send</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Diagnosis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
  },
  headerText: {
    fontFamily: "Spartan_700Bold",
    fontSize: 13,
    paddingTop: 30,
    paddingBottom: 10,
  },
  content: {
    marginTop: 20,
  },
  input: {
    height: 150,
    textAlignVertical: "top",
    borderColor: "#b3b3b3",
    borderWidth: 1.3,
    borderRadius: 10,
    padding: 10,
    fontFamily: "Spartan_500Medium",
  },
  btn: {
    backgroundColor: "#085be2",
    borderRadius: 20,
    paddingVertical: 17,
    marginVertical: 10,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Spartan_700Bold",
    fontSize: 13,
  },
  loadingbtn: {
    backgroundColor: "#b6c4fb",
  },
  ai: {
    fontSize: 12,
    color: "#0a015c",
  },
});
