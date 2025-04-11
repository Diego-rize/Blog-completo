import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../services/api';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        await deletePost(id);
        // Actualizar la lista de posts después de eliminar
        fetchData();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h1>Lista de Posts</h1>
        <button onClick={() => navigate('/create')}>Crear Post</button>
      </div>
      <input
        type="text"
        placeholder="Buscar post..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <div className="post-card" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.date}</p>
            <p>{post.content.slice(0, 100)}...</p>
            <div className="post-buttons">
              <button onClick={() => navigate(`/post/${post.id}`)}>Leer más</button>
              <button 
                onClick={() => handleDelete(post.id)}
                className="delete-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;