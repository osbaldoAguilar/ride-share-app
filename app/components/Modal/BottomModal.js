import React from 'react';
import Modal from 'react-native-modal';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';

const BottomModal = ({ isVisible, onBackPress, onSelect, data }) => {
  console.log('visible', data);
  return (
    <View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Modal
          transparent={true}
          visible={isVisible}
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 15,
            elevation: Platform.OS === 'ios' ? 0 : 5,
            margin: 0,
            justifyContent: 'flex-end',
          }}
          onBackdropPress={onBackPress}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 22,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <ScrollView>
              {data.map((data, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => onSelect(data, index)}
                    style={{ alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        padding: 22,
                        fontSize: 20,
                        fontSize: 20,
                        color: '#475c67',
                        fontWeight: '700',
                        display: 'flex',
                      }}
                    >
                      {data}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default BottomModal;
