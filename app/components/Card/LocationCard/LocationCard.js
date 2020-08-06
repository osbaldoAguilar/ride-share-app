import React from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LocationCard = ({ locations, navigation, handleDeleteLocation }) => (
  <FlatList
    nestedScrollEnabled={true}
    data={locations}
    renderItem={item => {
      console.log('rendering flatlist', item);
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
          }}
        >
          <View
            style={{
              paddingTop: 10,
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontSize: 16, color: '#475c67' }}>
              {item.item.street}, {item.item.city}, {item.item.state},{' '}
              {item.item.zip}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
            }}
          >
            {item.item.default_location && (
              <View>
                <Icon color="#ff8262" name="check-bold" size={25}></Icon>
              </View>
            )}
            <View>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed edit');
                  navigation.navigate('LocationScreen', {
                    location: item.item,
                    edit: true,
                  });
                }}
              >
                <Icon color="#ff8262" name="pencil" size={25}></Icon>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => handleDeleteLocation(item.item.id)}
              >
                <Icon color="#ff8262" name="delete" size={25} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }}
    keyExtractor={item => item.id.toString()}
  />
);

export default LocationCard;
