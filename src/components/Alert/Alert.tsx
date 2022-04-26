import React, { Key } from 'react'

type Props = {
  error: string[]
  setError: ({}: any) => void
}

function Alert({error, setError}: Props) {
  console.log("err", error)
  return (
    <div className='p-2 bg-red-100'>
      <div className='text-right'>
        <span className='material-icons-outlined' onClick={() => setError(false)}>
          close
        </span>
      </div>
      {error.map((i, key: Key) => (
        <p className='text-red-500' key={key}>{i}</p>
      ))}
    </div>
  )
}

export default Alert