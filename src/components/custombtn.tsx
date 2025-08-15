import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { FC } from "react";

interface IButtonProps {
  text: string;
  onClick?: () => void;
  customStyle?: any;
  disable?: boolean;
  isLoading?: boolean;
}

const Custombtn: FC<IButtonProps> = ({
  text,
  onClick,
  customStyle,
  disable,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.btn, customStyle]}
      disabled={disable}
    >
      {isLoading ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={"small"} color={"white"} />
        </View>
      ) : (
        <Text style={styles.textStyl}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};
export const TranparentBtn: FC<IButtonProps> = ({
  text,
  onClick,
  customStyle,
  disable,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.Transbtn, customStyle]}
      disabled={disable}
    >
      {isLoading ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={"small"} color={"#000"} />
        </View>
      ) : (
        <Text style={styles.TranstextStyl}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Custombtn;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#085be2",
    borderRadius: 20,
    paddingVertical: 17,
    marginVertical: 10,
  },
  Transbtn: {
    borderWidth: 1,
    borderColor: "#085be2",
    borderRadius: 20,
    paddingVertical: 17,
    marginVertical: 10,
  },
  textStyl: {
    color: "#fff",
    fontFamily: "Spartan_700Bold",
    textAlign: "center",
  },
  TranstextStyl: {
    color: "#085be2",
    fontFamily: "Spartan_700Bold",
    textAlign: "center",
  },
});
