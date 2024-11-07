import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';

export default function Feed() {
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'Economia de Água no Dia a Dia',
      summary: '5 Maneiras Simples de Economizar Água em Casa',
      description: 'Pequenas mudanças de hábitos podem fazer grande diferença no consumo de água. Descubra como você pode economizar água em tarefas simples do cotidiano.',
      image: 'Imagem: Pingar água em um contador de gotas.',
      user: 'João',
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
    },
    {
      id: '2',
      title: 'Alimentos Que Ajudam na Hidratação',
      summary: 'Frutas Ricas em Água que Ajudam na Hidratação do Corpo',
      description: 'Além de beber água, o consumo de frutas como melancia e pepino pode ser um aliado para manter o corpo hidratado durante todo o dia.',
      image: 'Imagem: Prato com melancia, pepino e laranja.',
      user: 'Paulo',
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');

  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          if (post.userLiked) {
            return { ...post, likes: post.likes - 1, userLiked: false };
          } else {
            return {
              ...post,
              likes: post.userLiked ? post.likes : post.likes + 1,
              dislikes: post.userDisliked ? post.dislikes - 1 : post.dislikes,
              userLiked: true,
              userDisliked: false,
            };
          }
        }
        return post;
      })
    );
  };

  const handleDislike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          if (post.userDisliked) {
            return { ...post, dislikes: post.dislikes - 1, userDisliked: false };
          } else {
            return {
              ...post,
              dislikes: post.userDisliked ? post.dislikes : post.dislikes + 1,
              likes: post.userLiked ? post.likes - 1 : post.likes,
              userDisliked: true,
              userLiked: false,
            };
          }
        }
        return post;
      })
    );
  };

  const addNewPost = () => {
    if (newPostTitle && newPostSummary && newPostDescription) {
      const newPost = {
        id: Math.random().toString(),
        title: newPostTitle,
        summary: newPostSummary,
        description: newPostDescription,
        image: '',
        user: 'Você',
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostTitle('');
      setNewPostSummary('');
      setNewPostDescription('');
      setModalVisible(false);
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para adicionar uma publicação.');
    }
  };

  const deletePost = (id) => {
    Alert.alert(
      'Apagar Publicação',
      'Tem certeza de que deseja apagar esta publicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar', onPress: () => setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.summary}>Título: {item.summary}</Text>
      <Text style={styles.description}>Resumo: {item.description}</Text>
      <Text style={styles.user}>Usuário: {item.user}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <FontAwesome name="thumbs-up" size={24} color={item.userLiked ? "green" : "gray"} />
          <Text>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDislike(item.id)} style={{ marginLeft: 20 }}>
          <FontAwesome name="thumbs-down" size={24} color={item.userDisliked ? "red" : "gray"} />
          <Text>{item.dislikes}</Text>
        </TouchableOpacity>
      </View>
      {item.user === 'Você' && (
        <TouchableOpacity onPress={() => deletePost(item.id)} style={styles.deleteIcon}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Adicionar Publicação</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Publicação</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Resumo"
              value={newPostSummary}
              onChangeText={setNewPostSummary}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newPostDescription}
              onChangeText={setNewPostDescription}
            />
            <TouchableOpacity style={styles.modalAddButton} onPress={addNewPost}>
              <Text style={styles.modalAddButtonText}>Publicar</Text>
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
    backgroundColor: '#0F51A4', // Fundo azul
  },
  postContainer: {
    backgroundColor: '#ffffff', // Cor dos cards branco
    borderRadius: 10,
    padding: 15,
    marginBottom: 1,
    marginTop: 15,
    marginHorizontal: 10, // Adiciona espaçamento nas laterais
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    fontSize: 16, // Aumentei o tamanho do texto da descrição
    marginBottom: 5,
  },
  user: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addButton: {
    backgroundColor: '#3EB174', // Cor verde especificada
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    position: 'absolute',
    bottom: 100, // Subi o botão um pouco
    right: 20,
    elevation: 5,
  },
  addButtonText: {
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalAddButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});
