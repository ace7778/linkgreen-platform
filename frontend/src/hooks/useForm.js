// hooks/useForm.js
import { useState } from 'react'

const useForm = (initialState) => {
  const [form, setForm] = useState(initialState)
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  return [form, handleChange]
}

export default useForm
