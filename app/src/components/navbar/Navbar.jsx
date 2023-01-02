import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App'
import api from '../../utils/api'
import DarkMode from '../dark-mode/DarkMode'
import LoginModal from '../login/LoginModal'

function NavItem({ to, title, active, onClick }) {
  return (
    <li className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Link to={to} className='nav-link'>
        {title}
      </Link>
    </li>
  )
}

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
        <p>{user.name}</p>
        <NavItem title='Logout' onClick={logout} />
      </>
    )
  }

  return (
    <>
      <button
        type='button'
        className='btn btn-primary'
        data-bs-toggle='modal'
        data-bs-target='#loginModal'
      >
        Login
      </button>
      <LoginModal />
      <NavItem to={'/signup'} title='Signup' />
    </>
  )
}
function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className='container-fluid'>
        <Link to='/' className='navbar-brand'>
          Home
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            {/* <NavItem to={'/'} title='Home' /> */}
          </ul>
          <ul className='navbar-nav mb-2 mb-lg-0'>
            <UserLinks />
            <DarkMode />
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
