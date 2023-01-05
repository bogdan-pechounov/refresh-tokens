import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { AppContext } from '../../App'
import { server } from '../../tests/mocks/server'
import { customRender } from '../../tests/test-utils'
import { BASE_URL } from '../../utils/api'
import { ToastContext } from '../toast/Toast'
import LoginModal, { Login } from './LoginModal'
import user from '@testing-library/user-event'
import { getRoot } from '../../utils/utils'

describe('Login Modal', () => {
  test('renders correctly', () => {
    const setUser = jest.fn()
    render(
      <AppContext.Provider value={{ setUser }}>
        <ToastContext.Provider value={{}}>
          <LoginModal />
        </ToastContext.Provider>
      </AppContext.Provider>,
      {}
    )
    expect(screen.getByText('Username or email')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { hidden: true, name: 'Login' })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  test('displays error message', async () => {
    user.setup()
    server.use(
      rest.post(BASE_URL + '/auth/login', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json('Incorrect password'))
      })
    )
    const setUser = jest.fn()
    customRender(<Login />, { setUser }, { container: getRoot('loginModal') })
    const loginButton = screen.getByRole('button', {
      name: 'Login',
      hidden: true,
    })
    await user.click(loginButton)
    const errorMsg = await screen.findByRole('alert')
    expect(errorMsg).toBeInTheDocument()
  })
})
