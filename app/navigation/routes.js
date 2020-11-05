// import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  MainView,
  Login,
  AgendaView,
  AuthLoadingScreen,
  RideView,
  DriverScheduleView,
  DriverInformation,
  RequestedRidesDetails,
  Settings,
  Register,
  RegisterVehicle,
  RegisterAvailability,
  ForgotPassword,
  Welcome,
  ChangePassword,
} from '../views';
import LocationForm from '../components/Forms/LocationForm';
import AvailabilityForm from '../components/Forms/AvailabilityForm';
// import VehicleSettings from '../views/settings/VehicleSettings'

const MainViewStack = createStackNavigator(
  {
    MainView: {
      screen: MainView,
      navigationOptions: {
        header: () => null,
      },
    },
    AgendaView: {
      screen: AgendaView,
      navigationOptions: {
        header: () => null,
      },
    },
    RegisterAvailabilityForm: {
      screen: AvailabilityForm,
      navigationOptions: {
        header: () => null,
      },
    },
    RegisterAvailability: {
      screen: RegisterAvailability,
      navigationOptions: {
        header: () => null,
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        header: () => null,
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        header: () => null,
      },
    },
    RideView: {
      screen: RideView,
      navigationOptions: {
        header: () => null,
        gesturesEnabled: false,
      },
    },
    DriverScheduleView: {
      screen: DriverScheduleView,
      navigationOptions: {
        headerTitle: 'Scheduled Rides',
        headerStyle: {
          backgroundColor: '#1EAA70',
        },
        headerTintColor: '#fff',
      },
    },
    DriverInformation: {
      screen: DriverInformation,
      navigationOptions: {
        header: () => null,
      },
    },
    RequestedRidesDetails: {
      screen: RequestedRidesDetails,
      navigationOptions: {
        header: () => null,
      },
    },
    RegisterVehicle: {
      screen: RegisterVehicle,
      navigationOptions: {
        header: () => null,
      },
    },
    LocationScreen: {
      screen: LocationForm,
      navigationOptions: {
        header: () => null,
      },
    },
  },

  {
    headerMode: 'screen',
    headerBackTitleVisible: false,
    initialRouteKey: 'MainView',
    initialRouteName: 'MainView',
  }
);

const AppStack = createStackNavigator(
  { Home: MainViewStack },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  }
);

const RegisterStack = createStackNavigator(
  {
    RegisterUserInfo: {
      screen: Register,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: '#C5CCD6',
        headerLeft: null,
      },
    },
  },
  {
    headerBackTitleVisible: false,
  }
);

const AuthStack = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {
        header: () => null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: '#C5CCD6',
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: '#C5CCD6',
      },
    },
    Register: {
      screen: RegisterStack,
      navigationOptions: {
        header: () => null,
      },
    },
  },
  {
    headerBackTitleVisible: false,
  }
);

const AppStackNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default createAppContainer(AppStackNavigator);
