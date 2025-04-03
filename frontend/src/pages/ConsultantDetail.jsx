import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import useForm from '../hooks/useForm'
import useAuth from '../hooks/useAuth'

const ConsultantDetail = () => {
  const { id } = useParams()
  const user = useAuth('client')
  const [consultant, setConsultant] = useState(null)
  const [availability, setAvailability] = useState([])
  const [message, setMessage] = useState('')
  const { values, handleChange } = useForm({ clientName: user?.name || '', contactInfo: '', timeSlot: '' })

  useEffect(() => {
    const fetchConsultantDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/consultants/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('client_token')}` },
        })
        setConsultant(res.data.data)
      } catch (err) {
        setMessage('無法取得顧問資訊')
      }
    }

    const fetchAvailability = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/consultants/availability/${id}`)
        setAvailability(res.data)
      } catch (err) {
        setMessage('無法取得可預約時間')
      }
    }

    fetchConsultantDetails()
    fetchAvailability()
  }, [id])

  const handleBook = async e => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ecpay/checkout`, {
        consultantId: id,
        clientName: values.clientName,
        contactInfo: values.contactInfo,
        timeSlot: values.timeSlot,
        price: 1500,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('client_token')}` },
      })

      const blob = new Blob([res.data], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setMessage('已轉導至付款頁')
    } catch (err) {
      setMessage('預約失敗：' + (err.response?.data?.error || '未知錯誤'))
    }
  }

  if (!consultant) return <div className="text-center">載入中...</div>

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{consultant.name}</h2>
      <p className="mb-4 text-sm text-gray-700">{consultant.bio}</p>

      <form onSubmit={handleBook} className="space-y-3">
        <input className="border p-2 w-full" placeholder="姓名" required
          name="clientName" value={values.clientName} onChange={handleChange} />
        <input className="border p-2 w-full" placeholder="聯絡資訊" required
          name="contactInfo" value={values.contactInfo} onChange={handleChange} />
        <select className="border p-2 w-full" required
          name="timeSlot" value={values.timeSlot} onChange={handleChange}>
          <option value="">選擇時間</option>
          {availability.map((t, i) => (
            <option key={i} value={t.time}>{new Date(t.time).toLocaleString()}</option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded">付款並預約</button>
      </form>

      {message && <p className="text-blue-600 mt-4">{message}</p>}
    </div>
  )
}

export default ConsultantDetail
