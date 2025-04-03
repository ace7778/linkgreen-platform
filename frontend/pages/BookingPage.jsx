import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

// Custom hook for form handling
const useForm = (initialState) => {
  const [form, setForm] = useState(initialState)
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  return [form, handleChange]
}

// Utility function for error handling
const getErrorMessage = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401: return '帳號或密碼錯誤，請重新輸入'
      case 403: return '您沒有權限訪問此頁面'
      case 500: return '伺服器錯誤，請稍後再試'
      default: return error.response.data.error || '發生未知錯誤'
    }
  } else if (error.request) {
    return '無法連接伺服器，請檢查您的網路連線'
  } else {
    return '發生未知錯誤，請稍後再試'
  }
}

const ConsultantLogin = () => {
  const navigate = useNavigate()
  const [form, handleChange] = useForm({ email: '', password: '' })
  const [message, setMessage] = useState('')

  // Check token expiration and redirect accordingly
  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (token) {
      const { exp } = jwtDecode(token)
      if (exp * 1000 < Date.now()) {
        localStorage.removeItem('consultant_token')
        navigate('/login')
      } else {
        navigate('/dashboard')
      }
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/consultants/auth/login', form, {
        withCredentials: true // Recommended: backend sets httpOnly cookie
      })

      // If backend uses httpOnly cookies, no need to store token in localStorage
      // localStorage.setItem('consultant_token', res.data.token)

      navigate('/dashboard')
    } catch (err) {
      setMessage(getErrorMessage(err))
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">顧問登入</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="密碼"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          登入
        </button>
      </form>
      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
    </div>
  )
}

export default ConsultantLogin