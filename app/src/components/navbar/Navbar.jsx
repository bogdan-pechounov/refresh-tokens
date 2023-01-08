import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App'

import DarkMode from '../dark-mode/DarkMode'
import LoginModal from '../login/LoginModal'
import Avatar from './Avatar'

function Navbar() {
  const { user } = useContext(AppContext)

  function UserLinks() {
    if (user === undefined) return //avoid login button briefly appearing
    if (user) {
      return (
        <li className="nav-item me-2">
          <Avatar />
        </li>
      )
    }

    return (
      <>
        <li className="nav-item">
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
        <li className="nav-item">
          <Link to={'/signup'} className="nav-link">
            Sign up
          </Link>
        </li>
      </>
    )
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Home
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse`} id="navbarSupportedContent">
          <div className="me-auto"></div>

          <ul className="navbar-nav mb-2 mb-lg-0">
            <UserLinks />
            <li className="nav-item mt-2 mt-lg-0">
              <DarkMode />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
