import React, { useEffect, useState } from 'react'

import './dark-mode.scss'

function DarkMode() {
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light'

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || preferredTheme
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleClick() {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
  }
  return (
    <div className='switch' onClick={handleClick}>
      <div className='moon'></div>
      <div className='rays'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default DarkMode
