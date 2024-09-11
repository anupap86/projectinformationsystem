import React, { useEffect, useRef, useState } from 'react';//========origin============//
import withAuth from '../../../utils/withAuth';//========origin============//
import StaffFrame from '../../../components/MainLayout/StaffFrame';//========origin============//
import Cookies from 'js-cookie';//========origin============//
import Chart from 'chart.js/auto';//========origin============//
import axios from 'axios';//========origin============//

import POCKmain from '../../../components/filter/pocketmoney/POCKETmail';//========origin============//
import Address from "../../../components/filter/Location/Sector";//========origin============//
import Newsmain from '../../../components/filter/News/NewMain';//========origin============//
import RewarMain from '../../../components/filter/reward/RewMain';//========origin============//
import WorkingMain from '../../../components/filter/working/WorkingMain';//========origin============//
import FamInc from '../../../components/filter/FamilyIncome/FamInc';//========origin============//

const getAxiosConfig = () => {
  const token = Cookies.get('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};

const URL_API = import.meta.env.VITE_API_URL;

const Graph = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  //===usestateของdropdownหลัก==================//
  const [dropdown, setdropdown] = useState("");
  //dropdownย่อย
  //เงินfamily===================================================//
  const [MomOrDad, setMomOrDad] = useState("");
  //==========ตั้งค่าgraph==========================//
  const [DataChart, setDataChart] = useState([]);
  const [LabelChart, setLabelChart] = useState([]);
  const [OptionChart, setOptionChart] = useState({});
  //======ดูข้อมูล================================//
  const [GedData, setGedData] = useState([]);
  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const config = getAxiosConfig();
        const response = await axios.get(`${URL_API}/allcollection`, config);
        const data = response.data.listing;
        setGedData(data);
        // const SortedYearData = data.filter((item)=>item.education.stuID.length === 11);

        // Transform data into the format required by Chart.js
        const chartData = data.map((item) => {
          const studyRewardCount = Object.keys(item.reward.study || {}).length;
          const workRewardCount = Object.keys(item.reward.work || {}).length;
          return {
            id: item.id,
            studyRewardCount,
            workRewardCount,
          };
        });

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  function TierfirstDropdown(e) {
    setdropdown(e.target.value);
  }

  return (
    <>
      <StaffFrame hideMenuBar={true} />
      <div className='absolute w-0 top-24 -z-10 m-0' style={{ left: '20%' }}>
        <div className='relative m-10 bg border p-10 rounded-lg shadow ' style={{ width: '1200px' }}>
          <select value={dropdown} onChange={TierfirstDropdown}>
            <option value={""}>--เลือกข้อมูล--</option>
            <option value={"PocketMoney"}>รายได้จากผู้ปกครอง</option>
            <option value={"address"}>ที่อยู่นิสิต</option>
            <option value={"News"}>ข่าวสารที่ได้รับ</option>
            <option value={"Reward"}>รางวัลที่ได้รับ</option>
            <option value={"salary"}>เงินเดื่อนหลังจากจบ</option>
            <option value={"familyincome"}>รายได้ครอบครัว</option>
          </select>
          {dropdown === "PocketMoney" && <POCKmain dataForPock={GedData} />}
          {dropdown === "address" && <Address dataforAd={GedData} />}
          {dropdown === "News" && <Newsmain dataNews={GedData} dopdow={dropdown} />}
          {dropdown === "Reward" && <RewarMain dataRew={GedData} />}
          {dropdown === "salary" && <WorkingMain dataSal={GedData} />}
          {dropdown === "familyincome" && <FamInc datafam={GedData} />}
        </div>
      </div>
    </>
  );
};

export default withAuth(Graph);