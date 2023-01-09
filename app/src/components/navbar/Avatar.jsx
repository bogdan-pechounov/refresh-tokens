import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App'
import api, { BASE_URL } from '../../utils/api'
import DeleteConfirmation from '../modals/DeleteConfirmation'

const defaultImg =
  'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

function Avatar() {
  const { user, setUser } = useContext(AppContext)

  const profile_picture = isValidUrl(user.profile_picture)
    ? user.profile_picture
    : `${BASE_URL}/images/${user.profile_picture}`

  async function logout() {
    await api.logout()
    setUser(null)
  }

  return (
    <div className="dropdown-center">
      <img
        src={profile_picture || defaultImg}
        className="rounded-circle dropdown-toggle"
        width="40px"
        height="40px"
        alt="Avatar"
        data-bs-toggle="dropdown"
        loading="lazy"
        // referrerPolicy="no-referrer"
        onError={(e) => {
          e.target.src = defaultImg
        }}
      />
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <h6 className="dropdown-header">{user.name}</h6>
        </li>
        <li>
          <Link to={'/profile/edit'} className="dropdown-item">
            Edit Profile
          </Link>
        </li>
        <li>
          <div
            type="button"
            className="dropdown-item text-danger"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
          >
            Delete Account
          </div>
        </li>
        <DeleteConfirmation />
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link className="dropdown-item" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Avatar
