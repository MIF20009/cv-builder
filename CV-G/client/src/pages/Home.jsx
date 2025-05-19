import React from 'react'
import Hero from '../components/Hero'
import PricingCard from '../components/PricingCard'
import CVForm from '../components/CVForm'

const Home = () => {
  return (
    <div>
      <Hero />
      <section className="py-16 bg-base-100">
        <h2 className="text-4xl font-bold text-center mb-10">Choose Your Plan</h2>
        <PricingCard />
      </section>
    </div>
  )
}

export default Home
