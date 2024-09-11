import React from 'react'
import Logos from '../../assets/Srinakharinwirot_Logo_TH_Color.png'
import { Link } from 'react-router-dom'

const TermHeaderBar = () => {
    return (
        <>
            <div className='fixed sm:m-0 w-full  border-b-2 z-40 shadow-lg justify-center bg-white'>
                <Link to="/">
                <img src={Logos} className='object-center h-24 mx-auto' />
                </Link>
            </div>
        </>
    )
}

export default TermHeaderBar