import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Myprofile from './pages/Myprofile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MpesaPayment from './pages/MpesaPayment'

const App = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white">
    
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={<Myprofile/>}/>
        <Route path='/my-appointments' element={<MyAppointment/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
        <Route path="/pay-mpesa" element={<MpesaPayment />} />

       </Routes>
       <Footer/>
    </div>
    </div>
  )
}

export default App