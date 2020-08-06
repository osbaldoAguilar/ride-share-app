import { StyleSheet, Platform } from 'react-native';
import variables from '../../utils/variables';

export default StyleSheet.create({
  modalWrapper: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 15,
    elevation: Platform.OS === 'ios' ? 0 : 5,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: variables.sizes.margin,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonStyle: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(80, 69, 68, 0.28)',
  },
  modalText: {
    padding: 22,
    fontSize: 20,
    fontSize: 20,
    color: '#475c67',
    fontWeight: '700',
    display: 'flex',
  },
});
