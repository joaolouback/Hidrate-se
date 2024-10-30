import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, TouchableOpacity, Modal, Linking, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomMenu from './BottomMenu';

export default function HomePage() {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [distance, setDistance] = useState(null);

  const pontoAguaCoords = {
    latitude: -20.351593,
    longitude: -40.298139,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada', 'Permita o acesso à localização para usar o mapa');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setRegion({
        ...userCoords,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
      calculateDistance(userCoords, pontoAguaCoords); // Calcula a distância
      setLoading(false);
    })();
  }, []);

  const calculateDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);

    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;
    setDistance((distanceInKm * 1000).toFixed(0)); // Converte para metros e arredonda
  };

  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pontoAguaCoords.latitude},${pontoAguaCoords.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation={true}
        onPress={() => setShowCard(false)} // Oculta o card ao clicar no mapa
      >
        <Marker
          coordinate={pontoAguaCoords}
          title="Ponto de Água"
          description="Av. Luciano das Neves, 2418 - Centro de Vila Velha"
          onPress={() => setShowCard(true)}
          >
           <Image
              source={require('../assets/ponto_agua.png')} // Caminho para a sua imagem
              style={styles.pontoAguaIcon} // Define o estilo para ajustar o tamanho
            />

          </Marker>
      </MapView>

      {showCard && (
        <View style={styles.infoCard}>
          <Text style={styles.distanceText}>
            Você está a {distance ? `${distance} metros (em linha reta)` : 'calculando...'} de distância desse ponto de água
          </Text>

          <View style={styles.cardContent}>
            <Text style={styles.ratingText}>Avaliação: 4,9/5,0 ⭐</Text>
            <Text style={styles.addressText}>
              Av. Luciano das Neves, 2418 - Centro de Vila Velha, Vila Velha - ES, 29107-900
            </Text>
            <TouchableOpacity style={styles.navigateButton} onPress={abrirGoogleMaps}>
              <Text style={styles.navigateButtonText}>Vá até o ponto de água ➔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navigateButton, styles.feedbackButton]}
              onPress={() => setShowFeedbackModal(true)}
            >
              <Text style={styles.navigateButtonText}>Ver Feedbacks</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal para exibir feedbacks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFeedbackModal}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Feedbacks:</Text>
            <View style={styles.feedback}>
              <Text style={styles.feedbackUser}>Usuário: Maria</Text>
              <Text style={styles.feedbackRating}>Avaliação: 5,0/5,0 ⭐</Text>
              <Text style={styles.feedbackComment}>
                Comentário: "Excelente ponto de água! Fácil de encontrar e com água fresca e limpa."
              </Text>
            </View>
            <View style={styles.feedback}>
              <Text style={styles.feedbackUser}>Usuário: Lucas</Text>
              <Text style={styles.feedbackRating}>Avaliação: 5,0/5,0 ⭐</Text>
              <Text style={styles.feedbackComment}>
                Comentário: "Ponto de água bem acessível e organizado, ótimo para quem está no shopping!"
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowFeedbackModal(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    position: 'absolute',
    bottom: 108,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  feedbackButton: {
    backgroundColor: '#007BFF',
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedback: {
    marginBottom: 15,
  },
  feedbackUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackRating: {
    fontSize: 14,
    color: '#888',
  },
  feedbackComment: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pontoAguaIcon: {
    width: 42, // Ajuste para o tamanho desejado
    height: 42, // Ajuste para o tamanho desejado
  },
});
