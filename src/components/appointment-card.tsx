// File: components/appointment-card.tsx
import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants/images";
import { Status } from "@/constants/enum";
import { supabase } from "@/lib/supabase";
import Custombtn, { TranparentBtn } from "./custombtn";

interface appointmentProps {
  card: IAppointment;
  onCancle?: () => void;
  onReeschedule?: () => void;
  onComplete?: () => void;
}

const AppointmentCard: FC<appointmentProps> = ({
  card,
  onCancle,
  onReeschedule,
  onComplete,
}) => {
  const doctor =
    card?.doctor_id && typeof card?.doctor_id === "object"
      ? card.doctor_id
      : null;

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

  return (
    <TouchableOpacity style={styles.card}>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.time}>
            <Text style={styles.dateText}>
              {moment(card?.appointment_date).format("MMMM Do YYYY")}
            </Text>
            <Text style={styles.dateText}>{card?.appointment_time}</Text>
          </View>
          <Text
            style={{
              fontFamily: "Spartan_700Bold",
              fontSize: 12,
              marginTop: 8,
              textTransform: "uppercase",
            }}
          >
            {card?.status}
          </Text>
        </View>

        <View style={styles.hr} />

        <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
          <Image source={images.profilePic} style={styles.image} />
          <View>
            <Text style={styles.docName}>Dr. {doctor?.name ?? "Unknown"}</Text>
            <Text style={styles.docSpec}>
              {doctor?.medical_field ?? "Not specified"}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <Ionicons name="location-sharp" color={"#888"} size={15} />
              <Text style={styles.docLoco}>
                {doctor?.location?.address ?? "No address"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.hr} />

        {!profile?.is_doctor && (
          <View style={styles.actionsRow}>
            {card?.status.toLowerCase() === Status.UPCOMING.toLowerCase() && (
              <>
                <TranparentBtn
                  text="Cancel"
                  onClick={onCancle}
                  customStyle={styles.cancelbtn}
                />

                <Custombtn
                  text="Reschedule"
                  onClick={onReeschedule}
                  customStyle={styles.cancelbtn}
                />

                <Custombtn
                  text="Mark as complete"
                  onClick={onComplete}
                  customStyle={styles.cancelbtn}
                />
              </>
            )}

            {(card?.status.toLowerCase() === Status.CANCELLED.toLowerCase() ||
              card?.status.toLowerCase() ===
                Status.COMPLETED.toLowerCase()) && (
              <Custombtn
                text="Reschedule"
                onClick={onReeschedule}
                customStyle={styles.cancelbtn}
              />
            )}
          </View>
        )}
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
  },
  image: {
    objectFit: "contain",
    width: 60,
    height: 60,
    borderRadius: 9999,
    borderColor: "#f0f0f0",
    borderWidth: 1,
  },
  time: {
    flexDirection: "row",
    gap: 16,
  },
  dateText: { fontFamily: "Spartan_700Bold", fontSize: 12, paddingTop: 10 },

  docName: {
    fontFamily: "Spartan_800ExtraBold",
    fontSize: 13,
  },
  docSpec: {
    fontFamily: "Spartan_600SemiBold",
    fontSize: 15,
    paddingTop: 10,
    color: "#4B5563",
  },

  docLoco: {
    paddingVertical: 10,
    color: "#888",
    fontSize: 13,
    fontFamily: "Spartan_600SemiBold",
  },
  docLocoText: {
    fontFamily: "Spartan_700Bold",
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 7,
  },
  cancelbtn: {
    width: "auto",
    paddingVertical: 10,
    paddingHorizontal: 11,
  },

  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    // width: 330,
    marginTop: 8,
  },
});
