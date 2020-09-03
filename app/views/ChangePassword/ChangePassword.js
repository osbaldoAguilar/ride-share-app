import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import styles from './styles';
import BackHeader from '../../components/Header/BackHeader';
import { CalendarButton } from '../../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../api/api';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      validPassword: false,
      matchingPassword: false,
    };
  }

  handleBack = () => {
    const { navigation } = this.props;
    navigation.navigate('Settings');
  };

  validatePassword = () => {
    const { newPassword } = this.state;

    console.log('new passowrd', newPassword);
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    ) {
      console.log('pass');
      this.setState({ validPassword: true });
    } else {
      this.setState({ validPassword: false });
    }
  };

  validateMatch = () => {
    const { newPassword, confirmPassword } = this.state;
    console.log('called valid match');
    console.log('new password', newPassword);
    console.log('confim password', confirmPassword);
    if (newPassword === confirmPassword) {
      this.setState({ matchingPassword: true });
    } else {
      this.setState({ matchingPassword: false });
    }
  };

  beginValidationError = () => {
    const { newPassword } = this.state;
    if (newPassword.length === 0) {
      this.setState({ validPassword: false });
    }
  };

  beginValidationMatchError = () => {
    const { confirmPassword } = this.state;
    console.log(confirmPassword);
    if (confirmPassword.length === 0) {
      this.setState({ matchingPassword: false });
    }
  };

  handlePasswordChange = async () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
      validPassword,
      matchingPassword,
    } = this.state;
    const token = await AsyncStorage.getItem('token');
    const parsedValue = JSON.parse(token);
    const parsedToken = parsedValue.token;

    //make sure data isn't blank
    console.log('validPassword', validPassword);
    console.log('matchingPassword', matchingPassword);
    console.log('length', currentPassword.length);
    if (currentPassword.length > 0 && validPassword && matchingPassword) {
      API.changePassword(
        parsedToken,
        currentPassword,
        newPassword,
        confirmPassword
      ).then(res => {
        console.log('result from api', res);
      });
    } else {
      this.setState({ error: 'NO' });
    }
  };
  render() {
    const { matchingPassword, validPassword } = this.state;

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <BackHeader
            onPress={this.handleBack}
            disable={false}
            title={'Update Password'}
          />
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Password Change</Text>
            </View>
            <Text style={styles.labelStyleAlt}>Current Password:</Text>
            <TextInput
              onChangeText={text => this.setState({ currentPassword: text })}
              placeholderTextColor="#C0C0C0"
              placeholder="Current Password"
              returnKeyType={'next'}
              onSubmitEditing={() => {
                this.newPasswordRef.focus();
              }}
              blurOnSubmit={false}
              style={styles.saeInputAlt} //way for use to tell if password is correct
              inputStyle={styles.saeTextAlt}
            />

            {/* Input for Volunteer Driver's Last Name */}
            <Text style={styles.labelStyleAlt}>New Password:</Text>
            <TextInput
              onChangeText={text =>
                this.setState({ newPassword: text }, () =>
                  this.validatePassword()
                )
              }
              secureTextEntry={true}
              onFocus={() => this.beginValidationError()}
              placeholderTextColor="#C0C0C0"
              placeholder="New Password"
              ref={input => {
                this.newPasswordRef = input;
              }}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                this.confirmPasswordRef.focus();
              }}
              blurOnSubmit={false}
              style={
                validPassword ? styles.saeInputAlt : styles.saeInputAltWrong
              }
              inputStyle={styles.saeTextAlt}
            />

            {/* Input for Volunteer Driver's Last Name */}
            <Text style={styles.labelStyleAlt}>Confirm Password:</Text>
            <TextInput
              onChangeText={text =>
                this.setState({ confirmPassword: text }, () =>
                  this.validateMatch()
                )
              }
              onFocus={() => this.beginValidationMatchError()}
              placeholderTextColor="#C0C0C0"
              placeholder="Confrim Password"
              ref={input => {
                this.confirmPasswordRef = input;
              }}
              secureTextEntry={true}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                this.phone.focus();
              }}
              blurOnSubmit={false}
              style={
                matchingPassword ? styles.saeInputAlt : styles.saeInputAltWrong
              }
              inputStyle={styles.saeTextAlt}
            />

            <Text style={{ color: '#C0C0C0' }}>
              Password must be 8 characters long and contain UPPER CASE, lower
              case, symbol (e.g !@#$%)
            </Text>
            {this.state.error != '' && (
              <View
                style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}
              >
                <Text style={styles.errorMessage}>{this.state.error}</Text>
              </View>
            )}
            <View
              style={[styles.footer, { paddingRight: 10, paddingLeft: 10 }]}
            >
              <CalendarButton
                title="Continue"
                onPress={
                  //pass the data (user inputs including orgID and radius), nav info for redirect to handleUserInput fx above
                  this.handlePasswordChange
                }
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default ChangePassword;
