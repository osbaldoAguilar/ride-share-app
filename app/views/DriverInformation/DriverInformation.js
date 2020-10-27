import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import BackHeader from '../../components/Header/BackHeader';
import BottomModal from '../../components/Modal/BottomModal';
import styles from '../../components/Forms/styles';

class DriverInformation extends Component {
  handleBackButton = () => {
    this.props.navigation.navigate('Settings');
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
            onChangeText={text => this.setState({ first_name: text })}
            placeholderTextColor="#C0C0C0"
            placeholder="First Name"
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.lastName.focus();
            }}
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />

          {/* Input for Volunteer Driver's Last Name */}
          <Text style={styles.labelStyleAlt}>Last Name:</Text>
          <TextInput
            onChangeText={text => this.setState({ last_name: text })}
            placeholderTextColor="#C0C0C0"
            placeholder="Last Name"
            ref={input => {
              this.lastName = input;
            }}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.phone.focus();
            }}
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />

          {/* Input for Volunteer Driver's Phone Number */}
          <Text style={styles.labelStyleAlt}>Phone Number:</Text>
          <TextInput
            onChangeText={text => this.setState({ phone: text })}
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
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />

          {/* Input for Volunteer Driver's Email Address; 
            NOTE: IF AN EMAIL IS A DUPLICATE TO ONE ALREADY IN ANY ORG, IT WILL NOT SUBMIT! */}
          <Text style={styles.labelStyleAlt}>Email:</Text>
          <TextInput
            onChangeText={text => this.setState({ email: text })}
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
            blurOnSubmit={false}
            style={[styles.saeInputAlt]}
            inputStyle={styles.saeTextAlt}
          />
        </View>

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
            {/* <BottomModal
              isVisible={this.state.radiusModal}
              onBackPress={this.toggleRadModal}
              onSelect={this.onSelectRad}
              data={this.state.radiusOptions}
            /> */}
          </View>
        </View>
      </View>
    );
  }
}

export default DriverInformation;
