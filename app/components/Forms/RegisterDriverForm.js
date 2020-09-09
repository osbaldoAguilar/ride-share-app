import React from 'react';
import {
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import Block from '../Block';
import { CalendarButton } from '../Button';
import BottomModal from '../Modal/BottomModal';
import API from '../../api/api';
import AsyncStorage from '@react-native-community/async-storage';

class RegisterDriverForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: [],
      orgsNames: [],
      orgNum: 1,
      radius: 0,
      radiusOptions: ['10 Miles', '20 Miles', '30 Miles'],
      error: '',
      orgModal: false,
      radiusModal: false,
      selectedOrg: 'Select an organization',
      selectedRadius: 'Select a Mileage',
    };
  }

  componentDidMount() {
    //make sure there aren't any orgs in cache that will duplicate list
    this.setState({
      orgs: [],
    });
    //call getOrganizations fx which handles API call and retrieves list of orgs
    this.getOrganizations();
  }

  getOrganizations() {
    //using API file, getOrgs function, which fetches list of orgs
    API.getOrgs()
      .then(res => {
        console.log('orgs', res.organization);
        //store full list of all orgs in local state

        //store names for modal
        orgNames = [];
        res.organization.map(org => orgNames.push(org.name));

        this.setState({
          orgs: res.organization,
          orgsNames: orgNames,
        });
      })
      //if error performing API fetch for getting orgs, show error
      .catch(error => {
        console.log(
          'There has been a problem with your fetch operation: ' + error.message
        );
        throw error;
      });
  }

  handleUserSubmit = () => {
    let userData = {
      driver: {
        organization_id: parseInt(this.state.orgNum),
        email: this.state.email,
        password: this.state.password,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        phone: this.state.phone,
        is_active: true,
        radius: parseInt(this.state.radius),
        admin_sign_up: false,
      },
    };
    // console.log('isEditing', this.props.navigation.state.params.isEditing);
    //use API file, createDriver fx to send user inputs to database
    if (this.props.navigation.state.params === undefined) {
      API.createDriver(userData).then(res => {
        console.log('response from creating driver', res);

        if (res.error) {
          this.setState({ error: res.error });
        }
        this.autoLogin(userData);
      });
      //if error performing API fetch for posting driver, show err
    } else {
      console.log('params defined', this.props.navigation.state.params);
      AsyncStorage.getItem('token', (err, result) => {
        const obj = JSON.parse(result);
        const { token } = obj;

        API.updateSettingsDriver(userData, token)
          .then(result => {
            console.log('inside the APIupdate');
            this.autoLogin(userData);
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  };

  autoLogin = async userEntries => {
    console.log('testing in driver form: ', this.props.navigation);
    //use API file, login fx to create a token in order to add vehicle data to driver
    //login fx requries email and password as params
    API.login(
      userEntries.driver.email.toLowerCase(),
      userEntries.driver.password
    )
      //after sending email and pword, get auth_token
      .then(res => {
        const obj = {
          token: res.json.auth_token,
        };
        if (obj.token === undefined) {
          this.setState({
            errorMessage: 'Invalid username or password.',
          });
        } else {
          //if API call for autologin upon driver data submit successful, store auth_token in local storage
          AsyncStorage.setItem('token', JSON.stringify(obj));
          console.log('in autoLogin: ', AsyncStorage.getItem('token'));

          //redirect to vehicle registation
          this.props.navigation.navigate('MainView', {
            isRegistering: true,
          });
        }
      })
      .catch(err => {
        this.setState({
          errorMessage: 'Invalid username or password.',
        });
      });
  };

  getOrganizationId = name => {
    console.log('getOrg', this.state.orgs);
    const selectedOrg = this.state.orgs.find(org => org.name === name);
    console.log(selectedOrg);
    this.setState({ orgNum: selectedOrg.id });
  };

  toggleOrgModal = () => {
    this.setState({ orgModal: !this.state.orgModal });
  };
  toggleRadModal = () => {
    this.setState({ radiusModal: !this.state.radiusModal });
  };

  onSelectOrg = name => {
    this.setState({ selectedOrg: name, orgModal: !this.state.orgModal }, () =>
      this.getOrganizationId(name)
    );
  };

  onSelectRad = (data, index) => {
    this.setState({
      radius: (Number(index) + 1) * 10,
      radiusModal: !this.state.radiusModal,
      selectedRadius: data,
    });
  };

  render() {
    return (
      <ScrollView>
        <Block middle>
          <KeyboardAwareScrollView>
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Sign Up</Text>
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

              {/* Input for Volunteer Driver's Password */}
              <Text style={styles.labelStyleAlt}>Create a Password:</Text>
              <TextInput
                onChangeText={text => this.setState({ password: text })}
                placeholderTextColor="#C0C0C0"
                multiline={true}
                placeholder="8 characters long and must contain UPPER CASE, lower case, symbol (e.g !@#$%)"
                ref={input => {
                  this.password = input;
                }}
                returnKeyType={'done'}
                style={[styles.saeInputAlt]}
                inputStyle={styles.saeTextAlt}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <View>
              <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Volunteering for:</Text>
                </View>
              </View>

              <View>
                <TouchableOpacity onPress={this.toggleOrgModal}>
                  <Text style={[styles.sectionTitle, { color: '#475c67' }]}>
                    {this.state.selectedOrg}
                  </Text>
                </TouchableOpacity>
                <BottomModal
                  isVisible={this.state.orgModal}
                  onBackPress={this.toggleOrgModal}
                  onSelect={this.onSelectOrg}
                  data={this.state.orgsNames}
                />
              </View>
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
                    {this.state.selectedRadius}
                  </Text>
                </TouchableOpacity>
                <BottomModal
                  isVisible={this.state.radiusModal}
                  onBackPress={this.toggleRadModal}
                  onSelect={this.onSelectRad}
                  data={this.state.radiusOptions}
                />
              </View>
            </View>
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
                  this.handleUserSubmit
                }
              />
            </View>
          </KeyboardAwareScrollView>
        </Block>
      </ScrollView>
    );
  }
}

export default RegisterDriverForm;
