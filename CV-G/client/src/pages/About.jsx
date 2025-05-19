import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">What is Student-X?</h1>
        <p className="text-base-content/70 text-lg">
          Student-X is an AI-powered CV builder built to help students and early professionals
          generate clean, modern, and job-ready resumes — instantly.
        </p>
      </div>

      {/* Our Mission */}
      <div className="bg-base-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-base-content/80">
          We believe every student deserves the chance to present themselves professionally without struggling with design tools or outdated templates.
          Student-X removes the friction and lets you focus on your journey — we handle the CV.
        </p>
      </div>

      {/* Why Student-X */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Why Student-X?</h2>
        <ul className="list-disc list-inside space-y-2 text-base-content/90">
          <li>✅ Built specifically for students and fresh grads</li>
          <li>✅ Instant CV generation powered by GPT-4o</li>
          <li>✅ One-click PDF downloads with clean design</li>
          <li>✅ Simple, mobile-friendly interface</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button onClick={() => navigate('/generate')} className="btn btn-primary px-8">
          Generate Your CV
        </button>
      </div>
    </div>
  )
}

export default About
