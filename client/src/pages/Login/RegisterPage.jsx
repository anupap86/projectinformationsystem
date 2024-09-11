import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalSignup from '../../components/modal/login/ModalSignup';
import { Link } from 'react-router-dom';


const URL_API = import.meta.env.VITE_API_URL;
const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [stuID, setStuID] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const [modal, setModal] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    if (pwd !== confirmPwd) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    const thaiRegex = /^[\u0E00-\u0E7F\s]*$/;
    if (!thaiRegex.test(name) || !thaiRegex.test(surname)) {
      setError("ชื่อและนามสกุลต้องเป็นภาษาไทยเท่านั้น");
      setLoading(false);
      return;
    }

    if (isNaN(stuID) || stuID.length !== 11) {
      setError("โปรดรหัสนิสิต 11 หลัก");
      setLoading(false);
      return;
    }


    try {
      const registerData = {
        email,
        password: pwd,
        profile: {
          thaiFirstName: name,
          thaiLastName: surname,
          email: email,

        },
        education: {
          stuID: stuID
        }
      }
      const response = await axios.post(`${URL_API}/register`, registerData);
      if (response && response.data) {
        setModal(true);
      } else {
        setError("An error occurred while trying to register.")
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errorInfo?.code === 'auth/email-already-exists') {
        setError("มีอีเมลนี้อยู่แล้ว");
      } else {
        setError(error.response?.data || "An error occurred while trying to register.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <div className='text-center p-5'>
            <div role="status">
              <svg aria-hidden="true" class="inline w-10 h-10  mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <form className="p-10 bg-white rounded-lg shadow-md" onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              อีเมล
            </label >
            <input
              className="w-full border-gray-300 border rounded-md p-2"
              type="email"
              id="email-address"
              name="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div >
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              รหัสผ่าน
            </label>
            <input
              className="w-full border-gray-300 border rounded-md p-2"
              type="password"
              name="password"
              placeholder="อย่างน้อย 6 ตัว"
              id="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block font-medium mb-2">
              ยืนยันรหัสผ่าน
            </label>
            <input
              className="w-full border-gray-300 border rounded-md p-2"
              type="password"
              name="confirm-password"
              id="confirm-password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stuID" className="block font-medium mb-2">
              รหัสนิสิต
            </label>
            <input
              className="w-full border-gray-300 border rounded-md p-2"
              type="text"
              name="stuID"
              id="stuID"
              maxLength={11}
              minLength={11}
              value={stuID}
              onChange={(e) => setStuID(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-2">
              ชื่อ
            </label>
            <input
              className="w-full border-gray-300 border rounded-md p-2"
              type="text"
              name="fname"
              id="fname"
              placeholder="ภาษาไทย"
              autoComplete="fname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block font-medium mb-2">
              นามสกุล
            </label>
            <input
              className="w-full border-gray-300 border rounded-md p-2"
              type="text"
              name="lname"
              id="lname"
              placeholder="ภาษาไทย"
              autoComplete="lname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className='flex-end text-right text-xs pb-2'>
            <input type="checkbox" id="agreement" name="agreement" required />
            ฉันยอมรับ
            <Link className='text-blue-600 underline' to="/term-and-conditions">เงื่อนไขการให้บริการ</Link>และ
            <Link className='text-blue-600 underline' to="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            สมัคร
          </button>
          {modal && <ModalSignup />}
        </form >
      )}
    </>

  );
}

export default RegisterPage;