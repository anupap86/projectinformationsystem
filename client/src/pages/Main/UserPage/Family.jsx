import React, { useEffect, useState } from 'react'
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

const Family = () => {

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const { id: urlId } = useParams(); // Get the id from the URL
  const uid = urlId || decoded.uid; // Use the URL id if available, otherwise use the uid from the token
  const role = decoded.role;
  const { id } = useParams();

  const config = getAxiosConfig();

  const [familyInfo, setFamilyInfo] = useState({
    father: { fname: '', lname: '', income: '' },
    mother: { fname: '', lname: '', income: '' },
    marital_status: '',
    siblings: [],
  });

  const [siblingCount, setSiblingCount] = useState(0)

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
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



  const handleCancel = () => {
    setEditMode(false);
  };

  useEffect(() => {
    const initialSiblings = Array.from({ length: siblingCount }, () => ({
      type: '',
      age: '',
      year_studying: '',
      academy_name: '',
      highest_education: '',
      workplace: '',
      income: '',
    }));
    setFamilyInfo({ ...familyInfo, siblings: initialSiblings });
  }, [siblingCount]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL_API}/collection/${uid}`, config);
        const data = response.data.family_information;
        setFamilyInfo(data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  const handleChangeSiblingCount = (e) => {
    setSiblingCount(Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!familyInfo?.father?.fname ||
      !familyInfo?.father?.lname ||
      !familyInfo?.father?.income
    ) {
      alert("กรุณากรอกข้อมูลพ่อให้ครบ");
      setLoading(false);
      return;
    }

    if (!familyInfo?.mother?.fname ||
      !familyInfo?.mother?.lname ||
      !familyInfo?.mother?.income
    ) {
      alert("กรุณากรอกข้อมูลแม่ให้ครบ");
      setLoading(false);
      return;
    }

    if (!familyInfo.marital_status) {
      alert("กรุณากรอกสถานภาพสมรส")
      setLoading(false);
      return;
    }

    const hasEmptySibling = familyInfo.siblings?.some((sibling) => {
      if (sibling.type === "study") {
        return (
          sibling.age === "" ||
          sibling.year_studying === "" ||
          sibling.academy_name === ""
        );
      } else if (sibling.type === "work") {
        return (
          sibling.age === "" ||
          sibling.workplace === "" ||
          sibling.highest_education === "" ||
          sibling.income === ""
        );
      } else {
        return sibling.type === "" && sibling.age === "";
      }
    });

    if (siblingCount > 1 && hasEmptySibling) {
      alert("กรุณากรอกข้อมูลลูก");
      setLoading(false);
      return;
    }

    if (hasEmptySibling && familyInfo.siblings?.length > 0) {
      alert("กรุณากรอกข้อมูลลูก");
      setLoading(false);
      return;
    }

    const requestData = {
      family_information: {
        father: familyInfo.father,
        mother: familyInfo.mother,
        marital_status: familyInfo.marital_status,
      },
    };

    if (familyInfo.siblings?.length === 0) {
      requestData.family_information.siblings = [];
    } else if (familyInfo.siblings?.length > 0) {
      requestData.family_information.siblings = familyInfo.siblings.map((sibling, index) => {
        const hasData = sibling.type !== "" && sibling.age !== "";
        const siblingData = {
          type: sibling.type,
          age: sibling.age,
          year_studying: sibling.year_studying,
          academy_name: sibling.academy_name,
          workplace: sibling.workplace,
          highest_education: sibling.highest_education,
          income: sibling.income,
        };
        if (hasData) {
          return siblingData;
        } else if (siblingsFromDatabase[index]) {
          return {};
        } else {
          return null;
        }
      }).filter(sibling => sibling !== null);
    }

    try {
      if (editMode) {
        await axios.post(`${URL_API}/collection/${uid}`, requestData, config)
      } else {
        await axios.put(`${URL_API}/collection/${uid}`, requestData, config)
      }
      setEditMode(false);
      setIsSuccess(true)
    } catch (error) {
      console.error(`Error submitting form: `, error)
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
        <div className='absolute w-0 top-24 z-10 m-0 left-1/3'>
          <div className='relative m-10 bg border w-max p-10 rounded-lg shadow'>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='flex'>
                <div className='flex-row'>
                  <div className='w-72 '>
                    <label >พ่อ</label>
                    <div className='bg-gray-600 w-40 h-px'></div>
                    {editMode ? (
                      <input
                        required
                        placeholder='ชื่อ'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        value={familyInfo?.father?.fname}
                        onChange={e => setFamilyInfo({ ...familyInfo, father: { ...familyInfo?.father, fname: e.target.value } })}
                      />
                    ) : (
                      <span className='block pt-2'>ชื่อ: {familyInfo?.father?.fname}</span>
                    )}
                    {editMode ? (
                      <input
                        required
                        placeholder='นามสกุล'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        value={familyInfo?.father?.lname}
                        onChange={e => setFamilyInfo({ ...familyInfo, father: { ...familyInfo?.father, lname: e.target.value } })}
                      />
                    ) : (
                      <span className='block'>นามสกุล: {familyInfo?.father?.lname}</span>
                    )}
                    {editMode ? (
                      <select
                        required
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={familyInfo?.father?.income}
                        onChange={e => setFamilyInfo({ ...familyInfo, father: { ...familyInfo?.father, income: e.target.value } })}
                      >
                        <option value=''>รายได้ต่อปี</option>
                        <option value='ต่ำกว่า 150000'>ต่ำกว่า 150000</option>
                        <option value='150000-300000'>150000-300000</option>
                        <option value='300000-500000'>300000-500000</option>
                        <option value='500000-750000'>500000-750000</option>
                        <option value='750000-1ล้าน'>750000-1ล้าน</option>
                        <option value='1ล้าน-2ล้าน'>1ล้าน-2ล้าน</option>
                        <option value='2ล้าน-5ล้าน'>2ล้าน-5ล้าน</option>
                        <option value='มากวว่า 5ล้าน'>มากวว่า 5ล้าน</option>
                      </select>
                    ) : (
                      <span className='block'>รายได้ต่อปี: {familyInfo?.father?.income}</span>
                    )}
                  </div>
                </div>
                <div className='flex-row'>
                  <div className='w-72'>
                    <label >แม่</label>
                    <div className='bg-gray-600 w-40 h-px'></div>
                    {editMode ? (
                      <input
                        required
                        placeholder='ชื่อ'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        value={familyInfo?.mother?.fname}
                        onChange={e => setFamilyInfo({ ...familyInfo, mother: { ...familyInfo?.mother, fname: e.target.value } })}
                      />
                    ) : (
                      <span className='block pt-2'>ชื่อ: {familyInfo?.mother?.fname}</span>
                    )}
                    {editMode ? (
                      <input
                        required
                        placeholder='นามสกุล'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        value={familyInfo?.mother?.lname}
                        onChange={e => setFamilyInfo({ ...familyInfo, mother: { ...familyInfo?.mother, lname: e.target.value } })}
                      />
                    ) : (
                      <span className='block'>นามสกุล: {familyInfo?.mother?.lname}</span>
                    )}
                    {editMode ? (
                      <select
                        required
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={familyInfo?.mother?.income}
                        onChange={e => setFamilyInfo({ ...familyInfo, mother: { ...familyInfo?.mother, income: e.target.value } })}
                      >
                        <option value=''>รายได้ต่อปี</option>
                        <option value='ต่ำกว่า 150000'>ต่ำกว่า 150000</option>
                        <option value='150000-300000'>150000-300000</option>
                        <option value='300000-500000'>300000-500000</option>
                        <option value='500000-750000'>500000-750000</option>
                        <option value='750000-1ล้าน'>750000-1ล้าน</option>
                        <option value='1ล้าน-2ล้าน'>1ล้าน-2ล้าน</option>
                        <option value='2ล้าน-5ล้าน'>2ล้าน-5ล้าน</option>
                        <option value='มากวว่า 5ล้าน'>มากวว่า 5ล้าน</option>
                      </select>
                    ) : (
                      <span className='block'>รายได้ต่อปี: {familyInfo?.mother?.income}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className='w-72'>
                <label >สถานภาพสมรส</label><br />
                <div className='bg-gray-600 w-40 h-px'></div>
                {editMode ? (
                  <select
                    required
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    value={familyInfo?.marital_status}
                    onChange={e => setFamilyInfo({ ...familyInfo, marital_status: e.target.value })}
                  >
                    <option value=''>สถานะสมรส</option>
                    <option value='สมรส'>สมรส</option>
                    <option value='หย่าร้าง'>หย่าร้าง</option>
                  </select>
                ) : (
                  <span className='pt-2'>{familyInfo?.marital_status}</span>
                )}
              </div>


              <div className=''>
                {editMode && (
                  <label>
                    จำนวนพี่น้อง:
                    <select value={siblingCount} onChange={handleChangeSiblingCount}>
                      {[...Array(5).keys()].map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {familyInfo && familyInfo.siblings && familyInfo.siblings.map((sibling, index) => (
                  <div key={index}>
                    {editMode ? (
                      <>
                        <div className='w-72 pt-5'>
                          <div>
                            พี่น้องคนที่ <strong> {index + 1}</strong>

                          </div>
                          <label>กำลังเรียนหรือทำงาน:</label>
                          <select
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            value={sibling.type}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].type = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          >
                            <option value="">เลือก</option>
                            <option value="study">กำลังเรียน</option>
                            <option value="work">ทำงาน</option>
                          </select>
                        </div>

                      </>
                    ) : (
                      <>

                        <div className='pt-5'>
                          ลูกคนที่ <strong>{index + 1}</strong>
                        </div>
                        <div className='bg-gray-600 w-40 h-px'></div>
                        <div className='pl-5 pt-2'>
                          Type: {sibling.type}
                          <br />
                        </div>

                      </>
                    )}

                    {sibling.type === "study" && editMode ? (
                      <>
                        <div className='py-5 border border-gray-100 rounded px-10 mt-5 w-72 bg-slate-200'>
                          <label>อายุ:</label>
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="text"
                            value={sibling.age}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].age = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          />
                          <br />
                          <label>ชั้นปี:</label>
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="text"
                            value={sibling.year_studying}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].year_studying = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          />
                          <br />
                          <label>ชื่อสถานศึกษา:</label>
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="text"
                            value={sibling.academy_name}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].academy_name = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      sibling.type === "study" && (
                        <>
                          <div className='pl-5'>
                            อายุ: {sibling.age}
                            <br />
                            ชั้นปี: {sibling.year_studying}
                            <br />
                            ชื่อสถานศึกษา: {sibling.academy_name}
                            <br />
                          </div>
                        </>
                      )
                    )}

                    {sibling.type === "work" && editMode ? (
                      <>
                        <div className='py-5 border border-gray-100 rounded px-10 mt-5 w-72 bg-slate-200'>
                          <label >อายุ:</label>
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="text"
                            value={sibling.age}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].age = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          />
                          <label >สถานที่ทำงาน:</label>
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="text"
                            value={sibling.workplace}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].workplace = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          />
                          <label >การศึกษาสูงสุด:</label>
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="text"
                            value={sibling.highest_education}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].highest_education = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          />
                          <label >เงินเดือน:</label>
                          <select
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            value={sibling.income}
                            onChange={(e) => {
                              const siblingsCopy = [...familyInfo.siblings];
                              siblingsCopy[index].income = e.target.value;
                              setFamilyInfo({ ...familyInfo, siblings: siblingsCopy });
                            }}
                          >
                            <option value=''>เลือกเงินเดือน</option>
                            <option value='ต่ำกว่า10000'>ต่ำกว่า 10000</option>
                            <option value='10000-20000'>10000-20000</option>
                            <option value='20000-30000'>20000-30000</option>
                            <option value='30000-40000'>30000-40000</option>
                            <option value='40000-50000'>40000-50000</option>
                            <option value='มากกว่า50000'>มากกว่า 50000</option>
                          </select>

                        </div>
                      </>
                    ) : (
                      sibling.type === "work" && (
                        <>
                          <div className='pl-5'>
                            สถานที่ทำงาน: {sibling.workplace}
                            <br />
                            อายุ: {sibling.age}
                            <br />
                            การศึกษาสูงสุด: {sibling.highest_education}
                            <br />
                            เงินเดือน: {sibling.income}
                            <br />
                          </div>
                        </>
                      )
                    )}

                  </div>
                ))}
              </div>


              {role !== 'teacher' && !editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='button'
                >
                  แก้ไขข้อมูล
                </button>
              )}
              {role !== 'teacher' && editMode && (
                <>
                  <button
                    onClick={handleSubmit}
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
                    type='button'
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    type='button'
                  >
                    ยกเลิก
                  </button>
                </>
              )}

            </form>

          </div>
        </div>
      )}
    </>
  )
}

export default withAuth(Family)