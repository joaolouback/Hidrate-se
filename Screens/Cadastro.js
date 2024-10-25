import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/Firebase'; // Importa a autenticação e o Firestore do Firebase
import { doc, setDoc } from 'firebase/firestore'; // Firestore para armazenar dados adicionais
import cloud from '../assets/cloud.png'; // Imagem da nuvem

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setMessage('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem!');
      return;
    }

    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Armazena dados adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nome: name,
        email: email,
        telefone: phone,
      });

      setMessage('Usuário cadastrado com sucesso!');
      setTimeout(() => {
        setMessage('');
        navigation.replace('Login'); // Redireciona para a tela de login após cadastro
      }, 2000);
    } catch (error) {
      console.error('Erro no cadastro:', error); // Log de erro para diagnóstico
      setMessage('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          style={styles.innerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.title}>Cadastre-se no</Text>
          <Text style={styles.subTitle}>HIDRATE-SE!</Text>

          {/* Inputs de cadastro */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#4682B4"
            />
          </View>

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
            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#4682B4"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#4682B4"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirme a Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#4682B4"
            />
          </View>

          {/* Mensagem de erro ou sucesso */}
          {message ? <Text style={message === 'Usuário cadastrado com sucesso!' ? styles.successMessage : styles.errorMessage}>{message}</Text> : null}

          {/* Botão de cadastro */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>

          {/* Botão de login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já possui uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Nuvem fixa no canto inferior esquerdo */}
      <Image source={cloud} style={styles.cloud} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F51A4',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
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
    width: '100%',  // O input se ajusta à largura da tela
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  errorMessage: {
    color: '#FF6347',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',  // O botão se ajusta à largura da tela
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#1E90FF',
    fontWeight: '700',
    fontSize: 16,
  },
  cloud: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 110,
    resizeMode: 'contain',
    zIndex: -1,
  },
});
