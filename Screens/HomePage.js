import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RouteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo à página Route!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F51A4',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
