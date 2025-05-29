import axios from 'axios'
import Cookies from 'js-cookie'

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'ngrok-skip-browser-warning': '69420',
    },
})

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

if (typeof window !== 'undefined') {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log('Response error:', error.response?.status, error.message)

            const is401 = error.response?.status === 401

            if (is401) {
                console.log('401 detected, redirecting to signin')

                Cookies.remove('access_token')
                Cookies.remove('refresh_token')

                // Immediate redirect
                window.location.replace('/signin')

                return Promise.reject(error)
            }

            return Promise.reject(error)
        }
    )
}

export default axiosInstance