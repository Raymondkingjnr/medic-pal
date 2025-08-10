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
import { Spartan_700Bold } from "@expo-google-fonts/spartan";

const Diagnosis = () => {
  const [query, setQuery] = useState("");
  const [airesponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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
      <ScrollView style={{ flex: 1 }}>
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
        </View>
        {(airesponse || aiLoading) && (
          <View style={{ marginTop: 20, paddingHorizontal: 10, flex: 1 }}>
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
                  style={{ fontFamily: "Spartan_800ExtraBold", fontSize: 16 }}
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
                      fontSize: 14,
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
          style={aiLoading ? styles.loadingbtn : styles.btn}
          onPress={getAiGuidance}
          disabled={aiLoading}
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
  },
  headerText: {
    fontFamily: "Spartan_700Bold",
    fontSize: 17,
    paddingVertical: 12,
  },
  content: {
    paddingHorizontal: 10,
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
    backgroundColor: "#1C2A3A",
    borderRadius: 15,
    paddingVertical: 17,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Spartan_700Bold",
    fontSize: 18,
  },
  loadingbtn: {
    backgroundColor: "#858585",
    borderRadius: 15,
    paddingVertical: 17,
    marginVertical: 20,
    marginHorizontal: 10,
  },
});
