import React from 'react'
import CVForm from '../components/CVForm'

const GenerateCV = () => {
  return (
    <div className="min-h-screen">
      <div className="py-10">
        <h2 className="text-4xl font-bold text-center mb-8">Create Your AI-Powered CV</h2>
        <CVForm />
      </div>
    </div>
  )
}

export default GenerateCV
