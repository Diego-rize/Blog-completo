import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost
} from '../controllers/postController.js';

const router = Router();

export default (db, storage, upload) => {
  // Crear un nuevo post (con imagen opcional)
  router.post('/', upload.single('image'), createPost(db, storage));
  
  // Obtener todos los posts
  router.get('/', getAllPosts(db));
  
  // Obtener un post por ID
  router.get('/:id', getPostById(db));
  
  // Eliminar un post
  router.delete('/:id', deletePost(db, storage));
  
  return router;
};