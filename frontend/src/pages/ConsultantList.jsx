import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import useAuth from '../hooks/useAuth'

const ConsultantList = () => {
    console.log("✅ 顧問清單頁已執行")
  const user = useAuth('admin')
  const [consultants, setConsultants] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/admin/consultants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      .then(res => setConsultants(res.data))
      .catch(err => setError(err.response?.data?.message || '無法取得顧問資料'))
    }
  }, [user])

  const filtered = consultants.filter(c =>
    c.status === 'active' &&
    (c.name.includes(keyword) || c.expertise.includes(keyword) || c.bio.includes(keyword))
  )

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">顧問清單</h1>
      <input
        className="w-full border p-2 mb-6"
        placeholder="搜尋顧問（姓名、專長、簡介）"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      {filtered.length === 0 ? <p>無符合的顧問</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(c => (
            <div key={c._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-1">{c.name}</h2>
              <p className="text-sm text-gray-600 mb-2">專業領域：{c.expertise}</p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{c.bio}</p>
              <Link to={`/consultants/${c._id}`} className="bg-green-600 text-white px-4 py-2 rounded">
                預約顧問
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConsultantList
