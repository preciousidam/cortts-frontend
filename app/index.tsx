import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Index: React.FC = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text>Hello, World!</Text>
    </View>
  );
}

export default Index;

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}