
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoDataCard = (message) => {
    const navigate = useNavigate();
    console.log("NoDataCard message", message);
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div 
        className="w-96 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        style={{ backgroundColor: '#28282B' }}
      >
        <div className="relative">
          <img
            src="https://img.freepik.com/free-vector/flat-design-no-data-illustration_23-2150527142.jpg"
            alt="No requests available"
            className="w-full h-48 object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-4">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          
          {/* <h2 className="text-2xl font-bold text-white mb-3">
           {message || "No Data Found!"}
          </h2> */}
          
          <p className="text-gray-300 leading-relaxed mb-6">
            {message?.message || "You don't have any pending connection requests at the moment. Check back later for new networking opportunities!"}
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/feed')} 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Explore More
            </button>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>
    </div>
    
  )
}

export default NoDataCard