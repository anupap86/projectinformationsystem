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

const Education = ({ onUserDataChange }) => {

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
    course: '',
    major: '',
    eduBefore: '',
    stuID: '',
    eduType: '',
    gpaBefore: '',
    gpaCurrent: '',
    newsSources: [],
    otherNewsSource: ''
  });
  const [editedData, setEditedData] = useState({
    course: '',
    major: '',
    eduBefore: '',
    stuID: '',
    eduType: '',
    gpaBefore: '',
    gpaCurrent: '',
    newsSources: [],
    otherNewsSource: ''
  });

  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const eduTypes = ['Portfilio', 'โควตา', 'แอดมิชชั่น', 'รับตรงอิสระ', 'อื่นๆ'];
  const majorTypes = ['วิศวกรรมชีวการแพทย์','วิศวกรรมไฟฟ้า', 'วิศวกรรมเครื่องกล', 'วิศวกรรมเคมี', 'วิศวกรรมโยธา', 'วิศวกรรมอุตสาหการ', 'วิศวกรรมคอมพิวเตอร์', 'วิศวกรรมโลจิสติกส์', 'วิศวกรรมคอนเสิร์ตและมัลติมีเดีย (หลักสูตรนานาชาติ)', 'วิศวกรรมด้านความปลอดภัย และการพิสูจน์หลักฐานทางคอมพิวเตอร์ (หลักสูตรนานาชาติ)', 'วิศวกรรมสิ่งแวดล้อม']
  const newSources = ['Facebook', 'Twitter', 'IG', 'ข่าวสารจากโรงเรียน', 'เว็บไซต์ของมหาวิทยาลัย', 'อื่นๆ'];
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
      setLoading(true)
      try {
        const response = await axios.get(`${URL_API}/collection/${uid}`, config);
        const data = response.data.education;
        setFormData(data);
        onUserDataChange(response.data.education)
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;



    if (name === "eduType" && value === "อื่นๆ") {
      setEditedData((prevState) => ({
        ...prevState,
        eduType: value,

      }));
    } else if (name === "otherEduType") {
      setEditedData((prevState) => ({
        ...prevState,
        eduType: value
      }));
    } else if (name === "otherNewsSources") {
      setEditedData((prevState) => ({
        ...prevState,
        otherNewsSource: value,
      }));
    }
    else {
      setEditedData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();

    const twoDecimalPlacesPattern = /^([0-3]\.\d{2}|4\.00)$/;

    if (!editedData.major || !editedData.eduBefore || !editedData.eduType) {
      alert("โปรดกรอกข้อมูลให้ครบ");
      setLoading(false);
      return;
    }

    if (isNaN(editedData.stuID) || editedData.stuID.length !== 11) {
      alert("โปรดรหัสนิสิต 11 หลัก");
      setLoading(false);
      return;
    }

    if (isNaN(editedData.course) || editedData.course.length !== 4) {
      alert("โปรดระบุปีการศึกษา");
      setLoading(false);
      return;
    }

    if (!twoDecimalPlacesPattern.test(editedData.gpaBefore) || isNaN(editedData.gpaBefore) || editedData.gpaBefore < 0.00 || editedData.gpaBefore > 4.00) {
      alert("โปรดกรอกเกรดเฉลี่ยก่อนเข้าศึกษาให้ถูกต้อง (0.00 - 4.00) และมีทศนิยมสองตำแหน่ง");
      setLoading(false);
      return;
    }

    if (!twoDecimalPlacesPattern.test(editedData.gpaCurrent) || isNaN(editedData.gpaCurrent) || editedData.gpaCurrent < 0.00 || editedData.gpaCurrent > 4.00) {
      alert("โปรดกรอกเกรดเฉลี่ยปัจจุบันให้ถูกต้อง (0.00 - 4.00) และมีทศนิยมสองตำแหน่ง");
      setLoading(false);
      return;
    }

    if (editedData.eduType === 'อื่นๆ' && (!editedData.otherEduType || editedData.otherEduType.trim() === '')) {
      alert("โปรดระบุประเภทอื่น ๆ");
      setLoading(false);
      return;
    }


    if (!editedData.newSources || editedData.newSources.length === 0) {
      alert("โปรดเลือกอย่างน้อยหนึ่งตัวเลือก");
      setLoading(false);
      return;
    }

    if (isOtherNewsSourceSelected && (!editedData.otherNewsSource || editedData.otherNewsSource.trim() === '')) {
      alert("โปรดระบุช่องทางอื่น ๆ");
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        education: {
          ...editedData,
        }
      };
      Object.keys(requestData.education).forEach((key) => {
        if (requestData.education[key] === "") {
          delete requestData.education[key];
        }
      });
      await axios.put(`${URL_API}/collection/${uid}`, requestData, config);
      setFormData(editedData);
      setEditMode(false);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    setEditMode(true);
    setEditedData(formData);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData(formData);
  };

  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const handleEduTypeChange = (event) => {
    const value = event.target.value;
    if (value === 'อื่นๆ') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
    }
    handleInputChange(event);
  };

  const [isOtherNewsSourceSelected, setIsOtherNewsSourceSelected] = useState(false);
  const handleNewSourcesChange = (event) => {
    const { value, checked } = event.target;
    let updatedNewSources;

    if (checked) {
      updatedNewSources = [...(editedData?.newSources || []), value];
    } else {
      updatedNewSources = editedData?.newSources.filter((source) => source !== value);
    }

    setEditedData((prevState) => ({
      ...prevState,
      newSources: updatedNewSources,
    }));

    if (value === 'อื่นๆ') {
      setIsOtherNewsSourceSelected(checked);
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

        <div className='absolute w-0 top-24 -z-10 m-0 left-1/4'>
          <div className='relative m-10 bg border w-max p-10 rounded-lg shadow'>
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <div className="mb-4 flex-none">
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor='course'>
                    หลักสูตรการศึกษา
                  </label>
                  {editMode ? (
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='course'
                      name='course'
                      maxLength={4}
                      minLength={4}
                      type='text'
                      value={editedData?.course}
                      onChange={handleInputChange}
                      placeholder='หลักสูตร พ.ศ.'
                      required
                    />
                  ) : (
                    <span>{formData?.course}</span>
                  )}
                </div>
                <div className='mb-4 flex-initial mx-10'>
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor='major'>
                    สาขาวิชา
                  </label>
                  {editMode ? (
                    <select
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='major'
                      name='major'
                      value={editedData?.major}
                      onChange={handleInputChange}
                      required
                    >
                      <option value=''>เลือกประเภท</option>
                      {majorTypes.map((major) => (
                        <option key={major} value={major}>
                          {major}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{formData?.major}</span>
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="mb-4 flex-none w-64">
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor='eduBefore'>
                    จบจากโรงเรียน
                  </label>
                  {editMode ? (
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='eduBefore'
                      name='eduBefore'
                      type='text'
                      value={editedData?.eduBefore}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <span>{formData?.eduBefore}</span>
                  )}
                </div>
                <div className="mb-4 flex-none w-64 mx-10">
                  <label className='block text-gray-700 font-bold mb-2 w-64 ' htmlFor='eduBefore'>
                    รหัสนิสิต
                  </label>
                  {editMode ? (
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='stuID'
                      name='stuID'
                      maxLength={11}
                      minLength={11}
                      type='text'
                      value={editedData?.stuID}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <span>{formData?.stuID}</span>
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="mb-4 flex-initial w-28">
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor="eduType">
                    ประเภทเข้าการศึกษา
                  </label>
                  {editMode ? (
                    <select
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='eduType'
                      name='eduType'
                      value={editedData?.eduType}
                      onChange={handleEduTypeChange}
                      required
                    >
                      <option value=''>เลือกประเภท</option>
                      {eduTypes.map((eduType) => (
                        <option key={eduType} value={eduType}>
                          {eduType}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>
                      {formData?.eduType === 'อื่นๆ'
                        ? `${formData?.eduType}`
                        : formData?.eduType}
                    </span>
                  )}
                  {isOtherSelected && editMode && (
                    <div className="mt-4">
                      <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="otherEduType">
                        โปรดระบุประเภทอื่น ๆ
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="otherEduType"
                        name="otherEduType"
                        type="text"

                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4 flex-initial mx-14 w-32">
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor="gpaBefore">
                    เกรดเฉลี่ยนก่อนเข้าศึกษา
                  </label>
                  {editMode ? (
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='gpaBefore'
                      name='gpaBefore'
                      type='text'
                      value={editedData?.gpaBefore}
                      onChange={handleInputChange}
                      pattern="^([0-3]\.\d{2}|4\.00)$"
                      maxLength="4"
                      required
                    />
                  ) : (
                    <span>{formData?.gpaBefore}</span>
                  )}
                </div >
                <div className="mb-4 flex-initial mx-5 w-32">
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor="gpaCurrent">
                    เกรดเฉลี่ยนปัจจุบัน
                  </label>
                  {editMode ? (
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='gpaCurrent'
                      name='gpaCurrent'
                      type='text'
                      value={editedData?.gpaCurrent}
                      onChange={handleInputChange}
                      pattern="^([0-3]\.\d{2}|4\.00)$"
                      maxLength="4"
                      required
                    />
                  ) : (
                    <span>{formData?.gpaCurrent}</span>
                  )}
                </div >
              </div >
              <div>
                <div>
                  <label className='block text-gray-700 font-bold mb-2 w-64' htmlFor="">
                    ได้รับข่าวสารเกี่ยวกับคณะวิศวกรรมศาสตร์จากช่องทางไหน
                  </label>
                  {editMode ? (
                    newSources.map((source, index) => (
                      <div key={index}>
                        <input
                          className=''
                          id={`newsSources${index}`}
                          name={`newsSources${index}`}
                          type='checkbox'
                          value={source}
                          checked={editedData?.newSources?.includes(source)}
                          onChange={handleNewSourcesChange}
                        />
                        <label className='text-gray-700 font-bold' htmlFor={`newsSources${index}`}>
                          {source}
                        </label>
                        {source === 'อื่นๆ' && isOtherNewsSourceSelected && (
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="otherNewsSource"
                            name="otherNewsSource"
                            type="text"
                            value={editedData?.otherNewsSource}
                            onChange={handleInputChange}
                            placeholder="โปรดระบุช่องทางอื่น ๆ"
                            required
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div>
                      {formData && formData.newSources && formData.newSources.map((source, index) => (
                        <div key={index}>
                          <input
                            className=''
                            id={`newsSources${index}`}
                            name={`newsSources${index}`}
                            type='checkbox'
                            value={source}
                            checked
                            disabled
                          />
                          <label className='text-gray-700 font-bold' htmlFor={`newsSources${index}`}>
                            {source}
                          </label>
                          {source === 'อื่นๆ' && formData.otherNewsSource && (
                            <span className="ml-2 text-gray-700 font-bold">
                              {formData.otherNewsSource}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='mb-4 justify-between pt-5'>
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
            </form >
          </div >
        </div >
      )}
    </>
  )
}

export default withAuth(Education)