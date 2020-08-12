import React from 'react';
import { Text, ScrollView, View, Button, TouchableOpacity } from 'react-native';

import styles from './styles';
import Block from '../Block';
import { CalendarButton } from '../Button';
import API from '../../api/api';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import DatePickerView from '../../views/DatePickerView/DatePickerView';
import { showMessage } from 'react-native-flash-message';
import BottomModal from '../Modal/BottomModal';
import Container from '../Container';

import BackHeader from '../Header/BackHeader';

class RegisterAvailabilityForm extends React.Component {
  constructor(props) {
    super(props);
    const isNewItem = this.props.navigation.state.params.new;
    console.log('isNewItem', this.props.navigation);
    if (!isNewItem) {
      var { params } = props.navigation.state;
    }
    this.state = {
      isRecurring: isNewItem ? false : params.item.isRecurring,

      availData: {
        startDate: isNewItem ? new Date() : params.item.startDate,
        endDate: isNewItem ? new Date() : params.item.endDate,
        startTime: isNewItem ? new Date() : params.item.startTime,
        endTime: isNewItem ? new Date() : params.item.endTime,
      },
      locationModal: false,
      locationData: [],
      locations: [],
      selectedLocation: {},
      errors: [],
      defaultLocation: 'Select One',
      recurringOptions: ['Yes', 'No'],
      recurringModal: false,
    };
  }

  componentDidMount = async () => {
    //check for token
    const value = await AsyncStorage.getItem('token');
    const token = JSON.parse(value);

    API.getLocations(token.token).then(res => {
      const locations = res.locations;
      console.log('get locatins', locations);

      let locationData = [...this.state.locationData];
      locations.map(location => {
        console.log('locations', location);
        let value = ''.concat(
          location.street,
          ' ',
          location.city,
          ' ',
          location.state,
          ' ',
          location.zip
        );
        if (location.default_location) {
          console.log('default true');
          let newVal = value.concat(' ', '(Default)');
          console.log('after adding default', newVal);
          console.log('selected location', location);
          locationData.push(newVal);
          this.setState({
            defaultLocation: newVal,
            selectedLocation: location.id,
          });
        } else {
          console.log('string put together', value);
          locationData.push(value);
        }
      });
      this.setState({ locationData }, () => {
        console.log('state for locationData', locationData);
      });
      this.setState({ locations }, () => {
        console.log('state for locations', this.state.locations);
      });
    });
  };

