import React from 'react';
import {
  Text,
  ScrollView,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class AvailabilityForm extends React.Component {
  constructor(props) {
    super(props);
    const isNewItem = this.props.navigation.state.params.new;

    if (!isNewItem) {
      var { params } = props.navigation.state;
    }
    this.state = {
      isRecurring: isNewItem ? false : params.item.isRecurring,

      availData: {
        startDate: isNewItem ? null : params.item.startDate,
        endDate: isNewItem
          ? {}
          : moment.utc(params.item.endDate).format('llll'),
        startTime: isNewItem ? null : params.item.startTime,
        endTime: isNewItem ? null : params.item.endTime,
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

      let locationData = [...this.state.locationData];
      locations.map(location => {
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
          let newVal = value.concat(' ', '(Default)');
          locationData.push(newVal);
          this.setState({
            defaultLocation: newVal,
            selectedLocation: location.id,
          });
        } else {
          locationData.push(value);
        }
      });
      this.setState({ locationData, locations });
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
    this.setState({ availData: availInfo });
  };

  handleInnerRef = (input, id) => {
    this.inputs[id] = input;
  };

  handleLocationChange = (location, index) => {
    const { locations } = this.state;
    const selectedLocation = locations[index].id;
    this.setState({
      selectedLocation,
      locationModal: false,
      defaultLocation: location,
    });
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
    this.setState({
      availData: {
        ...this.state.availData,
        endDate: date,
      },
    });
  };

  handleRecurringChange = value => {
    if (value === 'Yes') {
      this.setState({
        isRecurring: true,
        recurringModal: false,
        availData: { ...this.state.availData, endDate: new Date() },
      });
    } else this.setState({ isRecurring: false, recurringModal: false });
  };

  convertToUTC = async (date, time) => {
    const startTime = moment(time).format('HH:mm');
    const dateConcat = moment(date).format('YYYY-MM-DD') + ' ' + startTime;
    const utcConversion = moment(dateConcat);
    return utcConversion;
  };

  //async await needed for proper Promise handling during submit function
  handleUserSubmit = async () => {
    const { availData, isRecurring, selectedLocation } = this.state;
    const { startDate, startTime, endDate, endTime } = availData;
    const isNew = this.props.navigation.state.params.new;

    let token = await AsyncStorage.getItem('token');
    token = JSON.parse(token);

    let userEntries = {};

    const convEndDate = moment(endDate).format('YYYY-MM-DD');
    const convStartDate = moment(startDate).format('YYYY-MM-DD');

    const convStartTime = await this.convertToUTC(startDate, startTime);
    const convEndTime = await this.convertToUTC(startDate, endTime);

    if (isRecurring) {
      userEntries = {
        start_time: convStartTime,
        end_time: convEndTime,
        is_recurring: isRecurring,
        location_id: selectedLocation,
        start_date: convStartDate,
        end_date: convEndDate,
      };
    } else {
      userEntries = {
        start_time: convStartTime,
        end_time: convEndTime,
        is_recurring: isRecurring,
        location_id: selectedLocation,
      };
    }

    if (isNew) {
      const response = await API.createAvailability(
        userEntries,
        isRecurring,
        token.token
      );

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
      userEntries.id = item.id;

      const editResponse = await API.editAvailability(
        token.token,
        userEntries,
        isRecurring
      );

      if (editResponse.error) {
        this.setState({ error: editResponse.error });
        return;
      }

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
    const { startDate, startTime, endTime, endDate } = this.state.availData;
    const {
      locationData,
      isRecurring,
      defaultLocation,
      recurringModal,
      recurringOptions,
      error,
      locationModal,
    } = this.state;

    const { navigation } = this.props;

    return (
      <Container>
        <View>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View onStartShouldSetResponder={() => true}>
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Select Start Date</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                  paddingLeft: 15,
                }}
              >
                <View style={{ paddingRight: 15 }}>
                  <Icon
                    name="calendar-blank-outline"
                    size={30}
                    color="#475c67"
                  />
                </View>
                <DatePickerView
                  dateProp={startDate}
                  display="default"
                  mode="date"
                  setDate={this.setStartDate}
                  showIcon={true}
                  title={'Select Date'}
                  placeholder={'Start Date'}
                />
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Select Time</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                  paddingLeft: 15,
                }}
              >
                <View style={{ paddingRight: 15 }}>
                  <Icon name="clock-outline" size={30} color="#475c67" />
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      styles.displaySelection,
                      { paddingRight: 10, color: '#475c67' },
                    ]}
                  >
                    From
                  </Text>
                  <DatePickerView
                    dateProp={startTime}
                    display="default"
                    mode="time"
                    display="spinner"
                    setDate={this.setStartTime} //setDate is a prop used for both date and date-time.
                    title="Pick a Time"
                    placeholder="Start Time"
                  />
                  <Text
                    style={[
                      styles.displaySelection,
                      { paddingLeft: 10, paddingRight: 10, color: '#475c67' },
                    ]}
                  >
                    to
                  </Text>
                  <DatePickerView
                    dateProp={endTime}
                    display="default"
                    mode="time"
                    display="spinner"
                    setDate={this.setEndTime}
                    title="Pick a Time"
                    placeholder="End Time"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Weekly recurring?</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 15,
                  paddingLeft: 15,
                }}
              >
                <View style={{ paddingRight: 20 }}>
                  <Icon name="calendar-outline" size={30} color="#475c67" />
                </View>

                <View>
                  <TouchableOpacity
                    onPress={this.toggleRecModal}
                    style={{
                      borderBottomColor: 'grey',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      paddingTop: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: 'grey',
                      }}
                    >
                      {isRecurring ? 'Yes' : 'No'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <BottomModal
                  isVisible={recurringModal}
                  onBackPress={this.toggleRecModal}
                  onSelect={i => this.handleRecurringChange(i)}
                  data={recurringOptions}
                />

                {isRecurring && (
                  <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                    <Text style={[styles.sectionTitle, { color: '#475c67' }]}>
                      End Date:
                    </Text>
                    <DatePickerView
                      dateProp={endDate}
                      display="default"
                      setDate={this.setEndDate}
                      title={'End date'}
                      mode="date"
                      placeholder={'End Date'}
                    />
                  </View>
                )}
              </View>
            </View>

            {locationData.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Set Location</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: 10,
                    paddingLeft: 15,
                  }}
                >
                  <Icon name="map-marker" size={30} color="#475c67" />
                  <TouchableOpacity onPress={this.toggleLocationModal}>
                    <Text style={[styles.sectionTitle, { color: '#475c67' }]}>
                      {defaultLocation}
                    </Text>
                  </TouchableOpacity>

                  <BottomModal
                    isVisible={locationModal}
                    onBackPress={this.toggleLocationModal}
                    onSelect={(i, v) => this.handleLocationChange(i, v)}
                    data={locationData}
                  />
                </View>
              </View>
            )}

            {locationData.length === 0 && (
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

            {error != '' && (
              <View>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            {locationData.length > 0 && (
              <View
                style={[styles.footer, { paddingLeft: 10, paddingRight: 10 }]}
              >
                <CalendarButton
                  title="Submit"
                  onPress={() => this.handleUserSubmit()}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

export default AvailabilityForm;
