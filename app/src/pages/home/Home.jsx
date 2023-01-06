import React, { useContext } from 'react'
import { AppContext } from '../../App'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)

  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <img src={user?.profile_picture} alt="profile"></img>

      <button className="btn btn-primary" onClick={() => api.me()}>
        Test
      </button>
    </div>
  )
}

export default Home
