import React from 'react';

interface PostProps {
  id: number;
  firstName: string;
  lastName: string;
  about: string;
}

const Post: React.FC<PostProps> = ({ id, firstName, lastName, about }) => {
  return (
    <div style={{ border: '1px solid white', padding: '15px', margin: '10px 0px' }}>
      <h3>{firstName}</h3>
      <h4>{lastName}</h4>
      <p>{about}</p>
    </div>
  );
};

export default Post;
