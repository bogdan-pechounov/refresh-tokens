import { render, screen } from '@testing-library/react'
import Hello from './Hello'

test('Hello renders', () => {
  render(<Hello />)
  const textElement = screen.getByText('Hello')
  expect(textElement).toBeInTheDocument()
})
