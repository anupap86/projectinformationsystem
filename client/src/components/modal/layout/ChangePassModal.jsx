import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie'
import axios from 'axios';

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


const ChangePassModal = ({ showModal, onClose, onSuccess }) => {

    const [cookies] = useCookies(['token']);
    const token = cookies.token;
    const decoded = jwtDecode(token);
    const uid = decoded.uid;
    const config = getAxiosConfig();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentpassword: '',
        newpassword: '',
        newpasswordcheck: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    useEffect(() => {
        if (showModal) {
            setFormData({
                currentpassword: '',
                newpassword: '',
                newpasswordcheck: ''
            });
            setError(null);
        }
    }, [showModal]);


    const handleChangePassword = async (oldpassword, newpassword, newpasswordcheck) => {
        setLoading(true);
        // Handle change password logic here
        if (newpassword !== newpasswordcheck) {
            setError('รหัสผ่านใหม่ไม่ตรงกัน');
            setLoading(false);
            return;
        }
        if (newpassword.length < 6) {
            setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.put(`${URL_API}/changepassword/${uid}`, {
                currentpassword: oldpassword,
                newpassword1: newpassword,
                newpassword2: newpasswordcheck
            }, config);
            onSuccess();
        } catch (error) {
            console.error(error);
            setError('รีเซ็ทรหัสผ่านไม่ถูกต้อง')
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleChangePassword(formData.currentpassword, formData.newpassword, formData.newpasswordcheck);
    };


    if (!showModal) return null;

    return (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8">
                {loading ? (
                        <div className='text-center p-5'>
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-10 h-10  mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                ) : (
                    <>
                        <h2 className="text-lg font-medium mb-4">เปลี่ยนรหัสผ่าน</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="currentpassword" className="block font-medium mb-2">
                                    รหัสผ่านปัจจุบัน
                                </label>
                                <input
                                    type="password"
                                    id="currentpassword"
                                    name="currentpassword"
                                    value={formData.currentpassword}
                                    onChange={handleChange}
                                    className="border border-gray-400 p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newpassword" className="block font-medium mb-2">
                                    รหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    id="newpassword"
                                    name="newpassword"
                                    value={formData.newpassword}
                                    onChange={handleChange}
                                    className="border border-gray-400 p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newpasswordcheck" className="block font-medium mb-2">
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    id="newpasswordcheck"
                                    name="newpasswordcheck"
                                    value={formData.newpasswordcheck}
                                    onChange={handleChange}
                                    className="border border-gray-400 p-2 w-full"
                                />
                            </div>
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-700 text-white p-2 rounded-md duration-100 hover:bg-blue-500 mr-2 "
                                    disabled={
                                        !formData.currentpassword ||
                                        !formData.newpassword ||
                                        !formData.newpasswordcheck
                                    }
                                    type="submit"
                                >
                                    เปลี่ยนรหัสผ่าน
                                </button>
                                <button onClick={onClose} className="border bg-gray-400 p-2 rounded-md mr-2 duration-100 hover:bg-gray-300 text-white">
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangePassModal;