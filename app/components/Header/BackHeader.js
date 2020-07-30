import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

class BackHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { disable } = this.props;
    console.log('header', disable);
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.leftContainer, { paddingLeft: 10 }]}>
          {disable ? null : (
            <TouchableOpacity
              onPress={this.props.onPress}
              style={{ width: 15 }}
            >
              <Icon name="ios-arrow-back" size={30} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.headerText}>{this.props.title}</Text>
        </View>
        <View style={styles.rightContainer} />
      </View>
    );
  }
}

export default BackHeader;
