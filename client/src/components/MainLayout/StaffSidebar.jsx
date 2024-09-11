import React from 'react'
import { useNavigate } from 'react-router-dom'
import LogoSideBar from '../../assets/Srinakharinwirot_Logo_EN_White.png'

function StaffSideBar(props) {
  const { menuItems } = props
  const navigate = useNavigate()

  return (
    
    <div className='fixed w-64 h-full bg-red-800 m-0 items-center justify-between  z-1 pt-10'>
      <div onClick={() => navigate('/management')}>
        <img className='object-scale-down h-40 w-96 bg-red-800 mb-10' src={LogoSideBar} alt="logo" />
      </div>
      <div className='my-4'>
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            onClick={() => navigate(menuItem.link)}
            className='block text-white font-bold text-lg pb-4 bg-red-800 pl-5 cursor-pointer transition duration-200 hover:text-gray-600'
          >
            {menuItem.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StaffSideBar