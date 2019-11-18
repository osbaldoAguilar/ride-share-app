import React from 'react';
import {Text, ScrollView, Picker} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import Block from '../Block';
import {CalendarButton} from '../Button';
import {Sae} from '../TextInputs';
import API from '../../api/api';

class RegisterDriverForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      orgs: [],
    };
  };

  componentDidMount() {
    //make sure there aren't any orgs in cache that will duplicate list
    this.setState({
      orgs: [],
    })
    //call getOrganizations fx which handles API call and retrieves list of orgs
    this.getOrganizations();
  }

  getOrganizations() {
    //using API file, getOrgs function, which fetches list of orgs
    API.getOrgs()
      .then(res => {
        //create an empty array that will hold all org names
        let orgArray = [];
        //loop through orgs list and push each org name into orgArray
        for (var i=0; i < res.organization.length; i++) {
          // console.warn("an org is: ", res.organization[i].id, res.organization[i].name);
          orgArray.push(res.organization[i].name);
        }
        //store full list of all orgs in local state
        this.setState({
          orgs: orgArray
        })
      })
      //if error performing API fetch for getting orgs, show error
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;
      })
  };

  testingSomething = (userEntries) => {
      console.log("data before API call:", userEntries);
      API.createDriver(userEntries)
      // .then(nav.navigate('RegisterVehicle'))
      //if error performing API fetch for posting driver, show error
      .catch(error => {
        console.warn('There has been a problem with your operation: ' + error.message);
        throw error;
      });
  }
  
  render() {
    //take array of org names list retrieved from API call on did mount then 
    //map through each org name in list and create a Picker Item, let org
    //name be both label and value of each item.
    const orgsList = this.state.orgs.map((eachOrg) =>       
        <Picker.Item 
          label={eachOrg} 
          value={eachOrg} 
          ref={input => this.props.innerRef(input, 'OrgName')}
        />
    );

    return (
      <ScrollView>
        <Block middle>
          <KeyboardAwareScrollView>
            <Block style={styles.scrollContainer}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subTitle}>{this.props.subTitle}</Text>
            </Block>
            
            {/* Input for Volunteer Driver's First Name */}
            <Sae
              label="First Name"
              labelStyle={styles.labelStyle}
              inputPadding={16}
              labelHeight={24}
              // active border height
              borderHeight={2}
              borderColor="#475c67"
              // TextInput props
              returnKeyType="next"
              style={[styles.saeInput]}
              inputStyle={styles.saeText}
              /* As user types, use the handleChange fx in Register Component to update state with what is being typed, second param is the object key, first param is the value */
              onChangeText={text => this.props.handleChange(text, 'first_name')}
              /* Use the handleInnerRef fx in Register Component to use the next button on keyboard to advance to next field */
              ref={input => this.props.innerRef(input, 'FirstName')}
              /* Use the handleSubmitEditing fx in Register Component to change focus to next field and commit what was typed in current field to local state in Register Component */
              onSubmitEditing={() => this.props.handleSubmitEditing('LastName')}
              blurOnSubmit={false}
            />
            <Sae
              label="Last Name"
              labelStyle={styles.labelStyle}
              inputPadding={16}
              labelHeight={24}
              // active border height
              borderHeight={2}
              borderColor="#475c67"
              // TextInput props
              returnKeyType="next"
              style={[styles.saeInput]}
              inputStyle={styles.saeText}
              onChangeText={text => this.props.handleChange(text, 'last_name')}
              ref={input => this.props.innerRef(input, 'LastName')}
              onSubmitEditing={() => this.props.handleSubmitEditing('PhoneNumber')}
              blurOnSubmit={false}
            />
            <Sae
              label="Phone Number"
              labelStyle={styles.labelStyle}
              inputPadding={16}
              labelHeight={24}
              // active border height
              borderHeight={2}
              borderColor="#475c67"
              // TextInput props
              style={[styles.saeInput]}
              inputStyle={styles.saeText}
              keyboardType="phone-pad"
              returnKeyType="next"
              onChangeText={text => this.props.handleChange(text, 'phone')}
              ref={input => this.props.innerRef(input, 'PhoneNumber')}
              onSubmitEditing={() => this.props.handleSubmitEditing('EmailAddress')}
              blurOnSubmit={false}
            />
            <Sae
              label="Email Address"
              labelStyle={styles.labelStyle}
              inputPadding={16}
              labelHeight={24}
              // active border height
              borderHeight={2}
              borderColor="#475c67"
              // TextInput props
              style={[styles.saeInput]}
              inputStyle={styles.saeText}
              email
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onChangeText={text => this.props.handleChange(text, 'email')}
              ref={input => this.props.innerRef(input, 'EmailAddress')}
              onSubmitEditing={() => this.props.handleSubmitEditing('Password')}
              blurOnSubmit={false}
            />
            <Sae
              label="Password"
              labelStyle={styles.labelStyle}
              inputPadding={16}
              labelHeight={24}
              // active border height
              borderHeight={2}
              borderColor="#475c67"
              // TextInput props
              style={[styles.saeInput]}
              inputStyle={styles.saeText}
              secureTextEntry
              returnKeyType="next"
              autoCapitalize="none"
              onChangeText={text => this.props.handleChange(text, 'password')}
              ref={input => this.props.innerRef(input, 'Password')}
              onSubmitEditing={() => this.props.handleSubmitEditing('OrgName')}
              blurOnSubmit={false}
            />

            <Text style={{marginTop: 20, marginHorizontal: 16, fontSize: 18,}}>Volunteering for:</Text>
            <Picker
              label="OrgName"
              // style={}
              inputPadding={16}
              labelHeight={24}
              borderHeight={2}
              borderColor="#475c67"
              blurOnSubmit={false}
              selectedValue={this.state.organization_id}
              onValueChange={(itemValue, itemIndex) =>
                  this.setState({organization_id: itemValue})
              }
            >
              {orgsList}
            </Picker>

            <Text style={{marginTop: 20, marginHorizontal: 16, fontSize: 18,}}>Distance available to drive:</Text>
            <Picker
              label="Radius"
              // style={}
              inputPadding={16}
              labelHeight={24}
              borderHeight={2}
              borderColor="#475c67"
              blurOnSubmit={false}
              selectedValue={this.state.radius}
              onValueChange={(itemValue) =>
                  this.setState({radius: itemValue})
              }
            >
              <Picker.Item label="10 miles" value="10"/>
              <Picker.Item label="25 miles" value="25"/>
              <Picker.Item label="50 miles" value="50"/>
            </Picker>

            <Block style={styles.footer}>
              <CalendarButton
                title="Continue"
                onPress={() => 
                  this.testingSomething(this.props.data, this.props.navigation)}
                  // API.createDriver(this.props.data)}
                  // this.props.handleUserEntries()}
                  // this.props.navigation.navigate('RegisterVehicle')}
              />
            </Block>
          </KeyboardAwareScrollView>
        </Block>
      </ScrollView>
    )
  };
};

export default RegisterDriverForm;

{/* <Sae
              label="City"
              labelStyle={styles.labelStyle}
              inputPadding={16}
              labelHeight={24}
              // active border height
              borderHeight={2}
              borderColor="#475c67"
              // TextInput props
              style={[styles.saeInput]}
              inputStyle={styles.saeText}
              returnKeyType="go"
              onChangeText={text => this.props.handleChange(text, 'city')}
              ref={input => this.props.innerRef(input, 'City')}
              blurOnSubmit
            /> */}