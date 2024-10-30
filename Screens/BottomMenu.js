import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomMenu() {
  const navigation = useNavigation();

  return (
    <View style={styles.menu}>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('HomePage')}
      >
        <Image source={require('../assets/rotas.png')} style={styles.icon} />
        <Text>Rotas</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Feed')}
      >
        <Image source={require('../assets/feed.png')} style={styles.icon} />
        <Text>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Notification')}
      >
        <Image source={require('../assets/notificacoes.png')} style={styles.icon} />
        <Text>Notificações</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Feedback')}
      >
        <Image source={require('../assets/feedback.png')} style={styles.icon} />
        <Text>Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 10, // Ajuste para deixar o menu mais abaixo
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000', // ajuste na cor se desejar
    paddingVertical: 10, // Aumente a altura do menu
    marginBottom: 0,
  },
  menuButton: {
    alignItems: 'center',
  },
  icon: {
    width: 30, // Aumenta o tamanho dos ícones
    height: 30,
    marginBottom: 5,
  },
});
