import React, { useState, useEffect } from 'react'
import Frame from '../../../components/MainLayout/Frame'
import axios from 'axios'
import ModalActivity from '../../../components/modal/main/ModalActivity'
import StaffFrame from '../../../components/MainLayout/StaffFrame';

import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom'

import jwtDecode from 'jwt-decode';
import withAuth from '../../../utils/withAuth';

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


const Activity = () => {

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const { id: urlId } = useParams(); // Get the id from the URL
  const uid = urlId || decoded.uid; // Use the URL id if available, otherwise use the uid from the token
  const role = decoded.role;
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [ModalType, setModalType] = useState('null')

  const [loading, setLoading] = useState(false);

  const config = getAxiosConfig();

  const handleOpenModal = (type) => {
    setActivityData({
      date: '',
      activity_name: '',
      institute_name: ''
    })
    setShowModal(true);
    setModalType(type);
  }

  const handleEdit = (type, id) => {
    const sessionToEdit = type === 'work' ? workSessions.find(session => session.id === id) : studySessions.find(session => session.id === id);
    setEditSession({ ...sessionToEdit, id }); // Add the 'id' property to the object
    setShowModal(true);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setEditSession(null);
    setShowModal(false);
  }

  const [workSessions, setWorkSessions] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [activityData, setActivityData] = useState({
    date: '',
    activity_name: '',
    institute_name: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL_API}/collection/${uid}`, config);

        if (response.data) {
          const activityData = response.data.faculty_activities;

          const workSessionsData = activityData.work ? Object.entries(activityData.work).map(([id, data]) => ({ ...data, id })) : [];
          const studySessionsData = activityData.study ? Object.entries(activityData.study).map(([id, data]) => ({ ...data, id })) : [];


          setWorkSessions(workSessionsData);
          setStudySessions(studySessionsData);
        } else {
          console.error('Response data is undefined or null.');
        }
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


  const handleAddData = async (type, newId, data) => {
    setLoading(true)
    try {
      const newSession = {
        [newId]: {
          ...data
        }
      };

      const response = await axios.post(`${URL_API}/collection/${uid}/faculty_activities/${type}`, newSession);

      const createdSession = { id: newId, ...newSession[newId] };

      if (type === 'work') {
        setWorkSessions(prevSessions => [...prevSessions, createdSession]);
      } else if (type === 'study') {
        setStudySessions(prevSessions => [...prevSessions, createdSession]);
      }
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  };

  const handleEditData = async (type, id, data) => {
    setLoading(true)
    try {
      const response = await axios.put(`${URL_API}/collection/${uid}/faculty_activities/${type}/${id}`, data, config);
      if (type === 'work') {
        const updatedSessions = workSessions.map(session => session.id === id ? { id, ...data } : session);
        setWorkSessions(updatedSessions);
      } else if (type === 'study') {
        const updatedSessions = studySessions.map(session => session.id === id ? { id, ...data } : session);
        setStudySessions(updatedSessions);
      }
      setIsEdit(true);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const handleDeleteData = async (type, id) => {
    setLoading(true)
    try {
      const response = await axios.delete(`${URL_API}/collection/${uid}/faculty_activities/${type}/${id}`, config);

      if (type === 'work') {
        const updatedSessions = workSessions.filter(session => session.id !== id);
        setWorkSessions(updatedSessions);
      } else if (type === 'study') {
        const updatedSessions = studySessions.filter(session => session.id !== id);
        setStudySessions(updatedSessions);
      };
      setIsDeleted(true);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


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
      {isEdit && ( // display success message if isSuccess state variable is true
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
      {isDeleted && ( // display success message if isSuccess state variable is true
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
        <div className='w-full -z-50 absolute top-0 m-0'>
          <div className='relative w-2/4 rounded-lg top-28 right-0 bottom-0 left-0 m-auto border p-10'>
            <label >ระหว่างเรียน</label>
            {role !== 'teacher' && (
              <button
                className='right-10 absolute bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2 -my-5'
                onClick={() => handleOpenModal('study')}>เพิ่มข้อมูล</button>
            )}
            <table className='min-w-full table-auto'>
              <thead className='bg-gray-100'>
                <tr>
                  <th>วันที่กิจกรรม</th>
                  <th>ชื่อกิจกรรม</th>
                  <th>หน่วยงานที่จัด</th>
                </tr>
              </thead>
              <tbody>
                {studySessions.map((session, index) => (
                  <tr key={session.id}>
                    <td style={{ maxWidth: '900px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.date}</td>
                    <td style={{ maxWidth: '900px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.activity_name}</td>
                    <td style={{ maxWidth: '900px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.institute_name}</td>
                    {role !== 'teacher' && (
                      <td className='px-4 py-2 w-6'>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-700 duration-100 text-white font-bold py-2 px-4 rounded w-full"
                          onClick={() => handleEdit('study', session.id)}
                        >แก้ไข</button>
                      </td>
                    )}
                    {role !== 'teacher' && (
                      <td className='px-4 py-2 w-6'>
                        <button
                          className="bg-red-500 hover:bg-red-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2 w-full"
                          onClick={() => handleDeleteData('study', session.id)}
                        >ลบ</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='pt-11 border-t'>
              <label >ตอนทำงาน</label>
              {role !== 'teacher' && (
                <button
                  className='right-10 absolute bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2 -my-5'
                  onClick={() => handleOpenModal('work')}>เพิ่มข้อมูล</button>
              )}
              <table className='min-w-full table-auto'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th>วันที่กิจกรรม</th>
                    <th>ชื่อกิจกรรม</th>
                    <th>หน่วยงานที่จัด</th>
                  </tr>
                </thead>
                <tbody>
                  {workSessions.map((session, index) => (
                    <tr key={session.id}>
                      <td style={{ maxWidth: '900px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.date}</td>
                      <td style={{ maxWidth: '900px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.activity_name}</td>
                      <td style={{ maxWidth: '900px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.institute_name}</td>
                      {role !== 'teacher' && (
                        <td className='px-4 py-2 w-6'>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 duration-100 text-white font-bold py-2 px-4 rounded w-full"
                            onClick={() => handleEdit('work', session.id)}
                          >แก้ไข</button>
                        </td>
                      )}
                      {role !== 'teacher' && (
                        <td className='px-4 py-2 w-6'>
                          <button
                            className="bg-red-500 hover:bg-red-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2 w-full"
                            onClick={() => handleDeleteData('work', session.id)}
                          >ลบ</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <ModalActivity
        showModal={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddData}
        onEdit={handleEditData}
        modalType={ModalType}
        editingActivity={editSession}
      />
    </>
  )
}

export default withAuth(Activity)