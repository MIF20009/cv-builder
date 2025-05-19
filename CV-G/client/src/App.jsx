import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GenerateCV from './pages/GenerateCV'
import About from './pages/About' 

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/generate" element={<GenerateCV />} />
        <Route path="/about" element={<About />} /> 
      </Route>
    </Routes>
  )
}

export default App
