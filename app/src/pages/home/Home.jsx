import React from 'react'
import api from '../../utils/api'

function Home() {
  return <div onClick={() => api.me()}>Home</div>
}

export default Home
