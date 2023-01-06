import LoginModal from '../login/LoginModal'
import { AppContext } from '../../App'
import api from '../../utils/api'
import { useContext } from 'react'
import NavItem from './NavItem'

function UserLinks() {
  const { user, setUser } = useContext(AppContext)
  async function logout() {
    await api.logout()
    setUser(null)
  }

  if (user === undefined) return //avoid login button briefly appearing
  if (user) {
    return (
      <>
        <NavItem title="Logout" onClick={logout} />
      </>
    )
  }

  return (
    <>
      <li>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#loginModal"
        >
          Login
        </button>
        <LoginModal />
      </li>
      <NavItem to={'/signup'} title="Signup" />
    </>
  )
}

export default UserLinks
