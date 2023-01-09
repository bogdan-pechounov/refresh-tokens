import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../App'
import PostForm from '../../components/post-form/PostForm'
import PostList from '../../components/post-list/PostList'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.getPosts().then(({ posts, count }) => setPosts(posts))
  }, [])

  function onPostCreated(post) {
    post.user = user
    setPosts([post, ...posts])
  }

  return (
    <div className="container">
      {user && (
        <section className="row justify-content-center mt-3">
          <div className="col-lg-6 p-3 border rounded">
            <PostForm onPostCreated={onPostCreated} />
          </div>
        </section>
      )}
      <section className="mt-3">
        <PostList posts={posts} />
      </section>
    </div>
  )
}

export default Home
