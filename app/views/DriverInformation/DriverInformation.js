import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BackHeader from '../../components/Header/BackHeader';
import CalendarButton from '../../components/Button/CalendarButton/CalendarButton';
import styles from '../../components/Forms/styles';
import API from '../../api/api';

class DriverInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
    };
  }

  componentDidMount = () => {
    console.log('props', this.props.navigation);
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
    } = this.props.navigation.state.params.driverData;
    this.setState({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    });
  };

  handleBackButton = () => {
    this.props.navigation.navigate('Settings');
  };

  handleFirstName = text => {
    this.setState({
      firstName: text,
    });
  };

  handleLastName = text => {
    this.setState({
      lastName: text,
    });
  };

  handleEmail = text => {
    this.setState({
      email: text,
    });
  };

  handlePhoneNumber = text => {
    this.setState({
      phoneNumber: text,
    });
  };

  handleSubmit = () => {
    const driverData = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone: this.state.phoneNumber,
    };

    AsyncStorage.getItem('token', (err, result) => {
      const obj = JSON.parse(result);
      const { token } = obj;

      API.updateSettingsDriver(driverData, token);
    });
  };

  render() {
    return (
      <View>
        <BackHeader
          onPress={this.handleBackButton}
          title={'Driver Information'}
          disable={false}
        />

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle} />
          </View>
        </View>

        <View>
          {/* Input for Volunteer Driver's First Name */}
          <Text style={styles.labelStyleAlt}>First Name:</Text>
          <TextInput
            onChangeText={this.handleFirstName}
            placeholderTextColor="#C0C0C0"
            placeholder="First Name"
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.lastName.focus();
            }}
            value={this.state.firstName}
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />

          {/* Input for Volunteer Driver's Last Name */}
          <Text style={styles.labelStyleAlt}>Last Name:</Text>
          <TextInput
            onChangeText={this.handleLastName}
            placeholderTextColor="#C0C0C0"
            placeholder="Last Name"
            ref={input => {
              this.lastName = input;
            }}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.phone.focus();
            }}
            value={this.state.lastName}
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />

          {/* Input for Volunteer Driver's Phone Number */}
          <Text style={styles.labelStyleAlt}>Phone Number:</Text>
          <TextInput
            onChangeText={this.handlePhoneNumber}
            placeholderTextColor="#C0C0C0"
            placeholder="9195551234"
            keyboardType="phone-pad"
            ref={input => {
              this.phone = input;
            }}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.email.focus();
            }}
            value={this.state.phoneNumber}
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />

          {/* Input for Volunteer Driver's Email Address; 
            NOTE: IF AN EMAIL IS A DUPLICATE TO ONE ALREADY IN ANY ORG, IT WILL NOT SUBMIT! */}
          <Text style={styles.labelStyleAlt}>Email:</Text>
          <TextInput
            onChangeText={this.handleEmail}
            placeholderTextColor="#C0C0C0"
            placeholder="example@example.com"
            keyboardType="email-address"
            ref={input => {
              this.email = input;
            }}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.password.focus();
            }}
            value={this.state.email}
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
            autoCapitalize="none"
          />
        </View>
        {/* 
        <View>
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                Distance available to drive:
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={this.toggleRadModal}>
              <Text style={[styles.sectionTitle, { color: '#475c67' }]}>
                {'stuff'}
              </Text>
            </TouchableOpacity>
            <BottomModal
              isVisible={this.state.radiusModal}
              onBackPress={this.toggleRadModal}
              onSelect={this.onSelectRad}
              data={this.state.radiusOptions}
            />
          </View>
        </View> */}

        <View style={{ padding: 15 }}>
          <CalendarButton onPress={this.handleSubmit} title="Submit Edit" />
        </View>
      </View>
    );
  }
}

export default DriverInformation;
