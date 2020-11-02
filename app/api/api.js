import {
  LOGIN,
  RIDES,
  SETTINGS,
  LOGOUT,
  RIDER,
  AVAILABILITIES,
  REGISTER,
  VEHICLE,
  VEHICLES,
  ORGANIZATIONS,
  LOCATIONS,
  DRIVER,
  CHANGEPASSWORD,
} from '../utils/urls';
import moment from 'moment';
import apiWrapper from './apiWrapper';
//TODO get the ride id not the rider id from the API to accept the correct response
export default {
  // ex. of how the post and etc. requests can be written
  login(email, password) {
    console.log('data within api login: ', email);
    console.log('data within api login: ', password);
    return apiWrapper({
      path: LOGIN,
      body: { email, password },
      method: 'POST',
    });
  },
  passwordReset(email) {
    console.log('data wihthin passwordReset', email);
    return apiWrapper({
      path: REGISTER,
      params: 'password_reset',
      body: { email },
      method: 'POST',
    });
  },
  passwordChange(token) {
    //reset password when user is created by admin
    console.log('data wihthin passwordReset', Token);
    return apiWrapper({
      path: DRIVER,
      params: `${PASSWORDCHANGE}`,
      method: 'PUT',
      token,
    });
  },
  changePassword(token, password, newPassword, confirmPassword) {
    console.log('called change password api', token);
    const userData = {
      driver: {
        old_password: password,
        new_password: newPassword,
        password_confirmation: confirmPassword,
      },
    };
    console.log('data', userData);
    return apiWrapper({
      path: DRIVER,
      params: `${CHANGEPASSWORD}`,
      body: userData,
      method: 'POST',
      token,
    });
  },
  getRides(token) {
    return apiWrapper({
      path: RIDES,
      token,
    });
  },
  getRide(token, id) {
    return apiWrapper({
      path: RIDES,
      token,
      params: `/${id}`,
      method: 'GET',
    });
  },
  getRider(id, token) {
    return apiWrapper({
      path: RIDER,
      params: `/${id}`,
      token,
    });
  },
  getDriver(token) {
    return apiWrapper({
      path: REGISTER,
      method: 'GET',
      token,
    });
  },

  acceptRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/accept`,
      method: 'POST',
      token,
    });
  },
  completeRide(id, token) {
    console.log('id', id);
    console.log('token', token);
    return apiWrapper({
      path: RIDES,
      params: `${id}/complete`,
      method: 'POST',
      token,
    });
  },
  pickUpRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/picking-up`,
      method: 'POST',
      token,
    });
  },
  dropOffRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/dropping-off`,
      method: 'POST',
      token,
    });
  },
  waitingForRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/waiting`,
      method: 'POST',
      token,
    });
  },
  returnPickUp(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/return-picking-up`,
      method: 'POST',
      token,
    });
  },
  returnDropOff(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/return-dropping-off`,
      method: 'POST',
      token,
    });
  },
  cancelRide(id, token) {
    return apiWrapper({
      path: RIDES,
      params: `/${id}/cancel`,
      method: 'POST',
      token,
    });
  },
  getAvailabilities(token) {
    console.log('token in api', token);
    return apiWrapper({
      path: AVAILABILITIES,
      method: 'GET',
      token,
    });
  },
  deleteAvailability(token, eventID) {
    return apiWrapper({
      path: AVAILABILITIES,
      params: eventID,
      method: 'DELETE',
      token,
    });
  },
  editAvailability(token, userEntries, recurring) {
    console.log('recurring parsed', recurring);
    console.log('editAvail', userEntries);
    if (recurring) {
      console.warn('in if', userEntries);
      const availability = {
        start_date: userEntries.start_date,
        end_date: userEntries.end_date,
        start_time: userEntries.start_time,
        end_time: userEntries.end_time,
        is_recurring: recurring,
        location_id: userEntries.location_id,
      };
      return apiWrapper({
        path: AVAILABILITIES,
        token,
        body: availability,
        method: 'PUT',
        params: `/${userEntries.id}`,
      });
    } else {
      console.warn('in else');
      let avail = userEntries;
      avail = {
        start_time: avail.start_time,
        end_time: avail.end_time,
        is_recurring: recurring,
        location_id: userEntries.location_id,
      };
      return apiWrapper({
        path: AVAILABILITIES,
        token,
        body: avail,
        method: 'PUT',
        params: `/${userEntries.id}`,
      });
    }
  },
  logout(token) {
    return apiWrapper({
      path: LOGOUT,
      method: 'POST',
      headers: { token },
    });
  },
  getSettingInfo(token) {
    return apiWrapper({
      path: SETTINGS,
      headers: { token },
    });
  },

  updateDriverActiveStatus(active, token) {
    console.log('active', active);
    const driverData = {
      driver: {
        is_active: active,
      },
    };

    console.log('is actice', driverData);

    return apiWrapper({
      path: SETTINGS,
      headers: { token },
      body: driverData,
      method: 'PUT',
    });
  },

  updateSettingsDriver(data, token) {
    const driverData = {
      driver: {
        organization_id: data.organization_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        radius: data.radius,
        is_active: data.is_active,
      },
    };
    return apiWrapper({
      path: SETTINGS,
      headers: { token },
      body: driverData,
      method: 'PUT',
    });
  },

  updateSettingsVehicle(id, vehicleData, token) {
    const vehicle = {
      vehicle: {
        id: id,
        car_make: vehicleData.vehicle.car_make,
        car_model: vehicleData.vehicle.car_model,
        car_year: vehicleData.vehicle.car_year,
        car_color: vehicleData.vehicle.car_color,
        car_plate: vehicleData.vehicle.car_plate,
        seat_belt_num: vehicleData.vehicle.seat_belt_num,
        insurance_provider: vehicleData.vehicle.insurance_provider,
        insurance_start: vehicleData.vehicle.insurance_start,
        insurance_stop: vehicleData.vehicle.insurance_stop,
      },
    };
    console.log('data to carReg API: ', vehicle);
    console.log('token to carReg API: ', token);
    return apiWrapper({
      path: VEHICLES,
      headers: { token },
      // params: `?id=${id}`,
      body: vehicle,
      method: 'PUT',
    });
  },

  getVehicle(token) {
    return apiWrapper({
      path: VEHICLES,
      method: 'GET',
      // params: `?id=${id}`,
      headers: { token },
    });
  },
  deleteVehicle(id, token) {
    return apiWrapper({
      path: VEHICLES,
      method: 'DELETE',
      params: `?id=${id}`,
      headers: { token },
    });
  },
  getOrgs() {
    return apiWrapper({
      path: ORGANIZATIONS,
      method: 'GET',
    });
  },
  createDriver(data) {
    console.log('data', data);
    const driver = {
      driver: {
        organization_id: data.driver.organization_id,
        email: data.driver.email,
        password: data.driver.password,
        first_name: data.driver.first_name,
        last_name: data.driver.last_name,
        phone: data.driver.phone,
        is_active: true,
        radius: data.driver.radius,
        admin_sign_up: data.driver.admin_sign_up,
      },
    };
    console.log('data to API: ', driver);
    return apiWrapper({
      path: REGISTER,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: driver,
    });
  },
  createVehicle(vehicleData, token) {
    console.log('vehicle token', token);
    const vehicle = {
      vehicle: {
        car_make: vehicleData.vehicle.car_make,
        car_model: vehicleData.vehicle.car_model,
        car_year: parseInt(vehicleData.vehicle.car_year),
        car_color: vehicleData.vehicle.car_color,
        car_plate: vehicleData.vehicle.car_plate,
        seat_belt_num: parseInt(vehicleData.vehicle.seat_belt_num),
        insurance_provider: vehicleData.vehicle.insurance_provider,
        insurance_start: vehicleData.vehicle.insurance_start,
        insurance_stop: vehicleData.vehicle.insurance_stop,
      },
    };
    console.log('data to carReg API: ', vehicle);
    console.log('token to carReg API: ', token);
    return apiWrapper({
      path: VEHICLES,
      token,
      body: vehicle,
      method: 'POST',
    });
  },
  createAvailability(availData, recurring, token) {
    if (recurring) {
      const availability = {
        start_date: availData.start_date,
        end_date: availData.end_date,
        start_time: availData.start_time,
        end_time: availData.end_time,
        is_recurring: recurring,
        location_id: availData.location_id,
      };
      console.log('data to availReg API: ', availability);
      console.log('token to availReg API: ', token);
      return apiWrapper({
        path: AVAILABILITIES,
        token,
        body: availability,
        method: 'POST',
      });
    } else {
      const availability = {
        start_time: availData.start_time,
        end_time: availData.end_time,
        is_recurring: recurring,
        location_id: availData.location_id,
      };

      console.log('api data', availability);
      return apiWrapper({
        path: AVAILABILITIES,
        token,
        body: availability,
        method: 'POST',
      });
    }
  },
  getLocations(token) {
    return apiWrapper({
      path: LOCATIONS,
      token,
      method: 'GET',
    });
  },
  createLocation(locationData, setDefault, token) {
    console.log('lcoatino data', locationData);
    console.log('default', setDefault);
    const location = {
      location: {
        street: locationData.location.street,
        city: locationData.location.city,
        state: locationData.location.state,
        zip: locationData.location.zip,
        notes: locationData.location.notes ? locationData.location.notes : null,
      },
      default_location: setDefault,
    };

    return apiWrapper({
      path: LOCATIONS,
      token,
      body: location,
      method: 'POST',
    });
  },
  editLocation(locationData, id, setDefault, token) {
    const location = {
      location: {
        street: locationData.location.street,
        city: locationData.location.city,
        state: locationData.location.state,
        zip: locationData.location.zip,
        notes: locationData.location.notes ? locationData.location.notes : null,
      },
      default_location: setDefault,
    };
    return apiWrapper({
      path: LOCATIONS,
      token,
      body: location,
      params: `${id}`,
      method: 'PUT',
    });
  },
  deleteLocation(id, token) {
    return apiWrapper({
      path: LOCATIONS,
      token,
      params: `${id}`,
      method: 'DELETE',
    });
  },
};
