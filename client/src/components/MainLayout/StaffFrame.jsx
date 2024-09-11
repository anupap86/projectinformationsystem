import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StaffSideBar from './StaffSidebar'
import StaffHeaderBar from './StaffHeaderBar'
import StaffMenuBar from './StaffMenuBar'

import jwtDecode from 'jwt-decode';
import { useCookies } from 'react-cookie';

function StaffFrame(props) {
  const { selectedUserId, hideMenuBar } = props;

  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const decoded = jwtDecode(token);
  const role = decoded.role;

  const navigate = useNavigate();

  // Define the menu items based on the user's role
  const menuItems = [
    { title: 'ค้นหานิสิต', link: '/management' },
    { title: 'สถิติ', link: '/statistic' },
  ];

  if (role === 'admin') {
    // Show additional menu items for admin users
    menuItems.push(
      { title: 'นิสิตลืมรหัสผ่าน', link: '/reset-password' },
      { title: 'จัดการ Role', link: '/role-manage' }
    );
  }

  const indexMenuItems = [
    { title: 'ประวัติ', url: `/${selectedUserId}/profile` },
    { title: 'ข้อมูลที่อยู่', url: `/${selectedUserId}/address` },
    { title: 'ข้อมูลการศึกษา', url: `/${selectedUserId}/education` },
    { title: 'ข้อมูลรางวัลที่ได้รับ', url: `/${selectedUserId}/rewards` },
    { title: 'ความสามารถทางภาษา', url: `/${selectedUserId}/language-talent` },
    { title: 'ทุนการศึกษา', url: `/${selectedUserId}/scholarship` },
    { title: 'ข้อมูลการทำงาน', url: `/${selectedUserId}/work-detail` },
    { title: 'ข้อมูลครอบครัว', url: `/${selectedUserId}/family-detail` },
    { title: 'การฝึกอบรม', url: `/${selectedUserId}/training-detail` },
    { title: 'กิจกรรมที่เข้าร่วม', url: `/${selectedUserId}/activity-detail` }
  ];

  const handleMenuItemClick = (url) => {
    navigate(url);
  };



  return (
    <>
      <StaffHeaderBar
        menuItems={menuItems}
        indexMenuItems={indexMenuItems}
        selectedUid={selectedUserId}
        onMenuItemClick={handleMenuItemClick}
      />
      <StaffSideBar menuItems={menuItems} />
      {hideMenuBar ? null : (
        <StaffMenuBar
          indexMenuItems={indexMenuItems}
          selectedUid={selectedUserId}
          onMenuItemClick={handleMenuItemClick}
        />
      )}
    </>
  );
}

export default StaffFrame;
