import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './styles';
import Container from '../../components/Container';
import {RegisterVehicleForm} from '../../components/Forms';
import API from '../../api/api';

class RegisterVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      carData: {},
      token: '',
    };
    this.inputs = {};
  }

  handleSubmit = () => {
    alert('Thank you for registering! You will receive an email regarding next steps within _ business days.');
    this.props.navigation.navigate('Welcome');
  };

  handleChange = (text, name) => {
    this.setState({[name]: text});
  };

  handleSubmitEditing = id => {
    this.inputs[id].focus();
  };

  handleInnerRef = (input, id) => {
    this.inputs[id] = input;
  };

  render() {
    return (
      <Container>
        <View style={[styles.signup, styles.headerPadding]}>
          <RegisterVehicleForm
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            innerRef={this.handleInnerRef}
            handleSubmitEditing={this.handleSubmitEditing}
          />
        </View>
      </Container>
    );
  }
}

export default RegisterVehicle;
