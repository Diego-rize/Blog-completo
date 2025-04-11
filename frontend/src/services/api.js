import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCZ0k_MzFCbo-EO2K3w2scf9a4sWJmeBR4",
    authDomain: "blog-api-d7238.firebaseapp.com",
    projectId: "blog-api-d7238",
    storageBucket: "blog-api-d7238.firebasestorage.app",
    messagingSenderId: "455031991411",
    appId: "1:455031991411:web:2bc07e9297d346de820e06"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsCollection = collection(db, 'posts');

export const getPosts = async () => {
  const snapshot = await getDocs(postsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPostById = async (id) => {
  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id, ...docSnap.data() };
  else throw new Error('Post no encontrado');
};

export const createPost = async (postData) => {
  await addDoc(postsCollection, {
    ...postData,
    createdAt: serverTimestamp()
  });
};

export const deletePost = async (id) => {
  const docRef = doc(db, 'posts', id);
  await deleteDoc(docRef);
};