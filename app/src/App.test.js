import matchMediaPolyfill from 'mq-polyfill'
import { render, screen } from '@testing-library/react'
import App from './App'

//matchMedia for dark mode is undefined
matchMediaPolyfill(window)

test('renders', async () => {
  render(<App />)
  await screen.findByRole('link', { name: /logout/i })
  expect(screen.getByText('Home')).toBeInTheDocument()
})
