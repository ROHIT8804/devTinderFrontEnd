import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
   const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <p className="text-2xl text-red-500 font-bold">Test Text</p>

  );
}

export default App
