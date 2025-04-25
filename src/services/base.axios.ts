import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    Authorization: `Bearer ${Cookies.get('access_token')}`,
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ➕ Refresh-token logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const refreshToken = Cookies.get('refresh_token')
    const is401 = error.response?.status === 401

    if (originalRequest.url.includes('/auth/refresh-token') && is401) {
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      Router.push('/signin')
      return Promise.reject(error)
    }
    if (is401 && !originalRequest._retry && refreshToken) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh-token`,
          {
            refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const newToken = response.data?.accessToken
        Cookies.set('access_token', newToken)

        processQueue(null, newToken)
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        return axiosInstance(originalRequest)
      } catch (err) {
        processQueue(err, null)
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        Router.push('/signin')
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
