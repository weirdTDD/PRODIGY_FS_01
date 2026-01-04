
import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import About from './components/About'

function App() {
  

  return (
    <>
    <Navbar 
      content={
        <Routes>
          <Route path= "/home" element = {<Home/>} />
          <Route path= "/about" element = {<About/>} />
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/register" element={<Register/>}/>
        </Routes>
      }
    />
      
      
    </>
  )
}

export default App
