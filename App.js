import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from './Screens/Home';
import LoginScreen from './Screens/LoginScreen';
import CadastroScreen from './Screens/Cadastro';
import HomePageScreen from './Screens/HomePage';
import FeedScreen from './Screens/Feed';
import NotificationScreen from './Screens/Notification';
import FeedbackScreen from './Screens/Feedback';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS, // Transição horizontal por padrão
        }}
      >
        {/* Tela Home */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Tela de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            headerShown: false,
          }} 
        />

        {/* Tela de Cadastro */}
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{
            headerShown: false,
          }} 
        />

        {/* Tela HomePage */}
        <Stack.Screen 
          name="HomePage" 
          component={HomePageScreen} 
          options={{
            headerShown: true,
            title: 'Página Inicial',
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS, // Transição horizontal
          }} 
        />

        {/* Tela Feed */}
        <Stack.Screen 
          name="Feed" 
          component={FeedScreen} 
          options={{
            headerShown: true,
            title: 'Página de Feed',
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS, // Transição horizontal
          }} 
        />

        {/* Tela Notificações */}
        <Stack.Screen 
          name="Notification" 
          component={NotificationScreen} 
          options={{
            headerShown: true,
            title: 'Página de Notificações',
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS, // Transição horizontal
          }} 
        />

        {/* Tela Feedback */}
        <Stack.Screen 
          name="Feedback" 
          component={FeedbackScreen} 
          options={{
            headerShown: true,
            title: 'Página de Feedback',
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS, // Transição horizontal
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
