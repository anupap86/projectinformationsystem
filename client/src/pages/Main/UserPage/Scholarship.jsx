import React, { useEffect, useState } from 'react'
import Frame from '../../../components/MainLayout/Frame'
import axios from 'axios';
import ModalScholar from '../../../components/modal/main/ModalScholar';
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

const Scholarship = () => {

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const { id: urlId } = useParams(); // Get the id from the URL
  const uid = urlId || decoded.uid; // Use the URL id if available, otherwise use the uid from the token
  const role = decoded.role;
  const { id } = useParams();

  const config = getAxiosConfig();

  const [editingScholar, setEditingScholar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    'year': '',
    'name': '',
    'type': '',
    'issuer': ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL_API}/collection/${uid}`, config)
        const data = response.data.scholarship;
        setFormData(data);
        console.log(data)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])

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

  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    let timer;
    if (isEdit) {
      timer = setTimeout(() => {
        setIsEdit(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isEdit]);


  const [isDeleted, setIsDeleted] = useState(false);
  useEffect(() => {
    let timer;
    if (isDeleted) {
      timer = setTimeout(() => {
        setIsDeleted(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isDeleted])

  const handleAddScholarship = async (newScholar) => {
    setLoading(true);
    const config = getAxiosConfig()
    try {
      const newId = `${newScholar.name}-${Date.now().toString()}`;
      await axios.post(`${URL_API}/collection/${uid}`, {
        scholarship: {
          [newId]: {
            ...newScholar,
          },
        },
      }, config);
      setFormData((prevState) => ({ ...prevState, [newId]: newScholar }));
      setShowModal(false);
      setIsSuccess(true);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const handleEditScholarship = async (updatedScholar) => {
    setLoading(true);
    try {
      await axios.put(
        `${URL_API}/collection/${uid}`,
        {
          scholarship: {
            [updatedScholar.id]: updatedScholar,
          },
        }, config
      );
      setFormData((prevState) => {
        const newState = { ...prevState };
        newState[updatedScholar.id] = updatedScholar;
        return newState;
      });
      setEditingScholar(null);
      setShowModal(false);
      setIsEdit(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScholarship = async (scholarId) => {
    setLoading(true);
    try {
      await axios.delete(`${URL_API}/collection/${uid}/scholarship/${scholarId}`, config);
      setFormData((prevState) => {
        const newState = { ...prevState };
        delete newState[scholarId];
        return newState;
      });
      setIsDeleted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {id ? (
        <StaffFrame selectedUserId={id} />
      ) : (
        <Frame />
      )}

      {isSuccess && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative z-50' role='alert'>
          <strong className='font-bold'>เพิ่มข้อมูล</strong>
          <span className='block sm:inline'> สำเร็จ!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg className='fill-current h-6 w-6 text-green-500' role='button' onClick={() => setIsSuccess(false)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <title>Close</title>
              <path d='M14.348 14.849l-1.415 1.414L10 11.414l-2.93 2.93-1.415-1.414L8.586 10l-2.93-2.93 1.415-1.414L10 8.586l2.93-2.93 1.415 1.414L11.414 10l2.93 2.93z' />
            </svg>
          </span>
        </div>
      )}
      {isEdit && (
        <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative z-50' role='alert'>
          <strong className='font-bold'>แก้ไขข้อมูล</strong>
          <span className='block sm:inline'> สำเร็จ!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg className='fill-current h-6 w-6 text-yellow-500' role='button' onClick={() => setIsSuccess(false)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <title>Close</title>
              <path d='M14.348 14.849l-1.415 1.414L10 11.414l-2.93 2.93-1.415-1.414L8.586 10l-2.93-2.93 1.415-1.414L10 8.586l2.93-2.93 1.415 1.414L11.414 10l2.93 2.93z' />
            </svg>
          </span>
        </div>
      )}
      {isDeleted && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative z-50' role='alert'>
          <strong className='font-bold'>ลบข้อมูล</strong>
          <span className='block sm:inline'> สำเร็จ!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg className='fill-current h-6 w-6 text-red-500' role='button' onClick={() => setIsSuccess(false)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
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
            {role !== 'teacher' && (
              <button
                onClick={() => {
                  setEditingScholar(null);
                  setShowModal(true);
                }}
                className="bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded"
              >
                เพิ่มทุนการศึกษา
              </button>
            )}
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">ชื่อทุน</th>
                  <th className="px-4 py-2">ประเภททุน</th>
                  <th className="px-4 py-2">ผู้มอบทุน</th>
                  <th className="px-4 py-2">ชั้นปีที่ได้รับ</th>
                </tr>
              </thead>
              {formData && Object.keys(formData).map((key, index) => (
                <tbody key={key}>
                  <tr className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} align-top`}>
                    <td className="border px-4 py-2">{formData[key].name}</td>
                    <td className="border px-4 py-2">{formData[key].type}</td>
                    <td className="border px-4 py-2">{formData[key].issuer}</td>
                    <td className="border px-4 py-2">{formData[key].year}</td>
                    {role !== 'teacher' && (
                      <td className="border-y px-4 py-2">
                        <button
                          onClick={() => {
                            setEditingScholar({ ...formData[key], id: key });
                            setShowModal(true);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-700 duration-100 text-white font-bold py-2 px-4 rounded">
                          แก้ไข
                        </button>
                      </td>
                    )}
                    {role !== 'teacher' && (
                      <td className="border-y border-r px-4 py-2">
                        <button
                          onClick={() => handleDeleteScholarship(key)}
                          className="bg-red-500 hover:bg-red-700 duration-100 text-white font-bold py-2 px-4 rounded">
                          ลบ
                        </button>
                      </td>
                    )}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
      <ModalScholar
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddScholarship}
        onEdit={handleEditScholarship}
        editingScholar={editingScholar}
      />
    </>
  )
}

export default withAuth(Scholarship)