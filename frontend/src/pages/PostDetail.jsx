import React from 'react';
import { useParams } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();

  return (
    <div className="post-detail-container">
      <h1>Detalle del Post {id}</h1>
    </div>
  );
};

export default PostDetail;
