import { useAuthStore } from '@/store/auth';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

const HomeScreen = () => {
  const { token } = useAuthStore();

  if (!token) {
    return (
      <Redirect href="/(auths)/login" />
    );
  } else if (token.role === 'admin') {
    return <Redirect href="/(app)/(admin)" />;
  } else if (token.role === 'agent') {
    return <Redirect href="/(app)/(agent)" />;
  } else {
    return <Redirect href="/(app)/(client)" />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 20,
    color: '#333'
  }
});

export default HomeScreen;
