import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { FC } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import moment from "moment";
import { images } from "@/constants/images";
interface appointmentProps {
  card: IAppointment;
}

const AppointmentCard: FC<appointmentProps> = ({ card }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
          width: "100%",
          paddingBottom: 15,
        }}
      >
        <Text
          style={{
            fontFamily: "Spartan_700Bold",
            fontSize: 15,
            paddingTop: 10,
          }}
        >
          {moment(card.appointment_date).format("MMMM Do YYYY")},{"  "}{" "}
          {card.appointment_time}
        </Text>
      </View>
      <View>
        <Image source={images.profilePic} style={styles.image} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 210,
          }}
        >
          <Text style={styles.docName}>
            Dr. {""}
            {/* {card?.doctor_id?.name ?? ""} */}
          </Text>
          <Ionicons name="heart-outline" size={22} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    shadowColor: "rgba(27, 27, 27, 0.35)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 6, // for Android shadow
    borderRadius: 10,
    padding: 15,
    margin: 5,
    flexDirection: "row",
    gap: 20,
  },
  image: {
    objectFit: "cover",
    width: 100,
    height: 100,
  },
  docName: {
    fontFamily: "Spartan_800ExtraBold",
    fontSize: 16,
  },
});
