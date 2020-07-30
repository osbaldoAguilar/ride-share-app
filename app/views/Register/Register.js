import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import Container from '../../components/Container';
import BackHeader from '../../components/Header/BackHeader';
import { RegisterDriverForm } from '../../components/Forms';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
  }
  handleBackButton = () => {
    this.props.navigation.navigate('Welcome');
  };

  render() {
    const { navigation } = this.props;
    const subTitle = "Let's start by creating an account";

    return (
      <Container>
        <BackHeader
          onPress={this.handleBackButton}
          title={'Driver Info'}
          disable={false}
        />

        <RegisterDriverForm subTitle={subTitle} navigation={navigation} />
      </Container>
    );
  }
}

export default Register;
