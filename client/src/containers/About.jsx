import React from 'react'
import { useSelector } from 'react-redux'

const About = () => {
    const {isAuthenticated, loading, error} = useSelector((state)=> state.auth)
    console.log({isAuthenticated, loading, error})


    return <>{[isAuthenticated, loading, error]}</>

  return (
    <div>About</div>
  )
}

export default About