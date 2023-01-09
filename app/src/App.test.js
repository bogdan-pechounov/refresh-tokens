import matchMediaPolyfill from 'mq-polyfill'
import { render, screen } from '@testing-library/react'
import App from './App'

//matchMedia for dark mode is undefined
matchMediaPolyfill(window)

test('renders', async () => {
  render(<App />)
  const avatar = await screen.findByRole('img', { name: /avatar/i })
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(avatar).toBeInTheDocument()
})
