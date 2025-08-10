import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
   const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <button className="btn btn-square btn-ghost">☰</button>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">DevTinder</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-square btn-ghost">⋯</button>
      </div>
   </div>
  );
}

export default App
