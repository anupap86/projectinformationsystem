import React, { useState } from 'react'
import Profile from './Profile'
import Frame from '../../../components/MainLayout/Frame'
import { Link } from 'react-router-dom'
import Education from './Education'
import StaffFrame from '../../../components/MainLayout/StaffFrame';
import withAuth from '../../../utils/withAuth';
import Address from './Address'

import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom'

import jwtDecode from 'jwt-decode';

function MainPage() {
  const { id: urlId } = useParams(); // Get the id from the URL


  const { id } = useParams();

  //profile
  const [userData, setUserData] = useState(null);

  const handleUserDataChange = (data) => {
    setUserData(data);
  };

  // education
  const [eduData, setEduData] = useState(null);

  const handleEduDataChange = (data) => {
    setEduData(data);
  };

  //add address
  const [addressData, setAddressData] = useState(null);

  const handleAddressDataChange = (data) => {
    setAddressData(data);
  };

  return (
    <>
      {id ? (
        <StaffFrame selectedUserId={id} />
      ) : (
        <Frame />
      )}
      <div className=' absolute w-3/4 left-80 top-32 -z-10'>
        <div className='relative m-10 '>
          <div className='grid grid-cols-2 gap-8'>
            <div className='bg-black/5 p-4 rounded-lg'>
              <h1 className='font-bold text-xl'>ประวัติส่วนตัว</h1>
              {userData ? (
                <>
                  <p>ชื่อ: {userData.thaiFirstName}</p>
                  <p>นามสกุล: {userData.thaiLastName}</p>
                </>
              ) : (
                <p>ยังไม่มีข้อมูลประวัติส่วนตัว</p>
              )}
              <div className="mt-10">
                <Link
                  className='relative font-bold text-lg pb-4 transition duration-200 hover:text-gray-600 cursor-pointer'
                  to={id ? `/${id}/profile` : '/profile'}
                >
                  {userData ? 'ไปที่หน้าประวัติ' : 'เพิ่มข้อมูลประวัติส่วนตัว'}
                </Link>
              </div>
            </div>
            <div className='bg-black/5  p-4 rounded-lg'>
              <h1 className='font-bold text-xl'>ข้อมูลประวัติการศึกษา</h1>
              {eduData ? (
                <>
                  <p>หลักสูตรการศึกษา: {eduData.course}</p>
                  <p>รหัสนิสิต: {eduData.stuID}</p>
                  <p>เกรดเฉลี่ยนปัจจุบัน: {eduData.gpaCurrent}</p>
                </>
              ) : (
                <p>ยังไม่มีข้อมูลประวัติการศึกษา</p>
              )}
              <div className="mt-4">
                <Link
                  className='relative font-bold text-lg pb-4 transition duration-200 hover:text-gray-600 cursor-pointer'
                  to={id ? `/${id}/education` : '/education'}
                >
                  {eduData ? 'ไปที่ข้อมูลการศึกษา' : 'เพิ่มข้อมูลการศึกษา'}
                </Link>
              </div>
            </div>
            <div className='bg-black/5 p-4 rounded-lg'>
              <h1 className='font-bold text-xl'>ข้อมูลที่อยู่</h1>
              {addressData ? (
                <>
                  <p>แขวง/ตำบล: {addressData.district}</p>
                  <p>เขต/อำเภอ: {addressData.province}</p>
                  <p>จังหวัด: {addressData.subdistrict}</p>
                  <p>ไปรษณีย์: {addressData.zipcode}</p>
                </>
              ) : (
                <p>ยังไม่มีข้อมูลที่อยู่</p>
              )}
              <div className="mt-10">
                <Link
                  className='relative font-bold text-lg pb-4 transition duration-200 hover:text-gray-600 cursor-pointer'
                  to={id ? `/${id}/address` : '/address'}
                >
                  {addressData ? 'ไปที่หน้าที่อยู่' : 'เพิ่มข้อมูลที่อยู่'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* hidden */}
      <div className='hidden'>
        <Profile onUserDataChange={handleUserDataChange} />
      </div>
      <div className='hidden'>
        <Education onUserDataChange={handleEduDataChange} />
      </div>
      <div className='hidden'>
        <Address onUserDataChange={handleAddressDataChange} />
      </div>
    </>
  )
}

export default withAuth(MainPage)