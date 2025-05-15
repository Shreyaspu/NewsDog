import React  from 'react'
import loading from '../assets/loading.gif.gif'  // Fixed import path to match actual filename

const  Spinner = () => {
  
    return (
      <div className="text-center my-3">
        <img 
          src={loading} 
          alt="loading" 
          style={{
            width: '50px',
            margin: 'auto',
            display: 'block'
          }} 
        />
      </div>
    )
}

export default Spinner