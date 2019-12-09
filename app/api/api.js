/* eslint-disable prettier/prettier */
import {
  LOGIN,
  RIDES,
  //? SCHEDULEDRIDES,
  //? APPROVEDRIDES,
  SETTINGS,
  LOGOUT,
  RIDER,
  AVAILABILITIES,
  // ?driverRides,
  REGISTER,
  VEHICLES,
} from '../utils/urls';
import apiWrapper from './apiWrapper';
//TODO get the ride id not the rider id from the API to accept the correct response

export default {
  // ex. of how the post and etc. requests can be written
  login(email, password) {
    console.log("data within api login: ", email)
    console.log("data within api login: ", password)
    return apiWrapper({
      path: LOGIN,
      body: { email, password },
      method: 'POST',
    }).then(res => { return res.json() });
  },

  getRides(token) {
    return apiWrapper({
      path: RIDES,
      // params: driverRides,
      token,
    }).then(res => res.json());
  },
  //////////////////////////////////
  getRider(id, token) {
    return apiWrapper({
      path: RIDER,
      params: `/${id}`,
<<<<<<< HEAD
=======
      token,
    }).then(res => res.json());
  },

  getDriver(token){
    return apiWrapper({
      path: REGISTER,
      //params:
      method: 'GET',
>>>>>>> fixed warning
      token,
    }).then(res => res.json());
  },
  //////////////////////////////////
  acceptRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/accept`,
      method: 'POST',
      token,
    }).then(res => res.json());
  },
  completeRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/complete`,
      method: 'POST',
      token,
    }).then(res => res.json());
  },
<<<<<<< HEAD

=======
  pickUpRide(id,token){
    return apiWrapper({
      path: RIDES,
      params: `/${id}/picking-up`,
      method: 'POST',
      token,
    }).then(res => res.json());
  },
  dropOffRide(id,token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/dropping-off`,
      method: 'POST',
      token,
    }).then(res => res.json());
  },
>>>>>>> fixed warning
  cancelRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/cancel`,
      method: 'POST',
      token,
    }).then(res => res.json());
  },

  getAvailabilities() {
    // change this with the api wrapper
    return fetch(AVAILABILITIES, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        token: '',
      },
    });
  },

  logout(token) {
    return apiWrapper({
      path: LOGOUT,
      method: 'POST',
      headers: { token },
    }).then(res => res.json());
  },
  getSettingInfo(token) {
    return apiWrapper({
      path: SETTINGS,
      headers: { token },
    }).then(res => res.json());
  },
  updateSettingsInfo(data, token) {
    return apiWrapper({
      path: SETTINGS,
      headers: { token },
      body: data,
      method: 'PUT',
    }).then(res => res.json());
  },

  getOrgs() {
    return fetch('https://ctd-rideshare.herokuapp.com/api/v1/organizations', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).then(res => res.json());
  },

<<<<<<< HEAD
  createDriver(data) {
    const driver = {
      "driver": {
        "organization_id": data.driver.organization_id,
=======
  createDriver(data, radius, orgID) {
    const driver = {
      "driver": {
        "organization_id": parseInt(orgID),
>>>>>>> fixed warning
        "email": data.driver.email,
        "password": data.driver.password,
        "first_name": data.driver.first_name,
        "last_name": data.driver.last_name,
        "phone": data.driver.phone,
        "is_active": true,
<<<<<<< HEAD
        "radius": data.driver.radius,
=======
        "radius": parseInt(radius),
>>>>>>> fixed warning
      }
    }

    console.log("data to API: ", driver)
    return apiWrapper({
      path: REGISTER,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: driver,
    })
<<<<<<< HEAD
      // .then(res => res.json())
=======
      .then(res => res.json())
>>>>>>> fixed warning
  },

  createVehicle(vehicleData, token) {
    const vehicle = {
      "vehicle": {
        "car_make": vehicleData.vehicle.car_make,
        "car_model": vehicleData.vehicle.car_model,
        "car_year": parseInt(vehicleData.vehicle.car_year),
        "car_color": vehicleData.vehicle.car_color,
        "car_plate": vehicleData.vehicle.car_plate,
        "seat_belt_num": parseInt(vehicleData.vehicle.seat_belt_num),
        "insurance_provider": vehicleData.vehicle.insurance_provider,
        "insurance_start": vehicleData.vehicle.insurance_start,
        "insurance_stop": vehicleData.vehicle.insurance_stop,
      }
    }
    console.log("data to carReg API: ", vehicle)
    console.log("token to carReg API: ", token)
    return apiWrapper({
      path: VEHICLES,
      token,
      body: vehicle,
      method: 'POST',
    }).then(res => console.log(res.json()));
  },

  createAvailability(availData, recurring, endDate, token) {
    console.log("before parsing: ", recurring)
    console.log("before parsing it's a :", typeof recurring)
    let recurringParsed = JSON.parse(recurring)
    console.log("after parse: ", recurringParsed)
    console.log("after parsing it's a: ", typeof recurringParsed)

    if (recurring === 'true') {
      let startDateArray = availData.start_time.split(" ")
      let startDate = startDateArray[0]

      const availability = {
        "start_date": startDate,
        "end_date": endDate,
        "start_time": availData.start_time,
        "end_time": availData.end_time,
        "is_recurring": recurringParsed,
        "location_id": availData.location_id,
      }

      console.log("data to availReg API: ", availability)
      console.log("token to availReg API: ", token)
      return apiWrapper({
        path: AVAILABILITIES,
        token,
        body: availability,
        method: 'POST',
      }).then(res => console.log(res.json()));
    } else {
      const availability = {
        "start_time": availData.start_time,
        "end_time": availData.end_time,
        "is_recurring": recurringParsed,
        "location_id": availData.location_id,
      }

      return apiWrapper({
        path: AVAILABILITIES,
        token,
        body: availability,
        method: 'POST',
      }).then(res => console.log(res.json()));
    }
  }
};
