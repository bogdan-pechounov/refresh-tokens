import axios from 'axios'

export const BASE_URL = 'http://localhost:3001'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

let accessToken

axiosClient.interceptors.response.use((response) => {
  const { data, headers } = response
  //store access token in memory
  accessToken = headers['x-access-token']
  if (accessToken) axiosClient.defaults.headers['X-Access-Token'] = accessToken
  return data
})

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

  async google() {
    return await axiosClient.get('/auth/google')
  }
}

export default new Api()
