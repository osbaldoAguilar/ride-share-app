import React, { Component, useState, useEffect } from 'react';
import { Alert, Text, View, ScrollView } from 'react-native';
import { Button, ThemeConsumer } from 'react-native-elements';
import { InitOverviewCard } from '../../components/Card';
import BackHeader from '../../components/Header/BackHeader';
import styles from './styles';
import API from '../../api/api';

export default class RequestedRidesDetails extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      textValue: 'Accept Ride',
      err: '',
      isLoading: true,
    };
  }
  componentDidMount = () => {
    console.log('inside component did mount');
    this.requestRider();
    this.requestRide();
  };

  requestRide = () => {
    const { navigation } = this.props;
    const token = navigation.getParam('token');
    API.getRides(token)
      .then(result => {
        let ride_id = result.rides.rides.id;
        console.log('ride id', result);
      })
      .catch(err => {
        console.log('request ride', err);
      });
  };

  requestRider = () => {
    const { navigation } = this.props;
    const token = navigation.getParam('token');
    const rideId = navigation.getParam('rideId');
    API.getRide(token, rideId)
      .then(res => {
        console.log('res', res);
        this.setState({
          firstName: res.ride.rider.first_name,
          lastName: res.ride.rider.last_name,
          isLoading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  acceptingRide = () => {
    const { navigation } = this.props;
    const token = navigation.getParam('token');
    const rideId = navigation.getParam('rideId');
    API.acceptRide(rideId, token)
      .then(result => {
        console.log('rideId from props', rideId);
        console.log('accept API call', result);
        navigation.navigate('MainView', { acceptedRide: true });
      })
      .catch(_err => {
        Alert.alert('Did not confirm ride');
        console.log('DIDNT WORK in API call');
        console.log('rideId from props', rideId);
      });
  };

  onPress = () => {
    console.log('ONPRESS');
    Alert.alert('Want to accept this ride?', '', [
      { text: 'cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          this.acceptingRide();
        },
      },
    ]);
  };

  handleBack = () => {
    const { navigation } = this.props;
    navigation.navigate('MainView');
  };

  render() {
    const { textValue } = this.state;
    const { navigation } = this.props;
    const startLocation = navigation.getParam('startLocation');
    const endLocation = navigation.getParam('endLocation');
    const default_to_pickup_distance=navigation.getParam('default_to_pickup_distance');
    const pickup_to_dropoff_distance=navigation.getParam('pickup_to_dropoff_distance');
    const date2 = navigation.getParam('date');
    const date = new Date(date2);
    date.toString();
    const reason = navigation.getParam('reason');
    console.log('in RequestRideDetails startLocat:', startLocation);
    console.log('in RequestRideDetails endLocat:', endLocation);
    return (
      <View style={styles.container}>
        <BackHeader
          onPress={this.handleBack}
          title={'Ride Details'}
          disable={false}
        />
        <ScrollView scrollsToTop showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            <Text numberOfLines={3} style={styles.nameText}>
              Picking up:
           

            </Text>
            <Text numberOfLines={3} style={styles.nameText}>
              {this.state.firstName} {this.state.lastName}
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <InitOverviewCard
              pickupAddress={startLocation.join(', ')}
              dropoffAddress={endLocation.join(', ')}
              date={date}
              note={reason}
              pickup_to_dropoff_distance={pickup_to_dropoff_distance}
              default_to_pickup_distance={default_to_pickup_distance}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <Button
            title={textValue}
            containerStyle={styles.startRideContainer}
            titleStyle={styles.startRideTitle}
            buttonStyle={styles.startRideButton}
            onPress={this.onPress}
            raised
          />
        </View>
        <View style={styles.footer} />
      </View>
    );
  }
}
