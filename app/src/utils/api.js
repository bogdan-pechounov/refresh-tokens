import axios from 'axios'

export const BASE_URL = 'http://localhost:3001'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

axiosClient.interceptors.response.use(
  (response) => {
    const { data, headers } = response
    //store access token in memory
    const accessToken = headers['x-access-token']
    const csrfToken = headers['x-csrf-token']
    if (accessToken)
      axiosClient.defaults.headers['X-Access-Token'] = accessToken
    if (csrfToken) axiosClient.defaults.headers['X-CSRF-Token'] = csrfToken
    return data
  },
  (error) => {
    const csrfToken = error.response.headers['x-csrf-token']
    if (csrfToken) axiosClient.defaults.headers['X-CSRF-Token'] = csrfToken
    throw error
  }
)

class Api {
  async me() {
    return await axiosClient.get('/auth/me')
  }

  async signup(user) {
    return await axiosClient.post('/auth/signup', user)
  }

  async login(user) {
    return await axiosClient.post('/auth/login', user)
  }
  async logout() {
    axiosClient.defaults.headers['X-Access-Token'] = undefined
    return await axiosClient.get('/auth/logout')
  }

  async requestNewPassword(email) {
    return await axiosClient.post(`/auth/request-new-password/`, { email })
  }

  async resetPassword(j) {
    return await axiosClient.post(`/auth/reset-password/`, j)
  }

  open(path, name) {
    const width = 660
    const height = 660
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},left=${left},top=${top}`
    window.open(BASE_URL + path, name, params)
    // window.open(BASE_URL + path, '_self')
  }
  google() {
    this.open('/auth/google', 'google')
  }

  github() {
    this.open('/auth/github', 'github')
  }
}

export default new Api()
