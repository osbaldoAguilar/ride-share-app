import React from 'react';
import Modal from 'react-native-modal';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import styles from './styles';

const BottomModal = ({ isVisible, onBackPress, onSelect, data }) => {
  console.log('visible', data);
  return (
    <View>
      <Modal
        transparent={true}
        visible={isVisible}
        style={styles.modalWrapper}
        onBackdropPress={onBackPress}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {data.map((data, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onSelect(data, index)}
                  style={styles.buttonStyle}
                  key={index}
                >
                  <Text style={styles.modalText}>{data}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default BottomModal;
