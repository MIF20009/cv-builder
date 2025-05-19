import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Navbar Start (Dropdown) */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow z-[1]"
          >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/generate">Ai Generate CV</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
      </div>

      {/* Navbar Center (Brand) */}
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wide">
          Student-X | CV Builder
        </Link>
      </div>

      {/* Navbar End (CTA) */}
      <div className="navbar-end">
        <button
          onClick={() => navigate('/signup')}
          className="btn btn-outline btn-primary btn-sm rounded-lg"
        >
          Login / Sign Up
        </button>
      </div>
    </div>
  )
}

export default Navbar
