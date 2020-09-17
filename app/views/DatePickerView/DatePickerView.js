import React, { useState, useEffect } from 'react';
import { Button, View, TouchableOpacity, Text } from 'react-native';
import { Appearance } from 'react-native-appearance';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment';
import { StyleSheet } from 'react-native';

const DatePickerView = ({ setDate, mode, title, dateProp, placeholder }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [value, setValue] = useState(placeholder);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    setDate(date);

    if (mode === 'date') {
      setValue(moment(date).format('MMMM D, YYYY'));
    } else {
      setValue(moment(date).format('h:m A'));
    }
  };

  useEffect(() => {
    console.log('date prop beofre if', dateProp);
    if (dateProp) {
      if (mode === 'date') {
        setValue(moment(dateProp).format('MMMM DD, YYYY'));
      } else {
        setValue(
          moment(dateProp)
            .local()
            .format('h:mm A')
        );
      }
    }
  }, [dateProp]);

  // If is a string means comes from the backend, we should convert it to a Date.
  let date = dateProp;
  console.log('date prop true or false', date);
  if (typeof dateProp === 'string') {
    date = new Date(dateProp.replace(/-/g, '/'));
  }
  if (!dateProp) {
    date = new Date();
  }

  const colorScheme = Appearance.getColorScheme();
  return (
    <View>
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          marginTop: 5,
          textAlign: 'center',
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Text
          style={{
            color: 'grey',
            fontSize: 18,
          }}
        >
          {value}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        headerTextIOS={title}
        isVisible={isDatePickerVisible}
        isDarkModeEnabled={colorScheme === 'light' ? false : true}
        mode={mode}
        date={date}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePickerView;
