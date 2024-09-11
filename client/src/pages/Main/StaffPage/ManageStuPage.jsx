import React, { useState, useEffect } from 'react'
import StaffFrame from '../../../components/MainLayout/StaffFrame'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const ManageStuPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  let navigate = useNavigate()



  const handleSearch = () => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const config = getAxiosConfig();
      axios.get(`${URL_API}/allcollection?searchTerm=${searchTerm}`, config)
        .then((response) => {
          const sortedUsers = response.data.listing.sort((a, b) => a.profile?.thaiFirstName.localeCompare(b.profile?.thaiFirstName));
          setFilteredUsers(sortedUsers);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.error('Unauthorized', error);
          } else {
            console.error('Error fetching user: ', error);
          }
        });
    }
  };

  const sortUsers = (sortBy) => {
    const sortedUsers = [...filteredUsers]; // Create a shallow copy of the filteredUsers array

    if (sortBy === 'firstName') {
      sortedUsers.sort((a, b) => a.profile?.thaiFirstName.localeCompare(b.profile?.thaiFirstName));
    } else if (sortBy === 'stuID') {
      sortedUsers.sort((a, b) => parseInt(b.education?.stuID) - parseInt(a.education?.stuID));
    }

    setFilteredUsers(sortedUsers);
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const startingItemNumber = firstIndex + 1;
  const endingItemNumber = Math.min(lastIndex, filteredUsers.length);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get the items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset the current page to 1 when changing items per page
  };



  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id); // Update selectedUserId state variable
  };

  // Navigate to the selected user's index page when selectedUserId is updated
  useEffect(() => {
    if (selectedUserId) {
      navigate(`/${selectedUserId}/index`);
    }
  }, [selectedUserId]);





  return (
    <>
      <StaffFrame selectedUserId={selectedUserId} hideMenuBar={true} />
      <div className='absolute w-0 top-24 -z-10 m-0 left-1/4'>
        <div className='relative m-10 bg border w-max p-10 rounded-lg shadow '>
          <div className='flex'>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type="text"
              placeholder="ค้นหา"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              onClick={handleSearch}>
              ค้นหา
            </button>


          </div>
          <div className="flex items-center justify-end pt-5">
            <span className="text-sm text-gray-700 mr-2">เรียงลำดับ:</span>
            <select
              className="border border-gray-300 rounded-md ml-2 mr-4 text-sm"
              defaultValue="default"
              onChange={(e) => sortUsers(e.target.value)}
            >
              <option value="default" disabled hidden>เลือก</option>
              <option value="firstName">ชื่อ (ก-ฮ)</option>
              <option value="stuID">รหัสนิสิต (มากไปน้อย)</option>
            </select>

          </div>
          <div className='pt-6' style={{ width: '900px' }}>

            <table className="table-fixed w-full">
              <thead className="min-w-full divide-y divide-gray-200">
                <tr>
                  <th className="w-1/2 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">ชื่อ</th>
                  <th className="w-1/2 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">ภาควิชา</th>
                  <th className="w-1/2 px-6 py-3 text-left text-m text-gray-500 uppercase tracking-wider">รหัสนิสิต</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersToDisplay.map((user) => (
                  <tr key={user.id} onClick={() => handleUserClick(user.id)}>
                    {/* Display the requested fields with optional chaining and default values */}
                    <td className="px-6 py-4 text-sm text-gray-900 cursor-pointer first-name-cell">{user.profile?.thaiFirstName || '-'} {user.profile?.thaiLastName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 cursor-pointer">{user.education?.major || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 cursor-pointer">{user.education?.stuID || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-700">
              แสดง {startingItemNumber} - {endingItemNumber} จาก {filteredUsers.length} รายการ
            </p>
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-700 mr-2">จำนวนข้อมูลต่อหน้า</span>
              <select
                className="border border-gray-300 rounded-md ml-2 mr-4 text-sm"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <div className="flex items-center">
                <button
                  className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
              </div>
              <div>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`${page === currentPage
                      ? "bg-blue-700 text-white"
                      : "bg-white text-blue-700"
                      } mx-1 border border-blue-700 hover:bg-blue-700 hover:text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className={`${currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default withAuth(ManageStuPage)