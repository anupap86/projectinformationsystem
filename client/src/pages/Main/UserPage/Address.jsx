import React, { useState, useEffect } from 'react';
import Frame from '../../../components/MainLayout/Frame';
import InputAddress from 'react-thailand-address-autocomplete';
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


const Address = ({ onUserDataChange }) => {

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const { id: urlId } = useParams(); // Get the id from the URL
  const uid = urlId || decoded.uid; // Use the URL id if available, otherwise use the uid from the token
  const role = decoded.role;
  const { id } = useParams();

  const config = getAxiosConfig();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subdistrict: '',
    district: '',
    province: '',
    zipcode: '',
  });
  const [editedData, setEditedData] = useState({
    subdistrict: '',
    district: '',
    province: '',
    zipcode: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL_API}/collection/${uid}`, config);
        const data = response.data.address;
        setFormData(data);
        onUserDataChange(data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();

    if (!editedData.district || !editedData.province || !editedData.subdistrict || !editedData.zipcode) {
      alert("โปรดกรอกข้อมูลให้ครบ");
      setLoading(false);
      return;
    }
    try {
      const requestData = {
        address: {
          ...editedData,
        }
      };
      Object.keys(requestData.address).forEach((key) => {
        if (requestData.address[key] === "") {
          delete requestData.address[key];
        }
      });
      await axios.put(`${URL_API}/collection/${uid}`, requestData, config);
      setFormData(editedData);
      setEditMode(false);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const onSelect = (fullAddress) => {
    const { subdistrict, district, province, zipcode } = fullAddress;
    setFormData((prevState) => ({
      ...prevState,
      subdistrict,
      district,
      province,
      zipcode
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedData(formData);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData(formData);
  };



  return (
    <>
      {id ? (
        <StaffFrame selectedUserId={id} />
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
        <div className='absolute w-0 top-24 -z-10 m-0 left-1/3'>
          <div className='relative m-10 bg border w-max p-10 rounded-lg shadow'>
            <form onSubmit={handleSubmit} className='grid '>
              <div className="">
                <div className="mb-4 mx-5 flex">
                  <label className='text-gray-700 font-bold mb-2 w-32 flex-none' htmlFor="แขวง/ตำบล">
                    แขวง/ตำบล
                  </label>
                  {editMode ? (
                    <InputAddress
                      address="subdistrict"
                      id='subdistrict'
                      name='subdistrict'
                      value={editedData?.subdistrict}
                      onChange={handleInputChange}
                      onSelect={onSelect}
                    />
                  ) : (
                    <span className='flex-initial w-28 border rounded-md pl-2 pt-2 text-sm'>{formData?.subdistrict}</span>
                  )}

                </div>
                <div className="mb-4 mx-5 flex">
                  <label className='text-gray-700 font-bold mb-2 w-32 flex-none' htmlFor="เขต / อำเภอ">
                    เขต/อำเภอ
                  </label>
                  {editMode ? (
                    <InputAddress
                      address="district"
                      id='district'
                      name='district'
                      value={editedData?.district}
                      onChange={handleInputChange}
                      onSelect={onSelect}
                    />
                  ) : (
                    <span className='flex-initial w-28 border rounded-md pl-2 pt-2 text-sm'>{formData?.district}</span>
                  )}
                </div>
                <div className="mb-4 mx-5 flex">
                  <label className='text-gray-700 font-bold mb-2 w-32 flex-none' htmlFor="จังหวัด">
                    จังหวัด
                  </label>
                  {editMode ? (
                    <InputAddress
                      address="province"
                      id='province'
                      name='province'
                      value={editedData?.province}
                      onChange={handleInputChange}
                      onSelect={onSelect}
                    />
                  ) : (
                    <span className='flex-initial w-28 border rounded-md pl-2 pt-2 text-sm'>{formData?.province}</span>
                  )}
                </div>
                <div className="mb-4 mx-5 flex">
                  <label className='text-gray-700 font-bold mb-2 w-32 flex-none' htmlFor="จังหวัด">
                    ไปรษณีย์
                  </label>
                  {editMode ? (
                    <InputAddress
                      address="zipcode"
                      id='zipcode'
                      name='zipcode'
                      value={editedData?.zipcode}
                      onChange={handleInputChange}
                      onSelect={onSelect}
                    />
                  ) : (
                    <span className='flex-initial w-28 border rounded-md pl-2 pt-2 text-sm'>{formData?.zipcode}</span>
                  )}
                </div>
                <div className='mb-4 justify-between'>
                  {role !== 'teacher' && !editMode && (
                    <button
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                      type='button'
                      onClick={() => setEditMode(true)}
                    >
                      แก้ไขข้อมูล
                    </button>
                  )}
                  {role !== 'teacher' && editMode && (
                    <>
                      <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
                        type='button'
                        onClick={handleSubmit}
                      >
                        ยืนยัน
                      </button>
                    </>

                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  )
}

export default withAuth(Address)