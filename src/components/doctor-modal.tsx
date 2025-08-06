import { View, Text, Modal } from "react-native";
import React, { FC } from "react";

interface IModalProps {
  close: () => void;
  visible: boolean;
}

const DoctorModal: FC<IModalProps> = ({ close, visible }) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={close}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <Text>DoctorModal</Text>
    </Modal>
  );
};

export default DoctorModal;
