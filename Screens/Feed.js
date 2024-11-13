import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';
import { db, auth } from '../services/Firebase.js';
import { collection, addDoc, getDocs, updateDoc, doc, increment, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const getUserName = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data().nome : 'Anônimo';
};

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');

  // Função para buscar posts do Firestore
  const fetchPosts = async () => {
    const postsArray = [];
    const querySnapshot = await getDocs(collection(db, 'posts'));
    querySnapshot.forEach((doc) => {
      postsArray.push({ id: doc.id, ...doc.data() });
    });
    setPosts(postsArray);
  };

  // useEffect para buscar os posts na primeira renderização
  useEffect(() => {
    fetchPosts();
  }, []);

  const addNewPost = async () => {
    if (newPostTitle && newPostSummary && newPostDescription) {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userName = await getUserName(currentUser.uid);

      const newPost = {
        title: newPostTitle,
        summary: newPostSummary,
        description: newPostDescription,
        image: '',
        user: userName,
        userId: currentUser.uid,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date(),
      };

      try {
        await addDoc(collection(db, 'posts'), newPost);
        setNewPostTitle('');
        setNewPostSummary('');
        setNewPostDescription('');
        setModalVisible(false);
        fetchPosts();
      } catch (error) {
        console.error("Erro ao adicionar publicação: ", error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para adicionar uma publicação.');
    }
  };

  const handleLike = async (id) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const postRef = doc(db, 'posts', id);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const hasLiked = postData.likedBy?.includes(currentUser.uid);
      const hasDisliked = postData.dislikedBy?.includes(currentUser.uid);

      try {
        if (hasLiked) {
          await updateDoc(postRef, {
            likes: increment(-1),
            likedBy: arrayRemove(currentUser.uid)
          });
        } else {
          await updateDoc(postRef, {
            likes: increment(1),
            likedBy: arrayUnion(currentUser.uid),
            // Remover dislike se houver
            dislikes: hasDisliked ? increment(-1) : postData.dislikes,
            dislikedBy: hasDisliked ? arrayRemove(currentUser.uid) : postData.dislikedBy
          });
        }
        fetchPosts();
      } catch (error) {
        console.error("Erro ao atualizar like: ", error);
      }
    }
  };

  const handleDislike = async (id) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const postRef = doc(db, 'posts', id);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const hasLiked = postData.likedBy?.includes(currentUser.uid);
      const hasDisliked = postData.dislikedBy?.includes(currentUser.uid);

      try {
        if (hasDisliked) {
          await updateDoc(postRef, {
            dislikes: increment(-1),
            dislikedBy: arrayRemove(currentUser.uid)
          });
        } else {
          await updateDoc(postRef, {
            dislikes: increment(1),
            dislikedBy: arrayUnion(currentUser.uid),
            // Remover like se houver
            likes: hasLiked ? increment(-1) : postData.likes,
            likedBy: hasLiked ? arrayRemove(currentUser.uid) : postData.likedBy
          });
        }
        fetchPosts();
      } catch (error) {
        console.error("Erro ao atualizar dislike: ", error);
      }
    }
  };

  const deletePost = async (id, userId) => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === userId) {
      Alert.alert(
        'Apagar Publicação',
        'Tem certeza de que deseja apagar esta publicação?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Apagar', onPress: async () => {
              try {
                await deleteDoc(doc(db, 'posts', id));
                fetchPosts();
              } catch (error) {
                console.error("Erro ao excluir publicação: ", error);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Erro', 'Você não tem permissão para apagar esta publicação.');
    }
  };

  const renderItem = ({ item }) => {
    const currentUser = auth.currentUser;
    const hasLiked = item.likedBy?.includes(currentUser?.uid);
    const hasDisliked = item.dislikedBy?.includes(currentUser?.uid);

    return (
      <View style={styles.postContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary}>Título: {item.summary}</Text>
        <Text style={styles.description}>Resumo: {item.description}</Text>
        <Text style={styles.user}>Usuário: {item.user}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <FontAwesome name="thumbs-up" size={24} color={hasLiked ? "green" : "gray"} />
            <Text>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDislike(item.id)} style={{ marginLeft: 20 }}>
            <FontAwesome name="thumbs-down" size={24} color={hasDisliked ? "red" : "gray"} />
            <Text>{item.dislikes}</Text>
          </TouchableOpacity>
        </View>
        {currentUser && currentUser.uid === item.userId && (
          <TouchableOpacity onPress={() => deletePost(item.id, item.userId)} style={styles.deleteIcon}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
    backgroundColor: '#0F51A4',
  },
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 1,
    marginTop: 15,
    marginHorizontal: 10,
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
    fontSize: 16,
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
