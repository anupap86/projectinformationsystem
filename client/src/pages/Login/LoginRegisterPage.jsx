import React, { useState } from 'react';
import LoginForm from './LoginPage.jsx';
import RegisterForm from './RegisterPage.jsx';
import Logos from '../../assets/Srinakharinwirot_Logo_TH_Color.png'

const LoginRegister = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    
    <div className="min-h-screen bg-gray-100 bg-opacity-0 flex flex-col justify-center py-3 sm:px-6 lg:px-8 sm:pb-20 lg:pb-20">
      
      

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className='flex justify-center'><img className='object-scale-down h-40 w-96' src={Logos} alt="logo" /></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showLoginForm ? 'เข้าสู่ระบบ' : 'สมัคร'}
        </h2>
      </div>
          {showLoginForm ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={toggleForm}
          >
            {showLoginForm ? 'สมัคร' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
