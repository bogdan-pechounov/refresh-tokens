import React, { useContext, useState } from 'react'
import { AppContext } from '../../App'
import PostForm from '../../components/post-form/PostForm'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)

  return (
    <div className="container">
      <section className="row justify-content-center mt-1">
        <div className="col-lg-6 p-3 border rounded">
          <PostForm />
        </div>
      </section>
    </div>
  )
}

export default Home
