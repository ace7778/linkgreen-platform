import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const LandingPage = () => {
  const user = useAuth('consultant')

  return (
    <div className="min-h-screen bg-green-50 text-gray-800">
      <header className="p-6 flex justify-between items-center bg-white shadow">
        <h1 className="text-2xl font-bold text-green-700">LinkGreen 顧問平台</h1>
        {user ? (
          <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded">顧問儀表板</Link>
        ) : (
          <Link to="/consultant/login" className="bg-green-600 text-white px-4 py-2 rounded">顧問登入</Link>
        )}
      </header>

      <main className="px-6 py-12 max-w-5xl mx-auto">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">串聯綠色未來，找對顧問從這裡開始</h2>
          <p className="text-lg text-gray-600">
            LinkGreen 是專為永續、環境與綠色產業打造的顧問媒合平台，讓你快速預約專業人才，解決產業痛點。
          </p>
          <Link to="/consultants" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded shadow">
            立即預約顧問
          </Link>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        © 2025 LinkGreen Inc. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage
