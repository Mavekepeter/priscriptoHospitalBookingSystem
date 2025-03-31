import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Doctors = () => {
  const { speciality } = useParams()
  
  const {doctors} = useContext(AppContext);
  const [filterDoc,setFilterDoc] = useState([]);
  const [showFilter, setshowFilter] = useState(false)
  const navigate = useNavigate()


  const applyFilter = ()=>{
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    }else{
      setFilterDoc(doctors)
    }
  }
  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])
  return (
    <div >
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setshowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex': 'hidden sm:flex'}`}>
        <p onClick={()=>speciality === 'Livestock Vet' ? navigate('/doctors'): navigate('/doctors/Livestock Vet')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=== "Livestock Vet" ? "bg-indigo-100 text-black":""}`}>Livestock Vet</p>
          <p onClick={()=>speciality === 'Theriogenologist' ? navigate('/doctors'): navigate('/doctors/Theriogenologist')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=== "Theriogenologist" ? "bg-indigo-100 text-black":""}`}>Theriogenologist</p>
          <p onClick={()=>speciality === 'Vet Dermatologist' ? navigate('/doctors'): navigate('/doctors/Vet Dermatologist')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=== "Vet Dermatologist" ? "bg-indigo-100 text-black":""}`}>Vet Dermatologist</p>
          <p onClick={()=>speciality === 'Vet Neonatologist' ? navigate('/doctors'): navigate('/doctors/Vet Neonatologist')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=== "Vet Neonatologist" ? "bg-indigo-100 text-black":""}`}>Vet Neonatologist</p>
          <p onClick={()=>speciality === 'Vet Neurologist' ? navigate('/doctors'): navigate('/doctors/Vet Neurologist')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=== "Vet Neurologist" ? "bg-indigo-100 text-black":""}`}>Vet Neurologist</p>
          <p onClick={()=>speciality === 'Vet Gastroenterologist' ? navigate('/doctors'): navigate('/doctors/Vet Gastroenterologist')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=== "Vet Gastroenterologist" ? "bg-indigo-100 text-black":""}`}>Vet Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item,index)=>(
              <div onClick={()=>navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                  <img className='bg-blue-50' src={item.image} alt="" />
                  <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' :'text-gray-500'} `}>
                            <p className={`w-2 h-2 ${item.available ? 'bg-green-500': 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available':'Not available'}</p>
                        </div>
                      <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                      <p className='text-gray-600 text-sm'>{item.speciality}</p>
                  </div>
              </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors