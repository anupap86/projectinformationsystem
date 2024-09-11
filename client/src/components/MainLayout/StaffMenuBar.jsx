import React from 'react';
import { useNavigate } from 'react-router-dom';


const StaffMenuBar = (props) => {
    const { indexMenuItems } = props;
    const navigate = useNavigate();
    return (
        <>
        <div className='fixed sm:m-0 w-full  bg-gray-800 sm:left-64 z-50 shadow-inner top-16'>
        <div className='flex flex-row mr-20 pl-10 space-x-5 bg-slate-600 align-middle h-9 border-t border-gray-800'>
            {indexMenuItems.map((menuItem, index) => (
                <button
                    key={index}
                    className=' text-white font-bold text-sm pl-5 transition duration-200 hover:text-black'
                    onClick={() => navigate(menuItem.url)}
                >
                    {menuItem.title}
                </button>
            ))}
        </div>
        </div>
        
        </>
    )
}

export default StaffMenuBar