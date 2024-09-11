import React, { useState, useEffect } from 'react'
import StaffFrame from '../../../components/MainLayout/StaffFrame'
import axios from 'axios';
import withAuth from '../../../utils/withAuth';
import Cookies from 'js-cookie'

const URL_API = import.meta.env.VITE_API_URL;

const getAxiosConfig = () => {
  const token = Cookies.get('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return config;
};


const RoleSelectPage = () => {
  const config = getAxiosConfig();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResult, setSearchResult] = useState('');


  const handleSearch = () => {
    if (searchTerm === '') {
      setSearchResult(users);
    } else {
      axios.get(`${URL_API}/listAllUsers?searchTerm=${searchTerm}`, config)
        .then((response) => {
          console.log('Response data: ', response.data); // Add this line
          setSearchResult(response.data.message);
        })
        .catch((error) => {
          console.error('Error fetching user: ', error);
          if (error.response && error.response.status === 401) {
            console.error('Unauthorized', error.response);
          } else {
            console.error('Error fetching user: ', error);
          }
        });
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleSearch();
  };

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

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSetRole = (userId) => {
    setSelectedUser(userId); // Fix the typo here
    toggleModal();
  };
  const [selectedRole, setSelectedRole] = useState('');

  const handleConfirmedSetRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await axios.put(`${URL_API}/user/${selectedUser}`, {
        'role': selectedRole
      }, config)
    } catch (error) {
      console.error('Error set role: ', error);
    }
    setIsSuccess(true);
    toggleModal();
  }

  return (
    <>
      <StaffFrame hideMenuBar={true} />
      {isSuccess && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative z-50' role='alert'>
          <strong className='font-bold'>แก้ไข Role</strong>
          <span className='block sm:inline'> สำเร็จ!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg className='fill-current h-6 w-6 text-green-500' role='button' onClick={() => setIsSuccess(false)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <title>Close</title>
              <path d='M14.348 14.849l-1.415 1.414L10 11.414l-2.93 2.93-1.415-1.414L8.586 10l-2.93-2.93 1.415-1.414L10 8.586l2.93-2.93 1.415 1.414L11.414 10l2.93 2.93z' />
            </svg>
          </span>
        </div>
      )}

      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto top-72">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                เลือกตำแหน่ง:
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">โปรดเลือก</option>
                  <option value="admin">admin</option>
                  <option value="teacher">teacher</option>
                  <option value="user">user</option>
                </select>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="ml-3 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={toggleModal}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmedSetRole}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='absolute w-0 top-24 -z-10 m-0 left-1/4'>
        <div className='relative m-10 bg border w-max py-10 rounded-lg shadow pr-72  px-10'>
          <div className='flex'>
            <form onSubmit={handleClick} className='flex'>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type="text"
                placeholder="ค้นหาอีเมล"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                onClick={handleSearch}
              >
                ค้นหา
              </button>
            </form>
          </div>
          {searchResult && (
            <>
              <div className='pt-6' style={{width: '900px'}}>
                <table className="table-auto w-full">
                  <thead className="min-w-full  divide-gray-200">
                    <th className="w-1/3 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">email</th>
                    <th className="w-1/3 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">ชื่อ</th>
                    <th className="w-1/3 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                    <th className="w-1/3 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">action</th>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResult.map((user) => (
                      <tr>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 w-1/4 ">{user.email}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 w-1/4 ">{user.displayName}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 w-1/4 ">{user.customClaims?.role}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 w-1/4 ">
                          <button
                          className='bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded'
                            onClick={() => handleSetRole(user.uid)}
                          >
                            เลือกตำแหน่ง
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default withAuth(RoleSelectPage);