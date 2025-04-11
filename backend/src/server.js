import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ0k_MzFCbo-EO2K3w2scf9a4sWJmeBR4",
  authDomain: "blog-api-d7238.firebaseapp.com",
  projectId: "blog-api-d7238"
};

// Inicializar app y Firebase
const app = express();
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡API del Blog funcionando correctamente!');
});

// Crear post (POST)
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Se requieren title y content' });
    }

    const docRef = await addDoc(collection(db, 'posts'), {
      title,
      content,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      id: docRef.id,
      title,
      content
    });
  } catch (error) {
    console.error("Error al crear post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener posts (GET)
app.get('/api/posts', async (req, res) => {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener posts:", error);
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

// Eliminar post (DELETE)
app.delete('/api/posts/:id', async (req, res) => {
  console.log("➡️ LLEGÓ AL DELETE"); // Verifica si la ruta se ejecuta

  try {
    const postId = req.params.id;
    const postRef = doc(db, 'posts', postId);

    await deleteDoc(postRef);

    res.json({
      success: true,
      message: `Post ${postId} eliminado correctamente`
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({
      error: "Error al eliminar el post",
      details: error.message
    });
  }
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
