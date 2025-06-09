import { View, Text, StyleSheet } from 'react-native';

const Register = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Register page</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24
  }
});

export default Register;
