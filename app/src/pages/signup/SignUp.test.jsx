import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppContext } from '../../App'
import SignUp from './SignUp'
import user from '@testing-library/user-event'
import { customRender } from '../../tests/test-utils'

describe('Sign up', () => {
  test('renders correctly', () => {
    customRender(<SignUp />)
    expect(screen.getByLabelText('Confirm Password')).toBeDefined()
    expect(screen.getByPlaceholderText('Username')).toBeDefined()
  })

  test('requires username', async () => {
    user.setup()
    render(
      <BrowserRouter>
        <AppContext.Provider value={{}}>
          <SignUp />
        </AppContext.Provider>
      </BrowserRouter>
    )
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    const errorMsg = await screen.findByText(/username required/i)
    expect(errorMsg).toBeInTheDocument()
  })

  test('validates email', async () => {
    user.setup()
    render(
      <BrowserRouter>
        <AppContext.Provider value={{}}>
          <SignUp />
        </AppContext.Provider>
      </BrowserRouter>
    )
    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.type(emailInput, 'abc')
    await user.click(submitButton)
    const errorMsg = await screen.findByText(/invalid email/i)
    expect(errorMsg).toBeInTheDocument()
  })

  test('sets user', async () => {
    user.setup()
    const setUser = jest.fn()
    customRender(<SignUp />, { setUser })
    const submitButton = screen.getByRole('button', { name: /submit/i })
    const usernameInput = screen.getByRole('textbox', { name: /username/i })
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    await user.type(usernameInput, 'User')
    await user.type(passwordInput, 'password')
    await user.type(confirmPasswordInput, 'password')
    await user.click(submitButton)
    expect(setUser).toHaveBeenCalled()
  })
})
