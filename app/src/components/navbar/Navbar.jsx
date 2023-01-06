import React from 'react'
import { Link } from 'react-router-dom'

import DarkMode from '../dark-mode/DarkMode'
import UserLinks from './UserLinks'

function Navbar() {
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
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <NavItem to={'/'} title='Home' /> */}
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <UserLinks />
            <DarkMode />
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
