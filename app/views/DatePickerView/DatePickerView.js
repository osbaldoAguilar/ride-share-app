import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { Appearance } from 'react-native-appearance';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePickerView = ({ setDate, mode, title, dateProp }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  console.log('date prop', dateProp);
  console.log('mode', mode);
  console.log('title', title);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.log('date', date);
    console.warn('DATE', date);
    hideDatePicker();
    setDate(date);
  };

  // If is a string means comes from the backend, we should convert it to a Date.
  let date = new Date(dateProp);
  console.log('date converted', date);
  const colorScheme = Appearance.getColorScheme();
  return (
    <View>
      <Button
        title={title || 'Pick Date'}
        onPress={showDatePicker}
        color="#475c67"
      />
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
