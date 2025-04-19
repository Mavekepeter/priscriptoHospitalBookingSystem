import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllApointment = () => {
  const { atoken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (atoken) {
      getAllAppointments()
    }
  }, [atoken])

  // 👇 Function to export CSV
  const handleDownloadCSV = () => {
    const header = ['#', 'Patient Name', 'Age', 'Date', 'Time', 'Doctor Name', 'Fees', 'Status']
  
    const rows = appointments.map((item, index) => [
      index + 1,
      `  ${item.userData.name}  `,
      `  ${calculateAge(item.userData.dob)}  `,
      `\t${slotDateFormat(item.slotDate)}\t`, // date with tabs to force space
      `  ${item.slotTime}  `,
      `  ${item.docData.name}  `,
      `\t${currency}${item.amount}\t`,
      `  ${item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Active'}  `
    ])
  
    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
  
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'appointments_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  
  

  return (
    <div className='w-full max-w-6xl m-5'>
      <div className='flex justify-between items-center mb-3'>
        <p className='text-lg font-medium'>All appointments</p>
        <button
          onClick={handleDownloadCSV}
          className='bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700'
        >
          Download Report
        </button>
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" />
              <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllApointment
