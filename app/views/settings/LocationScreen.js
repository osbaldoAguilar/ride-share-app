import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { CalendarButton } from '../../components/Button';
import API from '../../api/api';
import styles from './locationStyle.js';
import AsyncStorage from '@react-native-community/async-storage';

class LocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      street: '',
      city: '',
      state_initials: '',
      zip_code: '',
      notes: '',
      default_location: false,
      error: '',
    };
  }

  componentDidMount = () => {
    console.log(this.props.navigation.state.params.location);
    const { navigation } = this.props;
    if (navigation.state.params.edit) {
      this.setState({
        street: navigation.state.params.location.street,
        city: navigation.state.params.location.city,
        state_initials: navigation.state.params.location.state,
        zip_code: navigation.state.params.location.zip,
        notes: navigation.state.params.location.notes,
        default_location: navigation.state.params.location.default_location,
      });
    }
  };

  handleToggle = () => {
    this.setState({ default_location: !this.state.default_location });
  };

  handleZipCode = zip => {
    let text = zip.toString();
    this.setState({ zip_code: text });
  };

  handleLocationSubmit = async () => {
    const { navigation } = this.props;

    const {
      street,
      city,
      state_initials,
      zip_code,
      notes,
      default_location,
    } = this.state;

    let data = {
      location: {
        street: street,
        city: city,
        state: state_initials,
        zip: zip_code,
        notes: notes,
      },
    };

    console.log('location data from state', data);
    let token = await AsyncStorage.getItem('token');
    token = JSON.parse(token);
    console.log('location token after parse', token);

    //if edit is true edit else create
    if (navigation.state.params.edit) {
      API.editLocation(
        data,
        navigation.state.params.location.id,
        default_location,
        token.token
      ).then(res => {
        console.log('res', res);
        if (res.error) {
          this.setState({ error: res.error });
          return;
        }
        if (res.errors) {
          this.setState({ error: res.errors });
          return;
        }
        navigation.navigate('Settings');
      });
    } else {
      API.createLocation(data, default_location, token.token).then(res => {
        console.log('res from location', res);
        if (res.error) {
          this.setState({ error: res.error });
          return;
        }
        console.log('location created res', res);
        navigation.navigate('Settings', { edit: true });
      });
    }
  };

  render() {
    console.log('in locatinos');

    const { street, city, state_initials, zip_code, notes } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Address</Text>
        </View>
        <Text style={styles.inputLabel}>Street</Text>
        <TextInput
          onChangeText={text => this.setState({ street: text })}
          placeholderTextColor="#C0C0C0"
          placeholder="Street"
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.street.focus();
          }}
          value={street}
          blurOnSubmit={false}
          style={styles.inputStyle}
          inputStyle={styles.onInputStyle}
        />
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          onChangeText={text => this.setState({ city: text })}
          placeholderTextColor="#C0C0C0"
          placeholder="City"
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.city.focus();
          }}
          value={city}
          blurOnSubmit={false}
          style={styles.inputStyle}
          inputStyle={styles.onInputStyle}
        />

        <Text style={styles.inputLabel}>State</Text>
        <TextInput
          onChangeText={text => this.setState({ state_initials: text })}
          placeholderTextColor="#C0C0C0"
          placeholder="State"
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.state_initials.focus();
          }}
          value={state_initials}
          blurOnSubmit={false}
          style={styles.inputStyle}
          inputStyle={styles.onInputStyle}
        />

        <Text style={styles.inputLabel}>Zip Code</Text>
        <TextInput
          onChangeText={text => this.handleZipCode(text)}
          placeholderTextColor="#C0C0C0"
          placeholder="Zip Code"
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.zip_code.focus();
          }}
          keyboardType="numeric"
          value={zip_code}
          blurOnSubmit={false}
          style={styles.inputStyle}
          inputStyle={styles.onInputStyle}
        />

        <Text style={styles.inputLabel}>Notes</Text>
        <TextInput
          onChangeText={text => this.setState({ notes: text })}
          placeholderTextColor="#C0C0C0"
          placeholder="Notes"
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.notes.focus();
          }}
          multiline={true}
          value={notes}
          blurOnSubmit={false}
          style={styles.inputStyle}
          inputStyle={styles.onInputStyle}
        />
        <View style={styles.defaultLocationContainer}>
          <Text style={styles.inputLabel}>Set as default location?</Text>
          <View style={styles.toggleContainer}>
            <Switch
              onValueChange={this.handleToggle}
              value={this.state.default_location}
            />
          </View>
        </View>

        {this.state.error !== '' && (
          <View>
            <Text style={styles.errorMessage}>{this.state.error}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CalendarButton title="Submit" onPress={this.handleLocationSubmit} />
        </View>
      </View>
    );
  }
}

export default LocationScreen;
