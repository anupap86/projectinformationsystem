import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import ChangePassModal from '../modal/layout/ChangePassModal';


function HeaderBar(props) {
  const { menuItems } = props;

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const displayName = decoded.displayName;

  const removeCookie = (name, domain) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
  };

  const logout = () => {
    removeCookie('token', import.meta.env.VITE_LOGOUT_TOKEN);
    window.location.reload();
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
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

  const handlePasswordChangeSuccess = () => {
    setShowModal(false);
    setIsSuccess(true);
  };


  return (
    <>
      {isSuccess && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative z-50' role='alert'>
          <strong className='font-bold'>เปลี่ยนรหัสผ่าน</strong>
          <span className='block sm:inline'> สำเร็จ!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
            <svg className='fill-current h-6 w-6 text-green-500' role='button' onClick={() => setIsSuccess(false)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <title>Close</title>
              <path d='M14.348 14.849l-1.415 1.414L10 11.414l-2.93 2.93-1.415-1.414L8.586 10l-2.93-2.93 1.415-1.414L10 8.586l2.93-2.93 1.415 1.414L11.414 10l2.93 2.93z' />
            </svg>
          </span>
        </div>
      )}
      <div className='fixed sm:m-0 w-full  bg-gray-800  border-b-2 sm:left-64 z-40'
      >
        <div className='flex flex-row mr-20 space-x-5 bg-gray-800  text pt-5 sm:h-20'
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className=' text-white text-left pl-14 text-3xl align-middle flex-none w-64 relative basis-1/2 pt-2'>
            {menuItems.find((menuItem) => window.location.pathname === menuItem.link)?.title || 'หน้าหลัก'}
          </div>
          <div className=' text-white text-lg text-center flex-1 w-32 relative'>
            <button
              onClick={toggleDropdown}
              className=" items-center font-medium text-white rounded-lg duration-100 hover:text-gray-500 md:mr-0 bg-gray-700 px-3"
              id="avatar-menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <span>ยินดีต้อนรับคุณ {displayName}</span>
            </button>
            {isOpen && (
              <>
                <div
                  className="absolute right-80 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={openModal}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                      tabIndex="-1"
                      id="resetpassword"
                    >
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>
                  <div className="py-1" role="none">
                    <button
                      onClick={logout}
                      className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <ChangePassModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      </div>
    </>

  )
}

export default HeaderBar
