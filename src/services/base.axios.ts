import axios from 'axios'
import Cookies from 'js-cookie'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    Authorization: `${Cookies.get('access_token')}`,
  },
})