  backButton = () => {
    const { navigation } = this.props;
    navigation.navigate('AgendaView');
  };

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  };

  handleSubmitEditing = id => {
    if (id === 'Recurring') {
      Keyboard.dismiss();
    } else {
      this.inputs[id].focus();
    }

    const availInfo = {
      start_time: this.state.start_time,
      end_time: this.state.end_time,
      is_recurring: this.state.is_recurring,
      end_date: this.state.end_date,
      //below values need to be changed, place-holding for now
      location_id: 1,
    };
    console.log('avail data input is: ', availInfo);
    this.setState({ availData: availInfo });
  };

  handleInnerRef = (input, id) => {
    this.inputs[id] = input;
  };

  handleLocationChange = (location, index) => {
    console.log('location', location);
    console.log('inside location change', index);
    const { locations } = this.state;
    const selectedLocation = locations[index].id;
    this.setState({
      selectedLocation,
      locationModal: false,
      defaultLocation: location,
    });
    console.log('id', selectedLocation);
  };
  setStartDate = date => {
    this.setState({
      availData: {
        ...this.state.availData,
        startDate: date,
      },
    });
  };

  setStartTime = time => {
    console.warn('PICKER', time);
    console.log('startTime', time);
    this.setState({
      availData: {
        ...this.state.availData,
        startTime: time,
      },
    });
  };

  setEndTime = time => {
    this.setState({
      availData: {
        ...this.state.availData,
        endTime: time,
      },
    });
  };

  setEndDate = date => {
    console.log('end date for picker', date);
    this.setState({
      availData: {
        ...this.state.availData,
        endDate: date,
      },
    });
  };

  handleRecurringChange = value => {
    console.log('value', value);
    if (value === 'Yes') {
      console.log('inside if');
      this.setState({
        isRecurring: true,
        recurringModal: false,
        availData: { ...this.state.availData, endDate: new Date() },
      });
    } else this.setState({ isRecurring: false, recurringModal: false });
  };

  convertToUTC = async (date, time) => {
    const startTime = moment(time).format('HH:mm');
    console.warn('startTime', startTime);
    const dateConcat = moment(date).format('YYYY-MM-DD') + ' ' + startTime;
    const utcConversion = moment(dateConcat);
    return utcConversion;
  };

  //async await needed for proper Promise handling during submit function
  handleUserSubmit = async () => {
    const { availData, isRecurring, selectedLocation } = this.state;
    const isNew = this.props.navigation.state.params.new;
    console.log('is new in submit', isNew);

    let token = await AsyncStorage.getItem('token');
    token = JSON.parse(token);

    let userEntries = {};
    const startTime = await this.convertToUTC(
      availData.startDate,
      availData.startTime
    );
    const endTime = await this.convertToUTC(
      availData.startDate,
      availData.endTime
    );
    const endDate = moment(availData.endDate).format('YYYY-MM-DD');
    const startDate = moment(availData.startDate).format('YYYY-MM-DD');

    if (isRecurring) {
      userEntries = {
        start_time: startTime,
        end_time: endTime,
        is_recurring: isRecurring,
        location_id: selectedLocation,
        start_date: startDate,
        end_date: endDate,
      };
    } else {
      userEntries = {
        start_time: startTime,
        end_time: endTime,
        is_recurring: isRecurring,
        location_id: selectedLocation,
      };
    }

    console.warn('user entries before api', userEntries);

    if (isNew) {
      const response = await API.createAvailability(
        userEntries,
        isRecurring,
        token.token
      );

      console.warn('response from create', response);

      if (response.error) {
        this.setState({ error: response.error });
        return;
      }

      showMessage({
        message: 'Availability Added. ',
        description: 'Thank you for volunteering!',
        type: 'info',
      });
      this.props.navigation.navigate('AgendaView', {
        response: { ...response },
      });
    } else {
      const { item } = this.props.navigation.state.params;
      console.log('inside edit else', item);
      userEntries.id = item.id;

      console.warn('data before edit api call', userEntries);

      const editResponse = await API.editAvailability(
        token.token,
        userEntries,
        isRecurring
      );

      console.warn('response', editResponse);

      if (editResponse.error) {
        this.setState({ error: editResponse.error });
        return;
      }

      console.warn('respoonse from edit', editResponse);
      showMessage({
        message: 'Availability Added. ',
        description: 'Thank you for volunteering!',
        type: 'info',
      });
      this.props.navigation.navigate('AgendaView', {
        response: { ...editResponse },
      });
    }
  };

  toggleRecModal = () => {
    this.setState({ recurringModal: !this.state.recurringModal });
  };

  toggleLocationModal = () => {
    this.setState({ locationModal: !this.state.locationModal });
  };
  handleBack = () => {
    const { navigation } = this.props;
    navigation.navigate('AgendaView');
  };
  render() {
    let {
      startDate,
      startTime,
      endTime,
      endDate,
      locationData,
    } = this.state.availData;

    const { navigation } = this.props;
    console.log('form info', this.state);

    return (
      <Container>
        <View style={styles.mainContainer}>
          <BackHeader
            onPress={this.handleBack}
            title={
              navigation.state.params.new
                ? 'Add Availability'
                : 'Edit Availability'
            }
            disable={false}
          />
        </View>
        <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
          <View onStartShouldSetResponder={() => true}>
            <Block style={styles.scrollContainer}>
              <Text style={styles.titleAvail}>Availability Info</Text>
              <Text style={styles.subTitleAvail}>
                Continue with availability information
              </Text>
            </Block>

            <Text style={styles.labelStyleAvail}>Availability Start Date:</Text>
            <View>
              <DatePickerView
                dateProp={startTime}
                display="default"
                mode="date"
                setDate={this.setStartDate}
              />
            </View>

            <Text style={styles.displaySelection}>
              Selected date:
              {moment(startTime).format('MMMM D, YYYY')}
            </Text>

            <Text style={styles.labelStyleAvail}>Availability Start Time:</Text>
            <View>
              <DatePickerView
                dateProp={startTime}
                display="default"
                mode="time"
                display="spinner"
                setDate={this.setStartTime} //setDate is a prop used for both date and date-time.
                title="Pick a Time"
              />
            </View>

            <Text style={styles.displaySelection}>
              Selected time: {moment(startTime).format('h:mm A')}
            </Text>

            <View>
              <DatePickerView
                dateProp={endTime}
                display="default"
                mode="time"
                display="spinner"
                setDate={this.setEndTime}
                title="Pick a Time"
              />
            </View>

            <Text style={styles.displaySelection}>
              Selected time: {moment(endTime).format('h:mm  A')}
            </Text>

            <Text style={styles.labelStyleAvail}>
              Is this a weekly recurring?{' '}
            </Text>
            <TouchableOpacity onPress={this.toggleRecModal}>
              <Text style={[styles.sectionTitle, { color: '#475c67' }]}>
                {this.state.isRecurring ? 'Yes' : 'No'}
              </Text>
            </TouchableOpacity>
            {/* <ModalDropdown
              defaultValue={this.state.isRecurring ? 'Yes' : 'No'}
              defaultIndex={this.state.isRecurring ? 1 : 0}
              onSelect={(i, v) => {
                const values = [false, true];
                if (values.includes(true, false)) {
                  return this.setState({ isRecurring: values[i] });
                }
                this.setState({ isRecurring: false });
              }}
              options={['No', 'Yes']}
              textStyle={[styles.sectionTitle, { color: '#475c67' }]}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.dropdownTextStyle}
              style={styles.modalDropdown}
            /> */}
            <BottomModal
              isVisible={this.state.recurringModal}
              onBackPress={this.toggleRecModal}
              onSelect={i => this.handleRecurringChange(i)}
              data={this.state.recurringOptions}
            />

            {this.state.isRecurring && (
              <View>
                <Text style={styles.labelStyleAvail}>
                  Date to End Recurring Availability:
                </Text>
                <DatePickerView
                  dateProp={endDate}
                  display="default"
                  setDate={this.setEndDate}
                />
                <Text style={styles.displaySelection}>
                  Selected date: {moment(endDate).format('MMMM D, YYYY')}
                </Text>
              </View>
            )}

            {/* {this.state.is_recurring === 'true' && 
              <Sae 
                  label="End Recurring Schedule Date (YYYY-MM-DD)"
                  labelStyle={styles.labelStyle}
                  inputPadding={16}
                  labelHeight={24}
                  // active border height
                  borderHeight={2}
                  borderColor="#475c67"
                  style={[styles.saeInput]}
                  inputStyle={styles.saeText}
                  // TextInput props
                  returnKeyType="next"
                  onChangeText={text => this.props.handleChange(text, 'end_date')}
                  ref={input => this.props.innerRef(input, 'EndDate')}
                  onSubmitEditing={() => this.props.handleSubmitEditing('EndDate')}
                //   blurOnSubmit={false}>
              />
            } */}
            {this.state.locationData.length > 0 && (
              <View>
                <Text style={styles.labelStyleAvail}>Set Location</Text>

                <TouchableOpacity onPress={this.toggleLocationModal}>
                  <Text style={[styles.sectionTitle, { color: '#475c67' }]}>
                    {this.state.defaultLocation}
                  </Text>
                </TouchableOpacity>

                {/* <ModalDropdown
                  defaultValue={this.state.defaultLocation}
                  onSelect={(i, v) => {
                    this.handleLocationChange(v, i);
                  }}
                  options={this.state.locationData}
                  textStyle={[styles.sectionTitle, { color: '#475c67' }]}
                  dropdownStyle={styles.dropdownStyle}
                  dropdownTextStyle={styles.dropdownTextStyle}
                  style={styles.modalDropdown}
                /> */}

                <BottomModal
                  isVisible={this.state.locationModal}
                  onBackPress={this.toggleLocationModal}
                  onSelect={(i, v) => this.handleLocationChange(i, v)}
                  data={this.state.locationData}
                />
              </View>
            )}

            {this.state.locationData.length === 0 && (
              <Text
                style={{
                  paddingTop: 5,
                  paddingLeft: 15,
                  paddingRight: 10,
                  fontSize: 18,
                  color: '#D8000C',
                }}
              >
                Please add a location to submit availability
              </Text>
            )}

            {this.state.error != '' && (
              <View>
                <Text style={styles.errorMessage}>{this.state.error}</Text>
              </View>
            )}

            {this.state.locationData.length > 0 && (
              <Block style={styles.footer}>
                <CalendarButton
                  title="Submit"
                  onPress={() => this.handleUserSubmit()}
                />
              </Block>
            )}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

export default RegisterAvailabilityForm;
