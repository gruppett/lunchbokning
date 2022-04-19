import React, {useState, useEffect} from 'react'
import Spinner from '../components/Spinner/Spinner'

type Props = {}

function PersonalSettings({}: Props) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])


  if (!isLoaded) {
    return <Spinner />
  }

  return (
    <div>PersonalSettings</div>
  )
}

export default PersonalSettings