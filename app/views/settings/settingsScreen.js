import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import Radius from 'react-native-vector-icons/MaterialCommunityIcons';
import Pencil from 'react-native-vector-icons/MaterialCommunityIcons';
import Lock from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Phone from 'react-native-vector-icons/AntDesign';
import { AddButton, CalendarButton } from '../../components/Button';

import User from 'react-native-vector-icons/SimpleLineIcons';
import { ScrollView } from 'react-native-gesture-handler';
import BackHeader from '../../components/Header/BackHeader';
import styles from './settingsStyle.js';
import API from '../../api/api';
import { VehicleCard, LocationCard } from '../../components/Card';

import Animated from 'react-native-reanimated';

import { SafeAreaView } from 'react-navigation';

class Settings extends Component {
  _isMounted = false;
  scrollX = new Animated.Value(0);
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      active: true,
      buttonTitle: false,
      allowEmailNotification: false,
      allowPhoneNotification: false,
      default_location: false,

      email: '',
      phoneNumber: '',
      radius: '',
      make: '',
      color: '',
      name: '',
      model: '',
      firstName: '',
      lastName: '',
      organization_id: '',
      street: '',
      city: '',
      state_initials: '',
      zip_code: '',
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
    this.handleRadius = this.handleRadius.bind(this);
    this.handleMake = this.handleMake.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleEmailNotification = this.handleEmailNotification.bind(this);
    this.handlePhoneNotification = this.handlePhoneNotification.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleModel = this.handleModel.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.navigation !== this.props.navigation) {
      console.log('comp updated', this.props);
      let token = await AsyncStorage.getItem('token');
      console.log('TOKEN', token);
      token = JSON.parse(token);

      API.getLocations(token.token).then(res => {
        const locations = res.locations;
        this.setState({ locations }, () => {
          console.log('state for locations', this.state.locations);
        });
      });

      API.getVehicle(token.token).then(response => {
        const vehicles = response.vehicle;
        console.log('vehicles from API :', vehicles);
        this.setState({
          vehicles,
        });
      });
    }
  };

  async componentDidMount() {
    await AsyncStorage.getItem('token', (err, result) => {
      const obj = JSON.parse(result);
      const tokenValue = obj.token;
      this._isMounted = true;

      console.log('token in comp did mount', tokenValue);

      API.getSettingInfo(tokenValue)
        .then(res => {
          const settingInfo = res;
          console.log('settingsInfo', settingInfo);
          if (this._isMounted) {
            this.setState({
              firstName: settingInfo.driver.first_name,
              lastName: settingInfo.driver.last_name,
              email: settingInfo.driver.email,
              phoneNumber: settingInfo.driver.phone,
              radius: JSON.stringify(settingInfo.driver.radius),
              active: settingInfo.driver.is_active,
              organization_id: settingInfo.driver.organization_id,
            });
          }
          API.getVehicle(tokenValue).then(response => {
            const vehicles = response.vehicle;
            console.log('vehicles from API :', vehicles);
            this.setState({
              vehicles,
            });
          });

          API.getLocations(tokenValue).then(res => {
            const locations = res.locations;
            this.setState({ locations }, () => {
              console.log('state for locations', this.state.locations);
            });
          });
        })
        .catch(err => {
          AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Auth');
        });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleBackButton = () => {
    const { active } = this.state;

    if (!active) {
      this.props.navigation.navigate('MainView', { active: false });
    } else {
      this.props.navigation.navigate('MainView');
    }
  };

  handleLogout() {
    AsyncStorage.getItem('token', (err, result) => {
      const obj = JSON.parse(result);
      const { token } = obj;
      API.logout(token)
        .then(res => {
          const loggedOut = res.json.Success;
          if (loggedOut == 'Logged Out') {
            AsyncStorage.removeItem('token');
            this.props.navigation.navigate('Auth');
          } else {
            Alert.alert('Unable to Logout', 'Please try again.');
          }
        })
        .catch(error => {
          AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Auth');
        });
    });
  }

  saveEdit = () => {
    console.log('called api');
    const driverData = {
      organization_id: this.state.organization_id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone: this.state.phoneNumber,
      radius: this.state.radius,
      is_active: this.state.active,
      allowEmailNotification: this.state.allowEmailNotification,
    };

    let data = {
      location: {
        street: this.state.street,
        city: this.state.city,
        state: this.state.state_initials,
        zip: this.state.zip_code,
        notes: null,
      },
    };

    AsyncStorage.getItem('token', (err, result) => {
      const obj = JSON.parse(result);
      const { token } = obj;

      API.updateSettingsDriver(driverData, token)
        .then(result => {
          this.setState({ editable: !this.state.editable });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  toggleEdit = () => {
    this.props.navigation.navigate('DriverInformation');
    this.setState({
      editable: !this.state.editable,
    });
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

  handleStreet = text => {
    this.setState({
      street: text,
    });
  };

  handleCity = text => {
    this.setState({
      city: text,
    });
  };

  handleStateInitials = text => {
    this.setState({
      state_initials: text,
    });
  };

  handleZipCode = text => {
    this.setState({
      street: text,
    });
  };

  handleRadius = text => {
    this.setState({
      zip_code: text,
    });
  };

  handleMake = text => {
    this.setState({
      make: text,
    });
  };

  handleModel = text => {
    this.setState({
      model: text,
    });
  };

  handleColor = text => {
    this.setState({
      color: text,
    });
  };
  handleInsurance = text => {
    this.setState({
      insurance: text,
    });
  };
  handleActive() {
    //make api call for active status
    this.setState({
      active: !this.state.active,
    });
  }

  handleEmailNotification() {
    this.setState({
      allowEmailNotification: !this.state.allowEmailNotification,
    });
  }

  handlePhoneNotification() {
    this.setState({
      allowPhoneNotification: !this.state.allowPhoneNotification,
    });
  }

  handleDeleteLocation = async id => {
    console.log('location id', id);
    let token = await AsyncStorage.getItem('token');
    token = JSON.parse(token);
    try {
      API.deleteLocation(id, token.token).then(res => {
        console.log('response for deleting location', res);
        API.getLocations(token.token).then(res => {
          const locations = res.locations;
          this.setState({ locations }, () => {
            console.log('state for locations', this.state.locations);
          });
        });
      });
    } catch (err) {
      console.log('error trying to delete location', err);
    }
  };

  // renderLocations = () => {
  //   const { navigation } = this.props;
  //   return (
  //     <FlatList
  //       data={this.state.locations}
  //       renderItem={item => {
  //         console.log('rendering flatlist', item);
  //         return (
  //           <View
  //             style={{
  //               padding: 5,
  //               paddingLeft: 10,
  //               paddingTop: 10,
  //               flex: 1,
  //               flexDirection: 'row',
  //             }}
  //           >
  //             <Text style={{ fontSize: 16, color: '#475c67' }}>
  //               {item.item.street}
  //             </Text>
  //             <Text style={{ fontSize: 16, color: '#475c67' }}>
  //               , {item.item.city}
  //             </Text>
  //             <Text style={{ fontSize: 16, color: '#475c67' }}>
  //               , {item.item.state}
  //             </Text>
  //             <Text style={{ fontSize: 16, color: '#475c67' }}>
  //               {' '}
  //               {item.item.zip}
  //             </Text>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 position: 'absolute',
  //                 right: 0,
  //                 paddingTop: 5,
  //               }}
  //             >
  //               {item.item.default_location && (
  //                 <View>
  //                   <Icon color="#ff8262" name="check-bold" size={25}></Icon>
  //                 </View>
  //               )}
  //               <View style={{ paddingLeft: 10 }}>
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     console.log('pressed edit');
  //                     navigation.navigate('LocationScreen', {
  //                       location: item.item,
  //                       edit: true,
  //                     });
  //                   }}
  //                 >
  //                   <Icon color="#ff8262" name="pencil" size={25}></Icon>
  //                 </TouchableOpacity>
  //               </View>
  //               <View style={{ paddingLeft: 10, paddingRight: 10 }}>
  //                 <TouchableOpacity
  //                   onPress={() => this.handleDeleteLocation(item.item.id)}
  //                 >
  //                   <Icon color="#ff8262" name="delete" size={25} />
  //                 </TouchableOpacity>
  //               </View>
  //             </View>
  //           </View>
  //         );
  //       }}
  //       keyExtractor={item => item.id.toString()}
  //     />
  //   );
  // };
  navigateToCalendar = () => {
    const { navigation } = this.props;
    navigation.navigate('AgendaView');
  };

  deleteVehicle = id => {
    Alert.alert('Delete this Vehicle?', '', [
      { text: "Don't Delete", style: 'cancel' },
      {
        text: 'Yes, delete this vehicle',
        onPress: async () => {
          const value = await AsyncStorage.getItem('token');
          const parsedValue = JSON.parse(value);
          const realToken = parsedValue.token;
          this.setState({
            token: realToken,
          });
          console.log('Number of times this runs');
          API.deleteVehicle(id, realToken)
            .then(result => {
              API.getVehicle(realToken).then(response => {
                const vehicles = response.vehicle;
                console.log('vehicles from API :', vehicles);
                this.setState({
                  vehicles,
                });
              });
            })
            .catch(err => {
              console.log('DIDNT Work', err);
            });
        },
      },
    ]);
  };

  Vehicles = item => {
    const { token } = this.state;
    const { navigation } = this.props;
    const vehicle = item;
    const make = item.item.car_make;
    const model = item.item.car_model;
    const vehicleId = item.item.id;
    const year = item.item.car_year;
    console.log(vehicleId, 'v ID');
    return (
      <VehicleCard
        key={item.id}
        deleteVehicle={this.deleteVehicle}
        onPress={() => {
          console.log('clicked');
          navigation.navigate('RegisterVehicle', {
            vehicle,
            isEditing: true,
            isAdding: false,
            isCreating: false,
          });
        }}
        token={token}
        make={make}
        model={model}
        year={year}
        vehicleId={vehicleId}
      />
    );
  };
  renderVehicles = () => {
    const { vehicles } = this.state;
    console.log('vehicles from renderVehicles: ', vehicles);

    if (vehicles) {
      return (
        <View>
          <FlatList
            nestedScrollEnabled={true}
            data={this.state.vehicles}
            extraData={this.state}
            renderItem={item => this.Vehicles(item)}
            keyExtractor={item => `${item.id}`}
          />
        </View>
      );
    } else {
      console.log('DIDNT WORK in renderVehicles');
      return null;
    }
  };

  render() {
    const { token } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <BackHeader
          onPress={this.handleBackButton}
          title={'Settings'}
          disable={false}
        />
        <ScrollView nestedScrollEnabled={true}>
          <View>
            <View style={styles.section}>
              <View style={styles.settingSection} stickyHeaderIndices={[0]}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Driver Information</Text>
                  <View style={''}>
                    <TouchableOpacity
                      style={{ marginRight: 15, marginTop: 5 }}
                      onPress={this.toggleEdit}
                    >
                      <Pencil color="white" name="pencil" size={25}></Pencil>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <User name="user" size={30} color="#475c67" />
                    <Text>Name</Text>
                  </View>

                  <View style={styles.userFirstLastName}>
                    <View style={{ paddingRight: 8 }}>
                      <View>
                        <TextInput
                          style={styles.input}
                          placeholder="First"
                          value={this.state.firstName}
                          onChangeText={this.handleFirstName}
                          editable={this.state.editable}
                        />
                      </View>
                    </View>
                    <View>
                      <View>
                        <TextInput
                          style={styles.input}
                          placeholder="Last"
                          value={this.state.lastName}
                          onChangeText={this.handleLastName}
                          editable={this.state.editable}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <Email name="email-outline" size={30} color="#475c67" />
                    <Text>Email</Text>
                  </View>

                  <View>
                    <TextInput
                      keyboardType="email-address"
                      style={styles.input}
                      placeholder="Email"
                      value={this.state.email}
                      onChangeText={this.handleEmail}
                      editable={this.state.editable}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <Phone name="phone" size={30} color="#475c67" />
                    <Text>Phone</Text>
                  </View>

                  <View>
                    <TextInput
                      keyboardType="number-pad"
                      style={styles.input}
                      placeholder="999-999-9999"
                      dataDetectorTypes="phoneNumber"
                      value={this.state.phoneNumber}
                      onChangeText={this.handlePhoneNumber}
                      editable={this.state.editable}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <Radius
                      name="map-marker-radius"
                      size={30}
                      color="#475c67"
                    />

                    <Text>Radius</Text>
                  </View>

                  <View>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      placeholder="5"
                      value={this.state.radius}
                      onChangeText={this.handleRadius}
                      editable={this.state.editable}
                    />
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('ChangePassword')
                    }
                  >
                    <Text
                      style={{
                        paddingLeft: 5,
                        fontSize: 14,
                        color: '#475c67',
                      }}
                    >
                      Change Password
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Vehicles</Text>
                <View style={{ justifyContent: 'center', marginRight: 15 }}>
                  <AddButton
                    onPress={() => {
                      navigation.navigate('RegisterVehicle', {
                        isAdding: true,
                        isEditing: false,
                        isCreating: false,
                      });
                    }}
                    token={token}
                  />
                </View>
              </View>
              {this.state.vehicles && <View>{this.renderVehicles()}</View>}
            </View>

            <View style={[styles.section, { paddingBottom: 25 }]}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Locations</Text>
                <View style={{ justifyContent: 'center', marginRight: 15 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon color="#ffffff" name="map-marker" size={25} />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('LocationScreen', {
                          edit: false,
                        });
                      }}
                    >
                      <Icon color="#ffffff" name="plus-circle" size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {this.state.locations && (
                <LocationCard
                  locations={this.state.locations}
                  navigation={this.props.navigation}
                  handleDeleteLocation={this.handleDeleteLocation}
                />
              )}
            </View>

            <View style={styles.section}>
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View style={styles.rowContainer}>
                  <View>
                    <Text style={styles.inputTitle}>Active </Text>
                    <Text style={styles.notificationDescription}>
                      Turn off/on Active Status
                    </Text>
                  </View>
                  <View style={styles.switchStyle}>
                    <Switch
                      onValueChange={this.handleActive}
                      value={this.state.active}
                    />
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={this.navigateToCalendar}>
                  <View>
                    <Text>Availability</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <CalendarButton onPress={this.handleLogout} title="Log Out" />
        </View>
      </View>
    );
  }
}

export default Settings;

{
  /*  */
}
