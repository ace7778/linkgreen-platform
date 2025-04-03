import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Custom hook for fetching consultants
const useConsultants = () => {
  const [consultants, setConsultants] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await axios.get('/api/consultants')
        setConsultants(res.data.data)
      } catch (err) {
        setError('無法取得顧問列表，請稍後再試')
      }
    }
    fetchConsultants()
  }, [])

  return { consultants, error }
}

// Custom hook for form state management
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues)
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }
  return [values, handleChange, setValues]
}

// Utility function for form validation
const validateForm = ({ consultantId, timeSlot, contactInfo }) => {
  if (!consultantId) return '請選擇顧問'
  if (!timeSlot) return '請選擇預約時間'
  if (!contactInfo) return '請填寫聯絡方式'
  return ''
}

const BookingForm = ({ tokenPayload, token }) => {
  const { consultants, error: consultantError } = useConsultants()
  const [form, handleChange, setForm] = useForm({
    consultantId: '',
    timeSlot: '',
    contactInfo: '',
    clientName: tokenPayload.name,
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateForm(form)
    if (validationError) {
      setMessage(validationError)
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/bookings', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage(res.data.message || '預約成功！')
      setForm(prev => ({ ...prev, consultantId: '', timeSlot: '', contactInfo: '' }))
    } catch (err) {
      setMessage(err.response?.data?.message || '預約失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">預約表單</h2>

      {consultantError && <p className="text-red-600 mb-4">{consultantError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Consultant Dropdown */}
        <select
          name="consultantId"
          value={form.consultantId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">選擇顧問</option>
          {consultants.map(({ _id, name }) => (
            <option key={_id} value={_id}>{name}</option>
          ))}
        </select>

        {/* Time Slot Input */}
        <input
          type="datetime-local"
          name="timeSlot"
          value={form.timeSlot}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Contact Info Input */}
        <input
          type="text"
          name="contactInfo"
          placeholder="聯絡方式 (Email 或 電話)"
          value={form.contactInfo}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Client Name (auto-filled, read-only) */}
        <input
          type="text"
          name="clientName"
          value={form.clientName}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-green-600'}`}
        >
          {loading ? '提交中...' : '送出預約'}
        </button>
      </form>

      {/* Display Message */}
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  )
}

export default BookingForm