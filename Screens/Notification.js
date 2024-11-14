import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert, Image } from 'react-native';
import BottomMenu from './BottomMenu';
import { db, auth } from '../services/Firebase';
import { collection, onSnapshot, query, where, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifArray);
    });

    return () => unsubscribe();
  }, []);

  const addWaterReminder = async () => {
    if (!weight || !reminderTime) {
      Alert.alert('Erro', 'Por favor, preencha o peso e o horário de lembrete.');
      return;
    }

    const currentUser = auth.currentUser;
    const dailyIntake = (weight * 0.035).toFixed(2);

    try {
      await addDoc(collection(db, 'notifications'), {
        userId: currentUser.uid,
        message: `Lembre-se de beber ${dailyIntake} litros de água diariamente. Lembrete definido para ${reminderTime}.`,
        type: 'reminder',
        createdAt: new Date(),
        icon: 'clock',
      });
      setModalVisible(false);
      setWeight('');
      setReminderTime('');
    } catch (error) {
      console.error("Erro ao adicionar lembrete de água: ", error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      Alert.alert('Sucesso', 'Lembrete de água apagado com sucesso.');
    } catch (error) {
      console.error("Erro ao apagar lembrete de água: ", error);
    }
  };

  const renderNotificationItem = ({ item }) => {
    const icon = item.type === 'like' ? require('../assets/like.png') : require('../assets/clock.png');
    
    return (
      <View style={styles.notificationItem}>
        <Image source={icon} style={styles.notificationIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.notificationTitle}>
            {item.type === 'like' ? 'Nova curtida!' : 'Lembrete de Água'}
          </Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationDate}>
            {new Date(item.createdAt.toDate()).toLocaleString()}
          </Text>
        </View>
        {item.type === 'reminder' && (
          <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Apagar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.reminderButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.reminderButtonText}>Adicionar Lembrete de Água</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Definir Lembrete de Água</Text>

            <TextInput
              style={styles.input}
              placeholder="Peso (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Horário para lembrete (ex: 08:00)"
              value={reminderTime}
              onChangeText={setReminderTime}
            />

            <TouchableOpacity style={styles.modalAddButton} onPress={addWaterReminder}>
              <Text style={styles.modalAddButtonText}>Salvar Lembrete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
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
    backgroundColor: '#0F51A4',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reminderButton: {
    backgroundColor: '#3EB174',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    right: 20,
    elevation: 5,
  },
  reminderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalAddButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalCancelButton: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    borderColor: '#FF6347',
    borderWidth: 1,
  },
  modalCancelButtonText: {
    color: '#FF6347',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
