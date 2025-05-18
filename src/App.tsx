import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GoogleMap from './components/Map'
import NavBar from './components/NavBar'
import Chatbot from './components/Chatbot'
import './styling/main.css'

const testFunc = () => {

}

function App() {

  return (
  <>
      <NavBar></NavBar>
      <Chatbot></Chatbot>
      <GoogleMap></GoogleMap>
  </>
  )
}

export default App
