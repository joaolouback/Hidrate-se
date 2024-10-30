import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomMenu from './BottomMenu';

export default function Feedback() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo à Página de Feedback</Text>
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
