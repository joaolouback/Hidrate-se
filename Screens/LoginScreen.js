import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import googleIcon from '../assets/google.png';  // Ícone do Google
import cloudRight from '../assets/cloudRight.png';  // Imagem da nuvem à direita
import { signInWithEmailAndPassword } from 'firebase/auth'; // Função de login do Firebase
import { auth } from '../services/Firebase'; // Importa a autenticação do Firebase

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setMessage('Preencha todos os campos!');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Armazena o UID no AsyncStorage (ou outra informação relevante)
      await AsyncStorage.setItem('userToken', user.uid);

      setMessage('Login realizado com sucesso!');
      setTimeout(() => {
        setMessage('');
        navigation.replace('HomePage'); // Nome correto da tela que está sendo definida no App.js
      }, 2000);
    } catch (error) {
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Faça login em</Text>
        <Text style={styles.subTitle}>HIDRATE-SE!</Text>

        {/* Botão de login com Google */}
        <TouchableOpacity style={styles.googleButton}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Entrar com Google</Text>
        </TouchableOpacity>

        {/* Divisores com texto */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Ou entre com seu email</Text>
          <View style={styles.divider} />
        </View>

        {/* Inputs de email e senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#4682B4"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="#4682B4"
          />
        </View>

        {/* Botão de login */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Seção "Don't have an account?" com o link "Sign up" em azul */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.signUpLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        {/* Mensagem de erro ou sucesso */}
        {message ? <Text style={message === 'Login realizado com sucesso!' ? styles.successMessage : styles.errorMessage}>{message}</Text> : null}
      </KeyboardAvoidingView>

      {/* Nuvem fixa no canto inferior direito */}
      <Image source={cloudRight} style={styles.cloud} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F51A4', // Azul de fundo
    justifyContent: 'flex-start',  // Alinha os itens no topo
  },
  innerContainer: {
    justifyContent: 'center',
    padding: 20,
    paddingTop: 75,  // Adiciona espaçamento do topo
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,  // Adiciona espaço entre o título e subtítulo
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,  // Aumenta o espaço abaixo do subtítulo
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#4682B4',
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpLink: {
    color: '#1E90FF', // Cor azul para o link "Cadastre-se"
    fontSize: 16,
    fontWeight: '700',
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  errorMessage: {
    color: '#FF6347',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  cloud: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 130,
    height: 170,
    resizeMode: 'contain',
    zIndex: -1,  // Mantém a nuvem abaixo dos outros componentes
  },
});
