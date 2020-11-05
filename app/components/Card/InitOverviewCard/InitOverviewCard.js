import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import Badge from '../../Badge';
import Block from '../../Block';
import styles from './styles';
import { Icon } from 'react-native-elements';

// vars below will be used to open maps to check direction but does not start navigation
// const handlePickup = { latitude: pickupLat, longitude: pickupLong, query: 'Pickup Spot' };
// const openYosemite = createOpenLink(handlePickup);
const InitOverviewCard = ({
  onPress,
  pickupAddress,
  dropoffAddress,
  date,
  note,
  pickup_to_dropoff_distance,
  pickup_to_dropoff_time,
  default_to_pickup_distance,
}) => (
  <Block>
      
    <Block style={[styles.cardContainer, styles.shadow]}>

    <Text style={{textAlign:"center" , fontWeight:"bold"}}>Pickup/Dropoff</Text>
    <Block row space="between">
    <Badge
          color="rgba(30,170,112,0.2)"
          size={14}
          style={{ marginLeft:80}}
        >
          <Badge color="#1EAA70" size={8} />
        </Badge>
        <Badge
          color="rgba(30,170,112,0.2)"
          size={14}
          style={{ marginRight:90}}
        >
          <Badge color="#FF4957" size={8} />
        </Badge>
        </Block>
        
      <Block row space="between">
        <Text style={styles.date}>
          {moment.parseZone(date).format('MMM D')}
        </Text>
        {console.log('data from date raw: ', date)}
        {console.log(
          'data from date MMM D: ',
          moment.parseZone(date).format('MMM D')
        )}
       
        {console.log(
          'data from date hh:mm ',
          moment.parseZone(date).format('h:mm A')
        )}
        <Text style={styles.date}>{moment(date).format('h:mm A')}</Text>
      </Block>
      <Block row center>
      <Badge color="#1EAA70" size={5.5} style={{ marginLeft: 1}} />
      <Icon
                name="home"
                size={24}
                color="#475c67"
                type="materialIcons"
              />
        <TouchableOpacity>
          <Text numberOfLines={1} style={styles.location}>
            {pickupAddress}
          </Text>
        </TouchableOpacity>
      </Block>
     
     
            <Block row center style={{ marginLeft:6}} >
            
      <Icon 
                name="directions-car"
                size={24}
                color="#475c67"
                type="materialIcons"
                
               
              />
              </Block>
           
      <Block row center>
      <Badge color="#FF4957" size={5.5} style={{ marginLeft: 1}} />
      <Icon
                name="home"
                size={24}
                color="#475c67"
                type="materialIcons"
              />
        <TouchableOpacity>
          <Text numberOfLines={1} style={styles.location}>
            {dropoffAddress}
          </Text>
        </TouchableOpacity>
      </Block>
    </Block>

    <View style={[styles.cardContainer, styles.noteContainer, styles.shadow]}>
      <Block style={styles.noteCard}>
        {/* <ScrollView> */}
        <Block>
          <Text style={styles.title}>Reason For Ride</Text>
          <Text style={styles.noteText}>{note}</Text>
        </Block>
      </Block>
    </View>

    <View style={[styles.cardContainer, styles.noteContainer, styles.shadow]}>
      <Block style={styles.noteCard}>
        {/* <ScrollView> */}

        {default_to_pickup_distance >= 0 ? (
          <Block>
            <Text style={styles.title}>
              Approximate distances between points
            </Text>
            <Block row center style={{ paddingVertical: 4 }}>
              
              <Icon
                name="directions-car"
                size={24}
                color="#475c67"
                type="materialIcons"
              />
            </Block>
            <Block row center style={{ paddingVertical: 4 }}>
              <Badge color="#475c67" size={4} style={{ marginLeft: 4.5 }} />
            </Block>
            <Block row center>
              <Badge
                color="#475c67"
                size={4}
                style={{ marginLeft: 4.5, marginRight: 15 }}
              />
              <Text spacing={0.5} style={(styles.location, styles.distance)}>
                {default_to_pickup_distance} mile(s)
              </Text>
            </Block>
            <Block row center style={{ paddingVertical: 4 }}>
              <Badge color="#475c67" size={4} style={{ marginLeft: 4.5 }} />
            </Block>

            <Block row center>
              <Badge
                color="rgba(30,170,112,0.2)"
                size={14}
                style={{ marginRight: 8 }}
              >
                <Badge color="#1EAA70" size={8} />
              </Badge>
              <Text style={styles.location}>{pickupAddress}</Text>
            </Block>

            <Block row center style={{ paddingVertical: 4 }}>
              <Badge color="#475c67" size={4} style={{ marginLeft: 4.5 }} />
            </Block>
            <Block row center>
              <Badge
                color="#475c67"
                size={4}
                style={{ marginLeft: 4.5, marginRight: 15 }}
              />
              <Text spacing={0.5} style={(styles.location, styles.distance)}>
                {pickup_to_dropoff_distance} mile(s)
              </Text>
            </Block>
            <Block row center style={{ paddingVertical: 4 }}>
              <Badge color="#475c67" size={4} style={{ marginLeft: 4.5 }} />
            </Block>

            <Block row center>
              <Badge
                color="rgba(255, 71, 87, 0.2)"
                size={14}
                style={{ marginRight: 8 }}
              >
                <Badge color="#FF4957" size={8} />
              </Badge>
              <Text spacing={0.5} style={styles.location}>
                {dropoffAddress}
              </Text>
       
            </Block>
          </Block>
          
        ) : (
          <Text spacing={0.5} style={(styles.location, styles.distance)}>
          {pickup_to_dropoff_distance}Approximate distance will be displayed after accepting the ride
        </Text>
              
         
          
          
        )}
      </Block>
    </View>
  </Block>
);
export default InitOverviewCard;
