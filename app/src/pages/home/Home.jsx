import React, { useContext } from 'react'
import { AppContext } from '../../App'

function Home() {
  const { user } = useContext(AppContext)
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
    </div>
  )
}

export default Home
