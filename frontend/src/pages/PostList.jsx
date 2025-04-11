import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../services/api';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchData();
  }, []);

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
            <button onClick={() => navigate(`/post/${post.id}`)}>Leer más</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
