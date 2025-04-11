import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const createPost = (db, storage) => async (req, res) => {
    const { title, content } = req.body;
    const file = req.file; // Puede ser undefined
  
    // Validación mejorada
    if (!title || !content) {
      return res.status(400).json({ error: 'Title y content son requeridos' });
    }
  
    try {
      // 1. Subir imagen solo si existe
      let imageUrl = null;
      if (file) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.originalname}`);
        await uploadBytes(storageRef, file.buffer).catch(uploadError => {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        });
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
      console.error('🔥 Error en createPost:', error.message);
      res.status(500).json({ 
        error: error.message || 'Error al crear el post',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };