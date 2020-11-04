import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import { Header } from '../../components/Header';
import { UpcomingRideCard, RequestedRideCard } from '../../components/Card';
import styles from './styles';
import variables from '../../utils/variables';
import API from '../../api/api';

export default class MainView extends Component {
  scrollX = new Animated.Value(0);
  constructor(props) {
    super(props);
    // debugger;
    let isNewRegistered =
      'params' in props.navigation.state
        ? props.navigation.state.params.isRegistering
        : false;
    this.state = {
      scheduledRides: [],
      hasScheduledRides: false,
      approvedRides: [],
      withinAvailRides: [],
      hasReqRidesInAvail: false,
      showAllRides: false,
      toggleButtonText: 'Show All Requested Rides',
      isLoading: false,
      isNewRegistered: isNewRegistered,
      driverApproved: false,
      token: '',
      driveractive: true,
    };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.navigation !== this.props.navigation) {
      console.log('updated');
      this.handleToken();
    }
  };

  componentDidMount = () => {
    this.setState({ isLoading: true });
    this.handleToken();
    this.state.isNewRegistered ? this.newRegistrationAlert() : null;

    console.log('main view', this.state.isNewRegistered);
  };

  handleToken = async () => {
    console.log('handle token called');
    const value = await AsyncStorage.getItem('token');
    const parsedValue = JSON.parse(value);
    const realToken = parsedValue.token;
    console.log('token in main view', realToken);
    this.setState(
      {
        token: realToken,
      },
      () => {
        // Make sure state was updated before running this function.
        this.ridesRequests();
      }
    );
  };

  ridesRequests = async () => {
    const { token } = this.state;
    //

    API.getAvailabilities(token).then(result => {
      if (result.json === undefined) {
        AsyncStorage.removeItem('token');
        this.props.navigation.navigate('Auth');
      } else {
        this.setState({
          availabilities: result.json,
        });
        console.log('in getAvail: ', result.json);
        //set up to call getDriver
        this.getDriver(token);
      }
    });
  };

  getDriver = token => {
    API.getDriver(token)
      .then(result => {
        console.log('after GETDRIVER: ', result);
        // const driverId = result.driver.id;
        // Check application_state is "accepted", background_check => true
        const {
          id,
          application_state,
          background_check,
          is_active,
        } = result.driver;
        if (application_state === 'accepted' && background_check) {
          if (is_active) {
            // pass date to query rides from starting date
            API.getRides(token).then(result => {
              console.log('all rides: ', result.rides);
              const rides = result.rides;
              //grab all rides and sort by date then check for scheduled and approved rides and sort / save seperately
              const ridesReady = rides.filter(ride => {
                return new Date(ride.pick_up_time) >= new Date();
              });
              console.log('before state', ridesReady);
              const myRides = ridesReady.filter(ride => ride.driver_id === id);
              console.log('just my rides: ', myRides);
              const scheduledRides = myRides.filter(
                ride => ride.status === 'scheduled'
              );
              console.log('scheduled rides: ', scheduledRides);
              const approvedRides = ridesReady.filter(
                ride => ride.status === 'approved'
              );
              console.log('approved rides: ', approvedRides);
              const withinAvailRides = this.withinMyAvail(
                rides.filter(ride => ride.status === 'approved')
              );
              console.log('approved rides in my avail: ', withinAvailRides);
              this.setState({
                scheduledRides,
                approvedRides,
                withinAvailRides,
                isLoading: false,
                driverApproved: true,
                driveractive: true,
              });
              console.log('driverApproved:', this.state.driverApproved);
            });
          } else {
            this.setState({ isLoading: false, driveractive: false });
          }
        } else {
          this.setState({
            isLoading: false,
            driverInformation: {
              applicationState: application_state,
              backgroundCheck: background_check,
            },
          });
        }
      })
      .catch(err => {
        console.log('request ride err', err);
      });
  };
  renderLoader = () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      return null;
    }
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  upcomingScheduledRide = item => {
    const { token } = this.state;
    const { navigation } = this.props;
    const riderId = item.rider_id;
    const rideId = item.id;
    const date = new Date(item.pick_up_time);
    date.toString();
    const startLocation = [
      item.start_location.street,
      item.start_location.city,
      item.start_location.state,
    ];
    const endLocation = [
      item.end_location.street,
      item.end_location.city,
      item.end_location.state,
    ];
    const phone = item.phone;
    const reason = item.reason;
    const round_trip = item.round_trip;
    const expected_wait_time = item.expected_wait_time;
    const pickup_to_dropoff_distance = item.pickup_to_dropoff_distance;
    const pick_up_to_drop_off_time = item.pick_up_to_drop_off_time;
    const default_to_pickup_distance = item.default_to_pickup_distance;
    console.log(
      'round trip ',
      round_trip,
      ', wait time: ',
      expected_wait_time,
      'pickup_to_dropoff_distance: ',
      pickup_to_dropoff_distance,
      ' & default_to_pickup_distance: ',
      item.default_to_pickup_distance
      // pickup_to_dropoff_distance,
      // ' = PUTDOD'
    );
    return (
      <UpcomingRideCard
        key={item.driver_id}
        onPress={() => {
          navigation.navigate('RideView', {
            riderId,
            rideId,
            token,
            startLocation,
            endLocation,
            date,
            reason,
            phone,
            round_trip,
            expected_wait_time,
            pickup_to_dropoff_distance,
            pick_up_to_drop_off_time,
            default_to_pickup_distance,
          });
        }}
        date={date}
        pickupLocation={startLocation.join(', ')}
        dropoffLocation={endLocation.join(', ')}
      />
    );
  };
  renderDots = () => {
    const { scheduledRides } = this.state;
    const dotPosition = Animated.divide(this.scrollX, variables.deviceWidth);
    return (
      <View style={styles.dotContainer}>
        {scheduledRides.slice(0, 3).map((item, index) => {
          const borderWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0, 2.5, 0],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`step-${item.id}`}
              style={[styles.dots, styles.activeDot, { borderWidth }]}
            />
          );
        })}
      </View>
    );
  };
  renderUpcomingRides = () => {
    const { scheduledRides } = this.state;
    console.log('render upcomming', scheduledRides);
    const numRides = scheduledRides.length;
    const seeAll = `See all (${numRides})`;
    if (scheduledRides.length === 0) {
      return (
        <View>
          <View>
            <Text style={styles.noSchedText}>
              You do not currently have any scheduled rides.
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.titleWrapper}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.subTitle}>Upcoming Schedule</Text>
            </View>
            {numRides > 3 ? (
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={this.navigateToDriverSchedule}>
                  <Text style={styles.seeAllText}>{seeAll}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View style={styles.seperator} />

          <FlatList
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center"
            style={{ overflow: 'visible' }}
            data={scheduledRides.slice(0, 3)}
            keyExtractor={item => `${item.id}`} // id is not showing up in response
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => this.upcomingScheduledRide(item)}
          />
          {this.renderDots()}
        </View>
      );
    }
  };
  requestedRide = item => {
    const { token } = this.state;
    const { navigation } = this.props;
    const startLocation = [
      item.start_location.street,
      item.start_location.city,
      item.start_location.state,
    ];
    const endLocation = [
      item.end_location.street,
      item.end_location.city,
      item.end_location.state,
    ];
    const riderId = item.rider_id;
    const rideId = item.id;
    const date = new Date(item.pick_up_time);
    date.toString();
    const name = item.riderName;
    const reason = item.reason;
    const default_to_pickup_distance=item.default_to_pickup_distance;
    const pickup_to_dropoff_distance=item.pickup_to_dropoff_distance;
    console.log("data item",item)
    return (
      <RequestedRideCard
        key={item.driver_id}
        onPress={() => {
          navigation.navigate('RequestedRidesDetails', {
            riderId,
            rideId,
            token,
            startLocation,
            endLocation,
            date,
            name,
            reason,
            pickup_to_dropoff_distance,
            default_to_pickup_distance
          });
        }}
        name={name}
        date={date}
        pickupLocation={startLocation.join(', ')}
        dropoffLocation={endLocation.join(', ')}
      />
    );
  };

  withinMyAvail = ride => {
    let myAvailRides = [];
    let availabilities = this.state.availabilities;

    ride.map(eachRide => {
      availabilities.map(checkEach => {
        let start = checkEach.startTime;
        let end = checkEach.endTime;
        if (eachRide.pick_up_time >= start && eachRide.pick_up_time <= end) {
          myAvailRides.push(eachRide);
        }
      });
    });
    return myAvailRides;
  };

  filteredRide = item => {
    const { token } = this.state;
    const { navigation } = this.props;
    const startLocation = [
      item.start_location.street,
      item.start_location.city,
      item.start_location.state,
    ];
    const endLocation = [
      item.end_location.street,
      item.end_location.city,
      item.end_location.state,
    ];
    const riderId = item.rider_id;
    const rideId = item.id;
    const date = new Date(item.pick_up_time);
    date.toString();
    const name = item.riderName;
    const reason = item.reason;
    return (
      <RequestedRideCard
        key={item.driver_id}
        onPress={() => {
          navigation.navigate('RequestedRidesDetails', {
            riderId,
            rideId,
            token,
            startLocation,
            endLocation,
            date,
            name,
            reason,
          });
        }}
        name={name}
        date={date}
        pickupLocation={startLocation.join(', ')}
        dropoffLocation={endLocation.join(', ')}
      />
    );
  };

  renderRequestedRides = () => {
    const { approvedRides } = this.state;
    console.log('aprroved', approvedRides);
    return (
      <View>
        <View style={styles.titlesContainer}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.subTitle}>Requested Rides</Text>
          </View>
        </View>
        <View style={styles.seperator} />
        <FlatList
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToAlignment="center"
          style={{ overflow: 'visible' }}
          data={approvedRides}
          keyExtractor={item => `${item.id}`} // id is not showing up in response
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item }) => this.requestedRide(item)}
        />
      </View>
    );
  };

  renderFilteredRides = () => {
    const { withinAvailRides } = this.state;
    console.log('whats in the withinAvailRides state? ', withinAvailRides);
    if (withinAvailRides.length === 0) {
      return (
        <View>
          <Text style={styles.noAvailText}>
            There currently are no requested rides within your availability.
          </Text>
          <TouchableOpacity
            style={styles.buttonBar}
            onPress={this.showAllRides}
          >
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>
                {this.state.toggleButtonText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.titlesContainer}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.subTitle}>
                Requested rides within my availability:
              </Text>
            </View>
          </View>
          <View style={styles.seperator} />
          <FlatList
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center"
            style={{ overflow: 'visible' }}
            data={withinAvailRides}
            keyExtractor={(item, index) => index.toString()} // id is not showing up in response
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => this.filteredRide(item)}
          />
          <TouchableOpacity
            style={styles.buttonBar}
            Z
            onPress={this.showAllRides}
          >
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>
                {this.state.toggleButtonText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  showAllRides = () => {
    if (this.state.showAllRides === false) {
      this.setState({
        showAllRides: true,
        toggleButtonText: 'Hide All Requested Rides',
      });
    } else {
      this.setState({
        showAllRides: false,
        toggleButtonText: 'Show All Requested Rides',
      });
    }
  };

  navigateToSettings = () => {
    const { navigation } = this.props;
    navigation.navigate('Settings');
  };

  navigateToDriverSchedule = () => {
    // takes me to ALL schedules rides
    const { scheduledRides } = this.state;
    const { navigation } = this.props;
    const { token } = this.state;
    navigation.navigate('DriverScheduleView', { scheduledRides, token });
  };
  newRegistrationAlert = () => {
    console.log('New Registration!!?!?...');
    const { isNewRegistered } = this.state;
    isNewRegistered
      ? Alert.alert(
          'You have been Registered!',
          'Next step is to add a vehicle, do you want to add one now?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                return;
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.navigate('RegisterVehicle', {
                  isAdding: true,
                  isEditing: false,
                  isCreating: false,
                });
              },
            },
          ],
          { cancelable: false }
        )
      : null;
  };
  rendernonactivedriver = () => {
    return (
      <View
        style={{
          paddingTop: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20 }}>Driver is not Active!</Text>
        <Text style={{ marginBottom: 20, fontSize: 20 }}>
          Go to Settings to change driver status!
        </Text>

        <TouchableOpacity
          onPress={this.navigateToSettings}
          style={styles.gobackButton}
        >
          <Text style={styles.buttonTitle}>Settings</Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const { isLoading } = this.state;
    // const driveractive= false;
    console.log('driveractive', this.state.driveractive);
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.handleToken()} />
        <StatusBar barStyle="light-content" backgroundColor="#1EAA70" />
        <Header onPress={this.navigateToSettings} title={'Welcome'} />
        <ScrollView
          scrollsToTop
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: variables.sizes.padding,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={this.ridesRequests}
            />
          }
        >
          {isLoading ? null : (
            <View>
              {!this.state.driveractive ? (
                this.rendernonactivedriver()
              ) : (
                <View>
                  {this.state.driverApproved ? (
                    <View>
                      {this.renderUpcomingRides()}
                      {this.renderFilteredRides()}
                    </View>
                  ) : (
                    console.log('NOthing')
                  )}
                  <View style={styles.statusBar}>
                    {!this.state.driverApproved ? (
                      <Text>Waiting to be approved by the administrators</Text>
                    ) : null}
                  </View>
                  {this.state.showAllRides && this.renderRequestedRides()}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
