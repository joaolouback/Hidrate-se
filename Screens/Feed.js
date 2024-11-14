import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert, Modal, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';
import { db, auth } from '../services/Firebase.js';
import { collection, addDoc, getDocs, updateDoc, doc, increment, getDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';

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
  const [newPostImage, setNewPostImage] = useState('');

  const fetchPosts = async () => {
    const postsArray = [];
    const querySnapshot = await getDocs(collection(db, 'posts'));
    querySnapshot.forEach((doc) => {
      postsArray.push({ id: doc.id, ...doc.data() });
    });
    setPosts(postsArray);
  };

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
        image: newPostImage, // Adiciona a URL da imagem ao documento
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
        setNewPostImage('');
        setModalVisible(false);
        fetchPosts();
      } catch (error) {
        console.error("Erro ao adicionar publicação: ", error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para adicionar uma publicação.');
    }
  };

  const handleLike = async (id, postOwnerId) => {
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
            dislikes: hasDisliked ? increment(-1) : postData.dislikes,
            dislikedBy: hasDisliked ? arrayRemove(currentUser.uid) : postData.dislikedBy
          });
          if (postOwnerId !== currentUser.uid) {
            await addDoc(collection(db, 'notifications'), {
              userId: postOwnerId,
              message: `${currentUser.displayName || 'Um usuário'} curtiu sua postagem.`,
              type: 'like',
              createdAt: new Date(),
              icon: 'like',
            });
          }
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
          {
            text: 'Apagar', onPress: async () => {
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
      <View style={[styles.postContainer, { marginTop: 20 }]}>
        <Text style={styles.title}>{item.title}</Text>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        ) : null}
        <Text style={styles.summary}>{item.summary}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.user}>Usuário: {item.user}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id, item.userId)}>
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
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Publicação</Text>

            <Text style={styles.label}>Título da Postagem:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o título"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />

            <Text style={styles.label}>Assunto:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o assunto"
              value={newPostSummary}
              onChangeText={setNewPostSummary}
            />

            <Text style={styles.label}>Descrição da Postagem:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Digite a descrição"
              value={newPostDescription}
              onChangeText={setNewPostDescription}
              multiline={true}
              numberOfLines={4}
            />

            <Text style={styles.label}>URL da Imagem:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a URL da imagem"
              value={newPostImage}
              onChangeText={setNewPostImage}
            />

            <TouchableOpacity style={styles.modalAddButton} onPress={addNewPost}>
              <Text style={styles.modalAddButtonText}>Publicar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  summary: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
  user: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#999',
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
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
  textArea: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
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
