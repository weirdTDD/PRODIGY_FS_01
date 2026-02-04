import React from "react"
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Navbar from './components/Navbar'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import About from './components/About'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const AuthRedirect = () => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const isAuthenticated = Boolean(accessToken || refreshToken)
    return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />
  }

  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Navbar content={<Outlet />} />}>
          <Route path="/home" element={<Home />} />
          <Route element={<ProtectedRoute requireAdmin forbiddenMessage="not admin" forbiddenRedirectTo="/home" />}>
            <Route path="/about" element={<About />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
