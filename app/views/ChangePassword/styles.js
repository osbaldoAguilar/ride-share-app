import { StyleSheet } from 'react-native';
import variables from '../../utils/variables';
import { getBottomSpace } from '../../components/Header/StatusBar';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  sectionTitleContainer: {
    padding: 5,
    backgroundColor: '#ff8262',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    padding: 5,
    fontSize: 20,
    color: '#ffffff',
  },
  section: {
    padding: 5,
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  saeInputAlt: {
    marginHorizontal: 16,
    fontSize: 18,
    paddingLeft: 30,
    color: 'black',
    borderBottomColor: '#2F2F2F',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  saeInputAltWrong: {
    marginHorizontal: 16,
    fontSize: 18,
    paddingLeft: 30,
    color: 'red',
    borderBottomColor: '#2F2F2F',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  saeTextAlt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: variables.colors.black,
  },
  labelStyleAlt: {
    color: '#475c67',
    fontWeight: '700',
    paddingTop: 10,
    paddingLeft: 10,
    marginTop: 3,
    fontSize: 20,
  },
  passwordMessage: {
    color: '#C0C0C0',
    marginLeft: 15,
    marginRight: 15,
    paddingRight: 5,
    paddingLeft: 5,
  },
  errorMessage: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 10,
    fontSize: 18,
    color: '#D8000C',
  },
  footer: {
    marginTop: 20,
    paddingBottom: Platform.OS === 'ios' ? getBottomSpace() : 0,
    paddingRight: 10,
    paddingLeft: 10,
  },
});
