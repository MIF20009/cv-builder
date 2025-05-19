import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]"> {/* Adjust height to leave room for footer */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
