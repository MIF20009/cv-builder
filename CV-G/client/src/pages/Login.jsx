import React from 'react'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-base-100 shadow rounded">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form>
          <input type="email" placeholder="Email" className="input input-bordered w-full mb-4" />
          <input type="password" placeholder="Password" className="input input-bordered w-full mb-4" />
          <p className='cursor-pointer' onClick={() => navigate('/signup')}>Sign Up here</p>
          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
