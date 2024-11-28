import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../services/Firebase'; // Certifique-se de ajustar o caminho
import { collection, addDoc } from 'firebase/firestore';
import BottomMenu from './BottomMenu';

export default function Feedback() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [points, setPoints] = useState([
    { id: 1, name: 'Ponto de Água - Shopping', location: 'Shopping Vila Velha' },
    { id: 2, name: 'Ponto de Água - Crossfit Crown', location: 'Shopping Vila Velha' },
    { id: 3, name: 'Ponto de Água - UVV Unidade Acadêmica 3', location: 'Unidade Acadêmica 3, Térreo' },
    { id: 4, name: 'Ponto de Água - Entrada Unidade Acadêmica 3', location: 'Entrada próxima ao shopping' },
  ]);

  // Função para filtrar os pontos de água com base na barra de pesquisa
  const filteredPoints = points.filter(
    (point) =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submitFeedback = async () => {
    if (!selectedPoint || selectedRating === 0 || !comment.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos antes de enviar o feedback.');
      return;
    }

    try {
      // Salvar os dados no Firestore
      await addDoc(collection(db, 'feedbacks'), {
        pointName: selectedPoint.name, // Nome ajustado para ser igual ao HomePage
        pointLocation: selectedPoint.location, // Localização ajustada para ser igual ao HomePage
        rating: selectedRating,
        comment: comment,
        timestamp: new Date().toISOString(),
      });

      Alert.alert('Obrigado!', `Seu feedback sobre "${selectedPoint.name}" foi enviado com sucesso.`);
      // Resetar os estados
      setSelectedRating(0);
      setSelectedPoint(null);
      setComment('');
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o feedback. Tente novamente mais tarde.');
      console.error('Erro ao enviar feedback:', error);
    }
  };

  const renderPoint = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.pointItem,
        selectedPoint?.id === item.id && styles.selectedPoint,
      ]}
      onPress={() => setSelectedPoint(item)}
    >
      <Text style={styles.pointName}>{item.name}</Text>
      <Text style={styles.pointLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Buscar ponto de água:</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Digite o nome ou localização do ponto"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPoints}
        renderItem={renderPoint}
        keyExtractor={(item) => item.id.toString()}
        style={styles.pointsList}
      />

      <Text style={styles.label}>Qual sua nota para esse ponto?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
            <FontAwesome
              name="star"
              size={32}
              color={selectedRating >= star ? '#FFD700' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Comentário:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Escreva seu comentário aqui"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
        <Text style={styles.submitButtonText}>Enviar Feedback</Text>
      </TouchableOpacity>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F51A4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  pointsList: {
    maxHeight: 150,
    marginBottom: 20,
  },
  pointItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPoint: {
    borderColor: '#FFD700',
  },
  pointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pointLocation: {
    fontSize: 14,
    color: '#777',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#3EB174',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
