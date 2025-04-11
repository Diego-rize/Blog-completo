import { Router } from 'express';
import { 
  createPost, 
  getAllPosts, 
  getPostById 
} from '../controllers/postController.js';

const router = Router();

export default (db, storage, upload) => {
  router.post('/', upload.single('image'), createPost(db, storage));
  router.get('/', getAllPosts(db));
  router.get('/:id', getPostById(db));
  
  return router;
};