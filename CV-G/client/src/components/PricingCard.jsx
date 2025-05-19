import React from 'react'
import { useNavigate } from 'react-router-dom'

const PricingCard = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      {/* Free Plan */}
      <div className="card cursor-pointer w-80 bg-base-100 shadow-sm border border-base-300 transition-transform hover:scale-105 hover:shadow-md duration-300">
        <div className="card-body">
          <h2 className="text-3xl font-bold">Free</h2>
          <span className="text-sm text-base-content/70">Perfect for students & first-time users</span>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>✅ Basic AI CV generation</li>
            <li>✅ Limited template options</li>
            <li>✅ Preview before download</li>
            <li className="opacity-50">❌ PDF export</li>
            <li className="opacity-50">❌ Saved history</li>
            <li className="opacity-50">❌ Priority support</li>
          </ul>
          <div className="mt-6">
            <button onClick={() => navigate('/signup')} className="btn btn-outline btn-block">Start for Free</button>
          </div>
        </div>
      </div>

      {/* Premium Plan */}
      <div className="card cursor-pointer w-80 bg-base-100 shadow-lg border-2 border-primary transition-transform hover:scale-105 hover:shadow-xl duration-300">
        <div className="card-body">
          <span className="badge badge-primary w-fit">Most Popular</span>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold">Premium</h2>
            <span className="text-xl">$5<span className="text-sm">/mo</span></span>
          </div>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>✅ All Free features</li>
            <li>✅ PDF & Print-ready export</li>
            <li>✅ Premium templates</li>
            <li>✅ Save multiple versions</li>
            <li>✅ AI-tailored content suggestions</li>
            <li>✅ Priority email support</li>
          </ul>
          <div className="mt-6">
            <button onClick={() => navigate('/signup')} className="btn btn-primary btn-block">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingCard
