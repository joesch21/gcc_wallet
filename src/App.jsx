// App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Backup from './Backup'
import Success from './Success'
import Cancel from './Cancel' // Optional: create this file
import './App.css'
import Membership from './Membership'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/backup" element={<Backup />} />
    </Routes>
  )
}
