import React, { useState, useEffect } from 'react';
import Frame from '../../../components/MainLayout/Frame'
import axios from 'axios';
import StaffFrame from '../../../components/MainLayout/StaffFrame';

import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom'

import withAuth from '../../../utils/withAuth';
import jwtDecode from 'jwt-decode';

import Cookies from 'js-cookie'

const getAxiosConfig = () => {
  const token = Cookies.get('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return config;
};

const URL_API = import.meta.env.VITE_API_URL;


const Profile = ({ onUserDataChange }) => {

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const { id: urlId } = useParams(); // Get the id from the URL
  const uid = urlId || decoded.uid; // Use the URL id if available, otherwise use the uid from the token
  const role = decoded.role;
  const { id } = useParams();

  const config = getAxiosConfig();

  const [formData, setFormData] = useState({
    'firstName': '',
    'lastName': '',
    'thaiFirstName': '',
    'thaiLastName': '',
    'birthYear': '',
    'religion': '',
    'phone': '',
    'email': '',
    'occupation': '',
    'income': ''
  }
  );
  const [editedData, setEditedData] = useState({
    'firstName': '',
    'lastName': '',
    'thaiFirstName': '',
    'thaiLastName': '',
    'birthYear': '',
    'religion': '',
    'phone': '',
    'email': '',
    'occupation': '',
    'income': ''
  });
  const [editMode, setEditMode] = useState(false);
  const religions = ['พุทธ', 'คริสต์', 'อิสลาม', 'อื่นๆ'];
  const [isSuccess, setIsSuccess] = useState(false);
  const incomes = ['ต่ำกว่า 5000', '5000-10000', '10000-15000', '15000-20000', 'มากกว่า 20000']

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const config = getAxiosConfig();
        const response = await axios.get(`${URL_API}/collection/${uid}`, config);
        setFormData(response.data.profile);
        onUserDataChange(response.data.profile)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => {
      return {
        ...prevData,
        [name]: value
      };
    });
  };

  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    if (!editedData.firstName || !editedData.lastName || !editedData.email || !editedData.thaiFirstName || !editedData.thaiLastName || !editedData.income || !editedData.birthYear || !editedData.occupation || !editedData.religion) {
      alert("โปรดกรอกข้อมูลให้ครบ");
      setLoading(false);
      return;
    }
    
    if (isNaN(editedData.phone) || editedData.phone.length !== 10) {
      alert("โปรดกรอกหมายเลขโทรศัพท์ 10 หลัก");
      setLoading(false);
      return;
    }
    

    try {
      const requestData = {
        profile: {
          ...editedData,
        },
      };
      // Filter out empty fields in the requestData object
      Object.keys(requestData.profile).forEach((key) => {
        if (requestData.profile[key] === "") {
          delete requestData.profile[key];
        }
      });
      await axios.put(`${URL_API}/collection/${uid}`, requestData, config);
      setFormData(editedData);
      setEditMode(false);
      setIsSuccess(true); // set a state variable to true to display the success message
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData(formData);
  };


  return (
    <>
      {id ? (
        <StaffFrame
          selectedUserId={id}

        />
      ) : (
        <Frame />
      )}
      {isSuccess && ( // display success message if isSuccess state variable is true
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative z-50' role='alert'>
          <strong className='font-bold'>แก้ไขข้อมูล</strong>
          <span className='block sm:inline'> สำเร็จ!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg className='fill-current h-6 w-6 text-green-500' role='button' onClick={() => setIsSuccess(false)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <title>Close</title>
              <path d='M14.348 14.849l-1.415 1.414L10 11.414l-2.93 2.93-1.415-1.414L8.586 10l-2.93-2.93 1.415-1.414L10 8.586l2.93-2.93 1.415 1.414L11.414 10l2.93 2.93z' />
            </svg>
          </span>
        </div>
      )}
      {loading ? (
        <>
          <div className='mx-auto sm:w-3/4 md:w-2/4 fixed inset-x-0 top-80'>
            <div className='text-center p-5'>
              <div role="status">
                <svg aria-hidden="true" className="inline w-10 h-10  mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=' absolute w-0 top-24 -z-10 m-0 left-1/3'>
            <div className='relative m-10 bg border w-max p-10 rounded-lg shadow'>
              <form onSubmit={handleSubmit}>
                <div className='flex'>
                  <div className='mb-4 flex-none '>
                    <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor='firstName'>
                      ชื่อ (อังกฤษ)
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='firstName'
                        name='firstName'
                        type='text'
                        value={editedData?.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <span>{formData?.firstName}</span>
                    )}
                  </div>
                  <div className='mb-4 flex-initial mx-10'>
                    <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor='lastName'>
                      นามสกุล (อังกฤษ)
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='lastName'
                        name='lastName'
                        type='text'
                        value={editedData?.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <span>{formData?.lastName}</span>
                    )}
                  </div>
                </div>

                <div className='flex'>
                  <div className='mb-4 flex-none'>
                    <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor='thaiFirstName'>
                      ชื่อ (ภาษาไทย)
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='thaiFirstName'
                        name='thaiFirstName'
                        type='text'
                        value={editedData?.thaiFirstName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <span>{formData?.thaiFirstName}</span>
                    )}
                  </div>
                  <div className='mb-4 flex-initial mx-10 w-64'>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='thaiLastName'>
                      นามสกุล (ภาษาไทย)
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='thaiLastName'
                        name='thaiLastName'
                        type='text'
                        value={editedData?.thaiLastName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <span>{formData?.thaiLastName}</span>
                    )}
                  </div>
                </div>

                <div className='flex'>
                  <div className='mb-4 flex-none w-44 '>
                    <label className='block text-gray-700 font-bold mb-2 ' htmlFor='birthYear'>
                      ปีเกิด
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='birthYear'
                        name='birthYear'
                        type='date'
                        value={editedData?.birthYear}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                      />
                    ) : (
                      <span>{formData?.birthYear}</span>
                    )}
                  </div>
                  <div className='mb-4 flex-initial mx-10 -mr-8 w-36'>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='religion'>
                      ศาสนา
                    </label>
                    {editMode ? (
                      <select
                        className='shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='religion'
                        name='religion'
                        value={editedData?.religion}
                        onChange={handleInputChange}
                        required
                      >
                        <option value=''>{formData.religion}</option>
                        {religions.map((religion) => (
                          <option key={religion} value={religion}>
                            {religion}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{formData?.religion}</span>
                    )}
                  </div>
                  <div className='mb-4 flex-initial mx- w-56'>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='phone'>
                      โทรศัพท์มือถือ
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='phone'
                        name='phone'
                        type='tel'
                        value={editedData?.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        minLength={10}
                        pattern="\d{10}"
                        title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"
                        required
                      />
                    ) : (
                      <span>{formData?.phone}</span>
                    )}
                  </div>
                </div>
                <div className='flex'>
                  <div className='mb-4 flex-none w-56'>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='email'>
                      Email
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='email'
                        name='email'
                        type='email'
                        value={editedData?.email}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <span>{formData?.email}</span>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className='mb-4 flex-initail  w-32'>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='occupation'>
                      อาชีพ
                    </label>
                    {editMode ? (
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='occupation'
                        name='occupation'
                        type='text'
                        value={editedData?.occupation}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <span>{formData?.occupation}</span>
                    )}
                  </div>
                  <div className='mb-4 flex-initial mx-5 w-36'>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='income'>
                      รายได้จากผู้ปกครอง
                    </label>
                    {editMode ? (
                      <select
                        className=' shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='income'
                        name='income'
                        value={editedData?.income}
                        onChange={handleInputChange}
                        required
                      >
                        <option value=''></option>
                        {incomes.map((income) => (
                          <option key={income} value={income}>
                            {income}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{formData?.income}</span>
                    )}

                  </div>
                </div>
                <div className='mb-4'>
                  {role !== 'teacher' && !editMode && (
                    <button
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                      type='button'
                      onClick={() => setEditMode(true)}
                    >
                      แก้ไขข้อมูล
                    </button>
                  )}
                  { role !== 'teacher' && editMode && (
                    <>
                      <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
                        type='button'
                        onClick={handleSubmit}
                      >
                        ยืนยัน
                      </button>
                      <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='button'
                        onClick={() => {
                          setEditMode(false)
                        }}
                      >
                        ยกเลิก
                      </button>
                    </>

                  )}
                </div>

              </form>
            </div >
          </div >
        </>
      )}


    </>
  )
}

export default withAuth(Profile)