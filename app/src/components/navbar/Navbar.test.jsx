import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppContext } from '../../App'
import matchMediaPolyfill from 'mq-polyfill'
import Navbar from './Navbar'
import { ToastContext } from '../toast/Toast'
import user from '@testing-library/user-event'
matchMediaPolyfill(window)

describe('Navbar', () => {
  test('renders correctly when user not logged in', () => {
    render(
      <BrowserRouter>
        <AppContext.Provider value={{ user: null }}>
          <ToastContext.Provider value={{}}>
            <Navbar />
          </ToastContext.Provider>
        </AppContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeDefined()

    const listItems = screen.getAllByRole('listitem', { hidden: true })
    expect(listItems).toHaveLength(2)

    const logout = screen.queryByRole('link', { name: 'Logout' })
    expect(logout).not.toBeInTheDocument()
  })

  test('renders correctly when user logged in', () => {
    render(
      <BrowserRouter>
        <AppContext.Provider value={{ user: {} }}>
          <ToastContext.Provider value={{}}>
            <Navbar />
          </ToastContext.Provider>
        </AppContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeDefined()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(1)

    const logout = screen.queryByRole('link', { name: 'Logout' })
    expect(logout).toBeInTheDocument()
  })

  test('logout sets user to null', async () => {
    user.setup()
    const setUser = jest.fn()
    render(
      <BrowserRouter>
        <AppContext.Provider value={{ setUser, user: {} }}>
          <Navbar />
        </AppContext.Provider>
      </BrowserRouter>
    )
    const logoutButton = screen.getByRole('link', { name: /logout/i })
    await user.click(logoutButton)
    expect(setUser).toHaveBeenCalledWith(null)
  })
})
