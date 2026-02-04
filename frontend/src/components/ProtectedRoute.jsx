import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const hasAuthToken = () => {
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')
  return Boolean(accessToken || refreshToken)
}

const getStoredUser = () => {
  const userJson = localStorage.getItem('user')
  if (!userJson) return null
  try {
    return JSON.parse(userJson)
  } catch {
    return null
  }
}

const isSuperuser = (user) => {
  if (!user) return false
  return user.is_superuser === true
}

export default function ProtectedRoute({
  redirectTo = '/login',
  requireAdmin = false,
  forbiddenRedirectTo = '/home',
  forbiddenMessage,
  forbiddenElement,
}) {
  const location = useLocation()

  if (!hasAuthToken()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  if (requireAdmin) {
    const user = getStoredUser()
    if (!isSuperuser(user)) {
      if (forbiddenElement) return forbiddenElement
      if (forbiddenMessage) {
        return (
          <div
            role="alert"
            className="max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {forbiddenMessage}
          </div>
        )
      }
      return <Navigate to={forbiddenRedirectTo} replace />
    }
  }

  return <Outlet />
}
