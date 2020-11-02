import { StyleSheet, Stylesheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcf6',
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? getBottomSpace() - 15 : 0,
    backgroundColor: '#fcfcf6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
});
