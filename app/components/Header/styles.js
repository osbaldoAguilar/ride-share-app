import { Platform, StyleSheet } from 'react-native';
import { getStatusBarHeight } from './StatusBar';

export default StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: (Platform.OS === 'ios' ? 80 : 56) + getStatusBarHeight(),
  },
  close: {
    paddingTop: 20,
  },
  centerContainer: {
    flex: 3,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    alignItems: 'center',
    backgroundColor: '#1EAA70',
    height: (Platform.OS === 'ios' ? 80 : 56) + getStatusBarHeight(),
    marginTop: Platform.OS == 'android' ? 0 : 0,
  },

  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#ffffff',
  },
});
