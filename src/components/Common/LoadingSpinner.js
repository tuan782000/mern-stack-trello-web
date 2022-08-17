import React from 'react'

function LoadingSpinner({ caption }) {
  return (
    <div className="loading-progress">
      <p>{caption ? caption : 'Loading…'}</p>
    </div>
  )
}

export default LoadingSpinner
