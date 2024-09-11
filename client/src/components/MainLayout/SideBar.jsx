import React from 'react'
import { Link } from 'react-router-dom'
import LogoSideBar from '../../assets/Srinakharinwirot_Logo_EN_White.png'

function SideBar(props) {
  const { menuItems } = props

  return (
    <div className='fixed w-64 h-full bg-red-800 m-0 items-center justify-between  z-1 pt-10'>
      <Link to="/index">
        <img className='object-scale-down h-40 w-96 bg-red-800 mb-10' src={LogoSideBar} alt="logo" />
      </Link>
      <div className='my-4'>
        {menuItems.map((menuItem, index) => (
          <Link
            key={index}
            to={menuItem.link}
            className='block text-white font-bold text-lg pb-4 bg-red-800 pl-5 transition duration-200 hover:text-gray-600'
          >
            {menuItem.title}
          </Link>
        ))}
      </div>
      
    </div>
  )
}

export default SideBar  
