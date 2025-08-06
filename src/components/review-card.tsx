import { View, Text, Image, StyleSheet } from "react-native";
import React, { FC } from "react";
import { images } from "@/constants/images";
import { Spartan_800ExtraBold } from "@expo-google-fonts/spartan";

interface ReviewCardProps {
  items: IReviews;
}

const ReviewCard: FC<ReviewCardProps> = ({ items }) => {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <Image source={images.profilePic} style={styles.image} />
        <View style={{ flexDirection: "column", marginTop: 15 }}>
          <Text
            style={{
              fontFamily: "Spartan_800ExtraBold",
              fontSize: 17,
              lineHeight: 23,
              color: "#212122",
            }}
          >
            {items.client_name}
          </Text>
          <Text
            style={{
              fontFamily: "Spartan_800ExtraBold",
              fontSize: 13,
              lineHeight: 23,
              color: "#212122",
            }}
          >
            {items.rating} ⭐ ⭐ ⭐ ⭐ ⭐
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            fontFamily: "Spartan_600SemiBold",
            fontSize: 13,
            lineHeight: 20,
            color: "#6B7280",
          }}
        >
          {items.review}
        </Text>
      </View>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
    width: 320,
    gap: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 9999,
    objectFit: "cover",
  },
});
