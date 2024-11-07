import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomMenu() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('HomePage')}>
        <Image
          source={
            route.name === 'HomePage'
              ? require('../assets/rotasBlue.png') // Imagem ativa para HomePage
              : require('../assets/rotas.png') // Imagem padrão para HomePage
          }
          style={styles.icon}
        />
        <Text style={[styles.text, route.name === 'HomePage' && styles.activeText]}>Rotas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Feed')}>
        <Image
          source={
            route.name === 'Feed'
              ? require('../assets/feedBlue.png') // Imagem ativa para Feed
              : require('../assets/feed.png') // Imagem padrão para Feed
          }
          style={styles.icon}
        />
        <Text style={[styles.text, route.name === 'Feed' && styles.activeText]}>Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Notification')}>
        <Image
          source={
            route.name === 'Notification'
              ? require('../assets/notificacoesBlue.png') // Imagem ativa para Notificações
              : require('../assets/notificacoes.png') // Imagem padrão para Notificações
          }
          style={styles.icon}
        />
        <Text style={[styles.text, route.name === 'Notification' && styles.activeText]}>Notificações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Feedback')}>
        <Image
          source={
            route.name === 'Feedback'
              ? require('../assets/feedbackBlue.png') // Imagem ativa para Feedback
              : require('../assets/feedback.png') // Imagem padrão para Feedback
          }
          style={styles.icon}
        />
        <Text style={[styles.text, route.name === 'Feedback' && styles.activeText]}>Feedback</Text>
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
  activeText: {
    color: '#0F51A4', // Cor azul para o texto ativo
  },
});
