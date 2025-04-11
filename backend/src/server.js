import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import postRoutes from './routes/postRoutes.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ0k_MzFCbo-EO2K3w2scf9a4sWJmeBR4",
  authDomain: "blog-api-d7238.firebaseapp.com",
  projectId: "blog-api-d7238",
  storageBucket: "blog-api-d7238.appspot.com" // ¡Requerido para imágenes!
};

// Inicialización de Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Configuración de Multer (para subir imágenes)
const upload = multer({ storage: multer.memoryStorage() });

// Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.send('¡API del Blog funcionando!');
});
app.use('/api/posts', postRoutes(db, storage, upload)); // Conexión con las rutas de posts

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});