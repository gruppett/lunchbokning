import React from 'react'

function Spinner() {
  return (
    <div className='flex justify-center items-center text w-full h-full'>
      <span className="block material-icons-outlined animate-spin text-5xl">
        motion_photos_on
      </span>
    </div>
  )
}

export default Spinner