import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomMenu() {
  const navigation = useNavigation();

  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('HomePage')}>
        <Image source={require('../assets/rotas.png')} style={styles.icon} />
        <Text style={styles.text}>Rotas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Feed')}>
        <Image source={require('../assets/feed.png')} style={styles.icon} />
        <Text style={styles.text}>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Notification')}>
        <Image source={require('../assets/notificacoes.png')} style={styles.icon} />
        <Text style={styles.text}>Notificações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Feedback')}>
        <Image source={require('../assets/feedback.png')} style={styles.icon} />
        <Text style={styles.text}>Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  menuButton: {
    alignItems: 'center',
  },
  icon: {
    width: 35,
    height: 35,
    marginBottom: 3,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
