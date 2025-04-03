import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import ConsultantLogin from './ConsultantLogin';
import BookingForm from './BookingForm';

const App = () => (
  <Router>
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/consultant/login" element={<ConsultantLogin />} />
      <Route path="/booking" element={<BookingForm />} />
    </Routes>
  </Router>
);

export default App;
