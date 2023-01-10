import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../App'
import PostForm from '../../components/post-form/PostForm'
import PostList from '../../components/post-list/PostList'
import { ToastContext } from '../../components/toast/Toast'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { show, setTitle, setMsg } = useContext(ToastContext)

  useEffect(() => {
    api.getPosts().then(({ posts, count }) => {
      setLoading(false)
      setPosts(posts)
    })
  }, [])

  function onPostCreated(post) {
    post.user = user
    setPosts((posts) => [post, ...posts])
  }

  async function onPostEdited(post) {
    try {
      const newPost = await api.editPost(post)
      setPosts((posts) =>
        posts.map((post) =>
          post._id === newPost._id ? { ...newPost, user } : post
        )
      )
    } catch (err) {
      setTitle('Error')
      setMsg(Object.values(err.response.data))
      show()
    }
  }

  async function onPostDeleted(postId) {
    try {
      await api.deletePost(postId)
      setPosts((posts) => posts.filter((post) => post._id !== postId))
    } catch (err) {
      setTitle('Error')
      setMsg(Object.values(err.response.data))
      show()
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
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
        <PostList
          posts={posts}
          onPostDeleted={onPostDeleted}
          onPostEdited={onPostEdited}
        />
      </section>
    </div>
  )
}

export default Home
