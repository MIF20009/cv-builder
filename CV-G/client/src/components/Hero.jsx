// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import backgroundImage from '../assets/background2.png'

// const Hero = () => {
//   const navigate = useNavigate()

//   return (
//     <div>
//       <div
//         className="hero min-h-screen"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//         }}
//       >
//         <div className="hero-overlay bg-opacity-60"></div>
//         <div className="hero-content text-neutral-content text-center">
//           <div className="max-w-md">
//             <h1 className="mb-5 text-5xl font-bold">Generate Your CV Instantly</h1>
//             <p className="mb-5">
//               Build a professional, AI-powered CV in seconds. Just fill in your details and let us handle the rest.
//             </p>
//             <button
//               onClick={() => navigate('/generate')}
//               className="btn btn-primary"
//             >
//               Create Your CV
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Hero

import React from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/background2.png'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="w-full text-black px-10 md:px-32 lg:px-52">
        <div className="max-w-2xl ml-125 mb-50">
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-extrabold transition-transform duration-300 hover:scale-105">
            Generate Your CV Instantly
          </h1>
          <p className="mb-6 text-lg md:text-xl lg:text-2xl transition-colors duration-300 hover:scale-105">
            Build a professional, AI-powered CV in seconds. Just fill in your details and let us handle the rest.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="btn hover:scale-110 bg-black text-white transition-transform duration-300"
          >
            Create Your CV
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
