import React from 'react'
import { render } from '@testing-library/react'
import { AppContext } from '../App'
import { BrowserRouter } from 'react-router-dom'
import { ToastContext } from '../components/toast/Toast'

const AllTheProviders = ({ children, user, setUser }) => {
  return (
    <BrowserRouter>
      <AppContext.Provider value={{ user, setUser }}>
        <ToastContext.Provider value={{}}>{children}</ToastContext.Provider>
      </AppContext.Provider>
    </BrowserRouter>
  )
}

export const customRender = (ui, customProps, options) =>
  render(ui, {
    wrapper: (props) => <AllTheProviders {...props} {...customProps} />,
    ...options,
  })

// re-export everything
export * from '@testing-library/react'
