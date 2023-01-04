import React, { useContext } from 'react'
import { AppContext } from '../../App'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <button className='btn btn-primary'>Reset password</button>
    </div>
  )
}

export default Home
