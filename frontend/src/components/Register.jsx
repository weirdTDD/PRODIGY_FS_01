import { Lock, LucideEye, LucideEyeClosed, Mail, ShieldCheck, User2Icon, UserPlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  id,
  showPasswordToggle = false,
  error,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const inputType = showPasswordToggle && isPasswordVisible ? 'text' : type

  return (
    <div className="mb-5">
      <label htmlFor={id} className="font-medium text-md text-gray-700 mb-2.5 block">
        {label}
      </label>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>

        <input
          id={id}
          type={inputType}
          className={`block w-full pl-11 pr-10 py-3 bg-white rounded-xl font-medium text-gray-600 focus:border-transparent transition-all shadow-sm ${
            error ? 'border border-red-500 focus:outline-red-500' : 'border border-gray-200 focus:outline-blue-500'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <LucideEye size={20} /> : <LucideEyeClosed size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [backendErrors, setBackendErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [agreed, setAgreed] = useState(false)

  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

  useEffect(() => {
    if (!isSubmitted) return

    const newErrors = {}
    if (formData.username.trim().length < 2) newErrors.username = 'Username must be at least 2 characters'
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
  }, [formData, isSubmitted])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    if (backendErrors[id]) {
      setBackendErrors((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setSuccessMessage('')
    setBackendErrors({})

    const finalErrors = {}
    if (formData.username.trim().length < 2) finalErrors.username = 'Username is required'
    if (!validateEmail(formData.email)) finalErrors.email = 'Invalid email address'
    if (formData.password.length < 8) finalErrors.password = 'Password is too short'
    if (formData.password !== formData.confirmPassword) finalErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors)
      return
    }

    if (!agreed) {
      setSuccessMessage('Please agree to the terms and conditions.')
      return
    }

    const registrationData = {
      username: formData.username, // include if your backend expects it
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      role: 'user',
    }

    setIsLoading(true)

    try {
      await axiosInstance.post('/api/register/', registrationData)

      setSuccessMessage('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      if (error?.response?.data) {
        const apiErrors = {}
        const data = error.response.data

        for (const [field, messages] of Object.entries(data)) {
          const msg = Array.isArray(messages) ? messages[0] : messages

          if (field === 'email') apiErrors.email = msg
          else if (field === 'username') apiErrors.username = msg
          else if (field === 'password') apiErrors.password = msg
          else if (field === 'confirm_password') apiErrors.confirmPassword = msg
          else apiErrors._general = msg
        }

        setBackendErrors(apiErrors)
        setSuccessMessage(apiErrors._general || 'Registration failed. Please fix the errors and try again.')
      } else if (error?.request) {
        setSuccessMessage('Network error. Please check your connection.')
      } else {
        setSuccessMessage('An unexpected error occurred.')
      }
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div>
          <div className="bg-blue-600 p-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/50 backdrop-blur-2xl text-blue-600 rounded-2xl mb-4 mt-4">
              <UserPlus size={32} />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-blue-100 mt-2">Join us to start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {successMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-center font-medium ${
                  successMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {successMessage}
              </div>
            )}

            <InputField
              id="username"
              label="Username"
              type="text"
              placeholder="edwardsmith"
              value={formData.username}
              onChange={handleChange}
              icon={<User2Icon size={20} />}
              error={errors.username || backendErrors.username}
            />

            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="edward@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={20} />}
              error={errors.email || backendErrors.email}
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={20} />}
              showPasswordToggle
              error={errors.password || backendErrors.password}
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<ShieldCheck size={20} />}
              showPasswordToggle
              error={errors.confirmPassword || backendErrors.confirmPassword}
            />

            <div className="flex items-center justify-between my-12">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 text-blue-500 border-gray-400 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:underline hover:text-blue-400">
                    Terms
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreed}
              className={`w-full py-3.5 px-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center ${
                isLoading || !agreed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>

            <p className="my-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-400 hover:underline">
                Sign in here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
