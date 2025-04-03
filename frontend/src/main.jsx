import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import ConsultantList from './pages/ConsultantList'
import ConsultantDetail from './pages/ConsultantDetail.jsx'

import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/consultants" element={<ConsultantList />} />
        <Route path="/consultants/:id" element={<ConsultantDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
