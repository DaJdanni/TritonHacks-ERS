import GoogleMap from './components/Map'
import NavBar from './components/NavBar'
import Chatbot from './components/Chatbot'
import './styling/main.css'


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
