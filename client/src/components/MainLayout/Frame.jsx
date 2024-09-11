import React from 'react'
import HeaderBar from './HeaderBar'
import SideBar from './SideBar'

function Frame() {
    const menuItems = [
        { title: 'ประวัติ', link: '/profile' },
        { title: 'ข้อมูลที่อยู่', link: '/address' },
        { title: 'ข้อมูลการศึกษา', link: '/education' },
        { title: 'ข้อมูลรางวัลที่ได้รับ', link: '/rewards' },
        { title: 'ความสามารถทางภาษา', link: '/language-talent' },
        { title: 'ทุนการศึกษา', link: '/scholarship' },
        { title: 'ข้อมูลการทำงาน', link: '/work-detail' },
        { title: 'ข้อมูลครอบครัว', link: '/family-detail' },
        { title: 'การฝึกอบรม', link: '/training-detail' },
        { title: 'กิจกรรมที่เข้าร่วม', link: '/activity-detail' }
      ]
  return (
    <>
        <HeaderBar menuItems={menuItems}/>
        <SideBar menuItems={menuItems}/>
    </>
  )
}

export default Frame