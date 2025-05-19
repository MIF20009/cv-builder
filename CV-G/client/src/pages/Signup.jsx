import React from 'react'
import { useNavigate } from 'react-router-dom'


const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-base-100 shadow rounded">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form>
          <input type="text" placeholder="Name" className="input input-bordered w-full mb-4" />
          <input type="email" placeholder="Email" className="input input-bordered w-full mb-4" />
          <input type="password" placeholder="Password" className="input input-bordered w-full mb-4" />
          <p className='cursor-pointer' onClick={() => navigate('/login')}>Login here</p>
          <button className="btn btn-primary w-full">Create Account</button>
        </form>
      </div>
    </div>
  )
}

export default Signup
