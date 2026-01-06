import React from "react";
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import About from './components/About'

export default function App() {

  const location = useLocation();
  const noNavbar = location.pathname === '/register' || location.pathname === '/'
  

  return (
    <>
      {noNavbar ? 
        <Routes>
          <Route path = "/" element = {<Login/>}/>
          <Route path = "/register" element={<Register/>}/>
        </Routes>

        :
        
        <Navbar 
          //the contents are wrapped in the navbar and its contents 
          content={
            <Routes>
              <Route path= "/home" element = {<Home/>} />
              <Route path= "/about" element = {<About/>} />
              
            </Routes>
          }
        />
      
      }
    
      
      
      
    </>
  )
}

