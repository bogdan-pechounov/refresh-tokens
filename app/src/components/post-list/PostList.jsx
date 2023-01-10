import React from 'react'
import Post from '../post/Post'

function PostList({ posts, onPostDeleted }) {
  return (
    <div className="row">
      {posts.map((post) => (
        <article key={post._id} className="col-lg-6 g-3">
          <Post {...post} onPostDeleted={onPostDeleted} />
        </article>
      ))}
    </div>
  )
}

export default PostList
