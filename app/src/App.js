import Navbar from './components/navbar/Navbar'
import SignUp from './pages/signup/SignUp'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import ErrorPage from './pages/404/ErrorPage'
import { createContext, useEffect, useState } from 'react'
import api from './utils/api'
import ResetPassword from './pages/reset/ResetPassword'
import { ToastProvider } from './components/toast/Toast'

export const AppContext = createContext()

function App() {
  const [user, setUser] = useState()
  useEffect(() => {
    //get user info
    api
      .me()
      .then(setUser)
      .catch((err) => setUser(null))
  }, [])

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppContext.Provider>
  )
}

export default App
