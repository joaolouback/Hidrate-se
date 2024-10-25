import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import logo from '../assets/logo.png';  // Logo principal
import googleIcon from '../assets/google.png';  // Ícone do Google
import cloud from '../assets/cloud.png';  // Imagem da nuvem

export default function HydrateScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HIDRATE-SE!</Text>
      
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <TouchableOpacity 
        style={styles.signUpButton}
        onPress={() => navigation.navigate('Cadastro')}  // Navega para a página de criação de conta
      >
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={googleIcon}  // Carregando o ícone do Google diretamente
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Cadastrar com Google</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}> Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* Adicionando a nuvem no canto inferior esquerdo */}
      <Image source={cloud} style={styles.cloud} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0057A4', // Azul de fundo
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 50,
  },
  signUpButton: {
    backgroundColor: '#38B6FF', // Azul claro do botão
    padding: 15,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',  // Define o texto como negrito
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#60aef1', // Cor do link para login
    fontWeight: 'bold',
  },
  cloud: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 130,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
