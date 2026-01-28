import { Lock, LogIn, LucideEye, LucideEyeClosed, User2Icon } from 'lucide-react'
import React, { useState } from 'react'
import axiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'

const InputField =({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  id,
  showPasswordToggle = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  };

  const inputType = showPasswordToggle && isPasswordVisible ? 'text' : type;

  return (
    <div className='mb-5'>
      <label htmlFor={id} className='font-medium text-md text-gray-700 mb-2.5'>
        {label}
      </label>
      <div className='relative group '>
        {/*Icon*/}
        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors'>
          {icon}
        </div>

        <input 
          id={id}
          type={inputType}
          className="block w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-600 focus:outline-blue-500 focus:border-transparent transition-all shadow-sm "
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />

        {/*Password Outline and Icon Toggle*/}
        {showPasswordToggle && (
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 pr-3.5 items-center text-gray-400 hover:text-gray-600 focus:outline-none'
          >
            {isPasswordVisible ? <LucideEye size={20} /> : <LucideEyeClosed size={20}/> }
          </button>
        )}
      </div>
    </div>
  )
};




export default function Login () {


  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [IsLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e) => {
  e.preventDefault();
   setErrorMsg('')
   setIsLoading(true)
  
  const loginData = {
    email: email,
    password: password
  };
  
  try {
    const response = await axiosInstance.post('/login', loginData);
    
    // Store tokens
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect to dashboard
    navigate('/home');
  } catch (error) {
    // Handle login errors
    const msg =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    'Login failed. Please try again.'

    setErrorMsg(msg)
    console.error('Login error:', error);
  }finally {
    setIsLoading(false)
  }
};


  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className= "h-2 bg-blue-500 w-full" />
         
        <div>
          {/*Header*/}
          <div className='mb-8 text-center'>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-blue-600 rounded-full mb-4 mt-4">
              <LogIn size={32} />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Welcome back</h1>
            <p className='text-gray-600 mt-2'> Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleLogin} className='px-8'>
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<User2Icon size={20}/>}
            />


            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20}/>}
              showPasswordToggle
            />

            {errorMsg ? (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                {errorMsg}
              </div>
            ) : null}

            <div className='flex items-center justify-between my-12'>
              <div className='flex items-center'>
                <input id='remember-me' type="checkbox" className='h-4 w-4 text-blue-500 border-gray-400 rounded-3xl cursor-pointer'/>
                <label htmlFor="remember-me" className='ml-2 block text-sm text-gray-600 cursor-pointer'>Remember me </label>

              </div>
              <a className='text-sm font-medium text-blue-600 hover:text-blue-400 hover:underline' href="#">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={IsLoading}
              className= {`w-full py-3.5 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-300 focus:outline-none focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center  ${
                IsLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {IsLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign in'
              )}

            </button>

            <p className='my-8 text-center text-sm text-gray-600'>
              Don't have an account?{''}
              <a href="/register" className='font-semibold text-blue-600 hover:text-blue-400 hover:underline'>
                Create account
              </a>
            </p>

          </form>
        </div>      

      
      </div>
    </div>
  )
}


