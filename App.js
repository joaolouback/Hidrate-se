import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from './Screens/Home';
import LoginScreen from './Screens/LoginScreen';
import CadastroScreen from './Screens/Cadastro';
import HomePageScreen from './Screens/HomePage'; // Certifique-se de que o componente HomePage está correto

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Definir a tela inicial como Home
        screenOptions={{
          headerShown: false, // Remove o cabeçalho de todas as telas por padrão
          ...TransitionPresets.SlideFromRightIOS, // Animação ao navegar entre telas
        }}
      >
        {/* Tela Home */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />

        {/* Tela de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            headerShown: false, // Não mostra o header no login
          }} 
        />

        {/* Tela de Cadastro */}
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{
            headerShown: false, // Não mostra o header no cadastro
          }} 
        />

        {/* Tela HomePage (Route) */}
        <Stack.Screen 
          name="HomePage" 
          component={HomePageScreen} 
          options={{
            headerShown: true, // Mostra o header na HomePage
            title: 'Página Inicial', // Define um título no header
            gestureEnabled: true, // Habilita gesto de voltar no iOS
            ...TransitionPresets.ModalSlideFromBottomIOS, // Animação de modal
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
