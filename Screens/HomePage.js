import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Modal, Linking, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/Firebase'; // Certifique-se de ajustar o caminho
import BottomMenu from './BottomMenu';

export default function HomePage() {
  const [region, setRegion] = useState({
    latitude: -20.353989, // Localização inicial na UVV
    longitude: -40.300131,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [showCard, setShowCard] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedPonto, setSelectedPonto] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]); // Para armazenar os feedbacks do Firestore

  const pontosDeAgua = [
    {
      id: 1,
      coords: { latitude: -20.351593, longitude: -40.298139 },
      title: "Ponto de Água - Shopping",
      location: "Shopping Vila Velha",
      description: "Ao lado dos banheiros, após a loja da Vivo.",
    },
    {
      id: 2,
      coords: { latitude: -20.351402, longitude: -40.296156 },
      title: "Ponto de Água - Crossfit Crown",
      location: "No lado de dentro do Crossfit",
      description: "Shopping Vila Velha",
    },
    {
      id: 3,
      coords: { latitude: -20.353989, longitude: -40.300131 },
      title: "Ponto de Água - UVV Unidade Acadêmica 3",
      location: "Unidade Acadêmica 3, Térreo",
      description: "Virando à direita no térreo. Há mais um bebedouro a cada andar no corredor.",
    },
    {
      id: 4,
      coords: { latitude: -20.353898, longitude: -40.299375 },
      title: "Ponto de Água - Entrada Unidade Acadêmica 3",
      location: "Entrada próxima ao shopping",
      description: "Na ponta da quadra de exercícios físicos, lado de fora.",
    },
  ];

  // Função para normalizar strings
  const normalizeString = (str) => str.trim().toLowerCase();

  // Função para buscar feedbacks do Firestore
  const fetchFeedbacks = async (pointName) => {
    try {
      const normalizedPointName = normalizeString(pointName); // Normalizar o nome do ponto
      const q = query(
        collection(db, 'feedbacks'),
        where('pointName', '==', normalizedPointName), // Filtrar pelo nome normalizado
        orderBy('timestamp', 'desc'), // Ordenar pelo mais recente
        limit(2) // Limitar a 2 feedbacks
      );

      const querySnapshot = await getDocs(q);
      const feedbackData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(feedbackData); // Atualiza os feedbacks
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      Alert.alert('Erro', 'Não foi possível carregar os feedbacks.');
    }
  };

  const abrirGoogleMaps = (coords) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
    });
  };

  useEffect(() => {
    if (selectedPonto) {
      fetchFeedbacks(selectedPonto.title); // Buscar feedbacks pelo título normalizado
    }
  }, [selectedPonto]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation={true}
        onPress={() => setShowCard(false)} // Oculta o card ao clicar no mapa
      >
        {pontosDeAgua.map((ponto) => (
          <Marker
            key={ponto.id}
            coordinate={ponto.coords}
            title={`${ponto.title}\n${ponto.location}`}
            onPress={() => {
              setSelectedPonto(ponto);
              setShowCard(true);
            }}
          >
            <Image
              source={require('../assets/ponto_agua.png')}
              style={styles.pontoAguaIcon}
            />
          </Marker>
        ))}
      </MapView>

      {showCard && selectedPonto && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>{selectedPonto.title}</Text>
          <Text style={styles.locationText}>Localização: {selectedPonto.location}</Text>
          <Text style={styles.descriptionText}>{selectedPonto.description}</Text>
          <TouchableOpacity style={styles.navigateButton} onPress={() => abrirGoogleMaps(selectedPonto.coords)}>
            <Text style={styles.navigateButtonText}>Vá até o ponto de água ➔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navigateButton, styles.feedbackButton]}
            onPress={() => setShowFeedbackModal(true)}
          >
            <Text style={styles.navigateButtonText}>Ver Feedbacks</Text>
          </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Feedbacks para {selectedPonto?.title}:</Text>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <View key={index} style={styles.feedback}>
                  <Text style={styles.feedbackRating}>Avaliação: {feedback.rating} ⭐</Text>
                  <Text style={styles.feedbackComment}>Comentário: "{feedback.comment}"</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noFeedbackText}>Nenhum feedback disponível.</Text>
            )}
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
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
    width: 42,
    height: 42,
  },
  noFeedbackText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
});
