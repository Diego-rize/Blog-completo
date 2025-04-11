import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const createPost = (db, storage) => async (req, res) => {
  const { title, content } = req.body;
  const file = req.file; // Imagen subida via Multer

  // Validación
  if (!title || !content) {
    return res.status(400).json({ error: 'Title y content son requeridos' });
  }

  try {
    // 1. Subir imagen a Firebase Storage (si existe)
    let imageUrl = null;
    if (file) {
      const storageRef = ref(storage, `posts/${Date.now()}_${file.originalname}`);
      await uploadBytes(storageRef, file.buffer);
      imageUrl = await getDownloadURL(storageRef);
    }

    // 2. Guardar en Firestore
    const docRef = await addDoc(collection(db, 'posts'), {
      title,
      content,
      imageUrl,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ 
      id: docRef.id, 
      title, 
      content, 
      imageUrl 
    });

  } catch (error) {
    console.error('🔥 Error en createPost:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los posts
export const getAllPosts = (db) => async (req, res) => {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
};

// Obtener un post por ID
export const getPostById = (db) => async (req, res) => {
  try {
    const postId = req.params.id;
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json({ id: postSnap.id, ...postSnap.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el post' });
  }
};