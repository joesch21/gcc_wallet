import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Backup from './Backup'
import Success from './Success'
import Cancel from './Cancel'
import Membership from './Membership'
import WalletOverview from './WalletOverview'
import CondorGPT from './components/CondorGPT' // ✅ Import the assistant
import './App.css'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/wallet" element={<WalletOverview />} />
      </Routes>

      {/* ✅ Floating assistant visible on all routes */}
      <CondorGPT />
    </>
  )
}
