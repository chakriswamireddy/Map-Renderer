import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import KMLViewer from './components/KMLViewer'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

import mapLottie from './assets/lottie/maps.json'
// import mapPinLottie from './assets/lottie/map-pin.lottie'

import Lottie from 'lottie-react'

function App() {
  const [position, setPosition] = useState({ x: "50%", y: "0%" });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setPosition({ x: `${x}%`, y: `${y}%` });
  };

  return (

    <div className=' min-h-screen flex flex-col items-center pt-4 '
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle at ${position.x} ${position.y}, white , #BBB5BD 2%)`,
      }}
    >
      <div className='flex  items-center ' >

      <h1 className=' text-4xl  font-bold my-6'>KML Extractor</h1>
      <Lottie
        animationData={mapLottie}
        loop={true}
        className='w-10 h-10'
        
        

      />
      </div>
      <KMLViewer />
    </div>
  )
}

export default App
