import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const { role, isFetching } = useAuth();

  if (isFetching) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!role && !isFetching) {
    return (
      <Redirect href="/(auths)/login" />
    );
  } else if (role === 'admin') {
    return <Redirect href="/(app)/(admin)" />;
  } else if (role === 'agent') {
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
