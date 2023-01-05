import React, { useContext } from 'react'
import { AppContext } from '../../App'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)

  async function onClick() {
    try {
      await api.google()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <button className='btn btn-primary' onClick={onClick}>
        Google
      </button>
    </div>
  )
}

export default Home
