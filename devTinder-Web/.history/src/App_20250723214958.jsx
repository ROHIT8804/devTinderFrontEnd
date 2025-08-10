import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
   const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            🎨 Tailwind CSS Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            If you can see styled components below, Tailwind CSS is working perfectly!
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Colors & Typography */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Colors & Typography</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This card tests <span className="font-bold text-purple-600">colors</span>, 
              <span className="italic text-pink-500"> typography</span>, and 
              <span className="underline text-indigo-500">text utilities</span>.
            </p>
          </div>

          {/* Card 2: Flexbox & Spacing */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexbox & Spacing</h3>
            <p className="text-gray-600 text-sm">
              Testing flexbox alignment, spacing utilities, and responsive design.
            </p>
          </div>

          {/* Card 3: Interactive Elements */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Interactive Elements</h3>
            <div className="space-y-4">
              <button
                onClick={() => setCount(count + 1)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Clicked {count} times
              </button>
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`p-3 rounded-lg text-center transition-all duration-300 ${
                  isHovered 
                    ? 'bg-emerald-100 text-emerald-800 transform scale-105' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isHovered ? '🎉 Hover effects work!' : 'Hover over me'}
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Design Test */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Responsive Design Test</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-4 rounded-lg text-center font-medium"
              >
                Item {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Resize your browser to see responsive grid changes: 1 col on mobile, 2 on small screens, 3 on medium, 4 on large.
          </p>
        </div>

        {/* Form Elements */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Form Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Input
              </label>
              <input
                type="text"
                placeholder="Type something..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Dropdown
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Animation & Effects */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Animations & Effects</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="w-16 h-16 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-16 h-16 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 bg-blue-500 rounded-full animate-spin"></div>
            <div className="w-16 h-16 bg-purple-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Built-in animations: bounce, pulse, spin, and ping
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>If all the above elements are styled properly, Tailwind CSS is working! 🎉</p>
        </footer>
      </div>
    </div>
  );
}

export default App
