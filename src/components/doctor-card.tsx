import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants/images";

interface IDoctorProps {
  Items: IDoctors;
  onClick?: () => void;
}

const DoctorCard: FC<IDoctorProps> = ({ Items, onClick }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onClick}>
      <View>
        <Image source={images.profilePic} style={styles.image} />
      </View>
      <View>
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
            {Items.name}
          </Text>
          <Ionicons name="heart-outline" size={22} />
        </View>
        <Text style={styles.docSpec}>{Items.medical_field}</Text>
        <View
          style={[
            {
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            },
            styles.docLoco,
          ]}
        >
          <Ionicons name="location-outline" size={15} />
          <Text style={styles.docLocoText}>{Items.location.address}</Text>
          <Text style={styles.docLocoText}>{Items.location.country}</Text>
          <Text style={styles.docLocoText}>{Items.location.state}</Text>
        </View>
        <View
          style={[
            {
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            },
            styles.docLoco,
          ]}
        >
          <View
            style={[
              {
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              },
            ]}
          >
            <Ionicons
              name="star-sharp"
              size={14}
              color={"#FEB052"}
              style={{ paddingBottom: 5 }}
            />
            <Text style={styles.docRevText}>{Items.rating}</Text>
          </View>
          <View style={styles.verti} />
          <Text style={styles.docRevText}>{Items.reviews} Reviews</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;

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
  docSpec: {
    fontFamily: "Spartan_600SemiBold",
    fontSize: 17,
    paddingTop: 10,
    color: "#4B5563",
  },
  docLoco: {
    paddingVertical: 10,
  },
  docLocoText: {
    fontFamily: "Spartan_700Bold",
    fontSize: 13,
  },
  verti: {
    height: 14,
    width: 2,
    backgroundColor: "#E5E7EB",
  },
  docRevText: {
    fontFamily: "Spartan_700Bold",
    fontSize: 14,
  },
});
