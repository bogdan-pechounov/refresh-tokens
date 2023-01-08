import React, { useContext, useState } from 'react'
import { AppContext } from '../../App'
import api from '../../utils/api'

function Home() {
  const { user } = useContext(AppContext)
  const [image, setImage] = useState('')
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <img src={user?.profile_picture} alt="profile"></img>

      <button className="btn btn-primary" onClick={() => api.me()}>
        Test
      </button>

      <br />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          api.upload(image)
        }}
      >
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input type="submit" />
      </form>
    </div>
  )
}

export default Home
