import { screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { customRender } from '../../tests/test-utils'
import PostForm from './PostForm'

describe('Post Form', () => {
  test('hides body', () => {
    customRender(<PostForm />)
    const body = screen.queryByRole('textbox', { name: /body/i })
    expect(body).not.toBeInTheDocument()
  })

  test('shows body', async () => {
    customRender(<PostForm />)
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    await user.type(titleInput, 'title')
    const body = screen.getByRole('textbox', { name: /body/i })
    expect(body).toBeInTheDocument()
  })

  test('disables submit button', async () => {
    customRender(<PostForm />)
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    await user.type(titleInput, 'title')
    const bodyInput = screen.getByRole('textbox', { name: /body/i })
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
    await user.type(bodyInput, 'body')
    expect(submitButton).toBeEnabled()
  })
})
