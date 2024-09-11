import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

function StaffHeaderBar(props) {

    const { menuItems, indexMenuItems } = props;

    const [cookies] = useCookies(['token']);
    const token = cookies.token;
    const decoded = jwtDecode(token);
    const displayName = decoded.displayName;
    const navigate = useNavigate();

    const removeCookie = (name, domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    };

    const logout = () => {
        removeCookie('token', import.meta.env.VITE_LOGOUT_TOKEN);
        navigate('/');
        window.location.reload();
      };
      
    const location = useLocation();
    const currentPathname = location.pathname;

    const menuItemTitle = menuItems.find((menuItem) => currentPathname === menuItem.link)?.title;
    const indexMenuItemTitle = indexMenuItems.find((menuItem) => currentPathname === menuItem.url)?.title;

    const pageTitle = menuItemTitle || indexMenuItemTitle || 'ค้นหานิสิต';


    return (
        <div className='fixed sm:m-0 w-full bg-gray-800 sm:left-64 z-40 shadow-lg'>
            <div
                className='flex flex-row mr-20 space-x-5  text pt-5 sm:h-20'
                style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
            >
                <div className='text-white text-left pl-14 text-3xl align-middle flex-none w-64 relative basis-1/2 '>
                    {pageTitle}
                </div>
                <div className='text-white text-m pr-10 text-center flex-1 w-32 relative'>
                    <button
                        onClick={logout}
                        className='text-white text-lg flex-1 w-32 relative duration-100 hover:text-gray-500'>
                        ออกจากระบบ
                    </button>
                    <span>
                        ยินดีต้อนรับคุณ {displayName}
                    </span>
                </div>
            </div>

        </div>
    );
}

export default StaffHeaderBar;