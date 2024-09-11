import React, { useEffect, useRef, useState } from 'react';//========origin============//
import withAuth from '../../../utils/withAuth';//========origin============//
import StaffFrame from '../../../components/MainLayout/StaffFrame';//========origin============//
import Cookies from 'js-cookie';//========origin============//
import Chart from 'chart.js/auto';//========origin============//
import axios from 'axios';//========origin============//

const getAxiosConfig = () => {
  const token = Cookies.get('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};

const Graph = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  //===usestateของdropdownหลัก==================//
  const [dropdown,setdropdown] = useState("");
  //dropdownย่อย
  //ที่อยูุ่
  const [Section,setSection] = useState("");
  const [selectedProvince,setselectedProvince] = useState("");
  const [Forprovinces,setForprovince] = useState("");
  //ค่าขนม
  const [PockSys,setPockSys] = useState("");
  const [LuksootPoc,setLuksootPoc] = useState("");
  const [PockYear,setPockYear] = useState("");
  //ข่าวสาร=====================================================//
  const [schormajor,setschormajor] = useState("");
  const [SchoolOfNews,setSchoolOfNews]= useState("");
  const [UniverOfNews,setUniverOfNews] = useState("");
  //รางวัล=====================================================//
  const [RewStudyorWork,setRewStudyorWork]=useState("");
  const [RewOfType,setRewOfType]=useState("");
  const [PewofPhak,setPewofPhak]=useState("");
  //เงินfamily===================================================//
  const [MomOrDad,setMomOrDad] = useState("");
    //==========ตั้งค่าgraph==========================//
    const [DataChart,setDataChart] = useState([]);
    const [LabelChart,setLabelChart] = useState([]);
    const [OptionChart,setOptionChart] = useState({});
    //======ดูข้อมูล================================//
    const [GedData,setGedData] = useState([]);
  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const config = getAxiosConfig();
        const response = await axios.get('http://localhost:3000/api/allcollection', config);
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
//=====================ค่าขนม=================================//
const PockMOnTier = ["ต่ำกว่า5000","5000-10000","10000-15000","15000-20000","มากกว่า20000"];
  const DataForPocket = GedData.filter((item) => { return item.profile.income !== undefined && item.education.stuID !== undefined 
    && item.education.stuID.length === 11 && item.education !== undefined && item.education.course !== undefined 
    && item.education.major !== undefined && PockMOnTier.includes(item.profile.income)})
  .sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });
/////==============ภาควิชา=====================================================///
const HowManyYear = Array.from(new Set(DataForPocket.map((index)=>{return index.education.stuID.slice(0,2)})));
const YearPokple = new Array(HowManyYear.length).fill(0);
const PhakAllPeo = [];
for (let a = 0; a < PockMOnTier.length; a++) {
  PhakAllPeo.push(Array.from(YearPokple)); // create a new array for each element of PhakAllPeo
}

DataForPocket.forEach((index) => {
  for (let a = 0; a < PockMOnTier.length; a++) {
      for (let b = 0; b < HowManyYear.length; b++) {
        if (HowManyYear[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
          PhakAllPeo[a][b] +=1;
        }
      }
  }
});



// console.log(HowManyYear);
  function MoneyPocket(){

    let Phakwicha = Array.from(new Set(DataForPocket.map((index)=>{ return index.education.major})));

    let  luksoot = Array.from(new Set(DataForPocket.filter((item)=>{return item.education.major === PockSys})
    .map((index)=>{return index.education.course})));

    let PeeSuksa = Array.from(new Set(DataForPocket.filter((item)=>{return item.education.course === LuksootPoc})
    .map((index)=>{return index.education.stuID.slice(0,2)})));

/////=========================เลือกภาควิชา=======================================================================/////
    function PhakPock(e) {
      setPockSys(e.target.value);
    }
    function PhakPockUpdate() {
      let PHakData = DataForPocket.filter((item)=>{return item.education.major === PockSys});
      let whatYearPhak = Array.from(new Set(PHakData.map((index)=>{return index.education.stuID.slice(0,2)})));
      let YearPhak = [];
      let RangePhak = [];
  
      for (let a = 0; a < whatYearPhak.length; a++) {
        YearPhak.push(0);
      }
  
      for (let a = 0; a < PockMOnTier.length; a++) {  
        RangePhak.push(YearPhak);
      }
      
      PHakData.forEach((index)=>{
        for (let a = 0; a < PockMOnTier.length; a++) {
          if (PockMOnTier[a]===index.profile.income) {
            for (let b = 0; b < whatYearPhak.length; b++) {
              if (whatYearPhak[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
                RangePhak[a][b] +=1;
              }
            }
          }
        }
      });
      let ChartDataProv = [];
  
      for (let a = 0; a < ProvNAmePeo.length; a++) {
        ChartDataProv.push({
          label: whatYearPhak[a],
          data: RangePhak[a],
          borderWidth: 1,
        })
      }
      setDataChart(whatYearPhak);
      setLabelChart(ChartDataProv);
      setOptionChart({
        plugins: {
          title: {
            display: true,
            text: 'รายได้ของนิสิตแต่ละภาควิชา'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      });
    }

    if (PockSys) {
      PhakPockUpdate;
    }

//=======================เลือกหลักสูตร=======================================================//
function LucksootrOfPock(e) {
  setLuksootPoc(e.target.value)
  let luksoot = DataForPocket.filter((item)=>{return item.education.major === PockSys && item.education.course === LuksootPoc});
  let whatYearluksoot = Array.from(new Set(luksoot.map((index)=>{return index.education.stuID.slice(0,2)})));
  let Yearsoot = [];
  let Rangesoot = [];

  for (let a = 0; a < whatYearluksoot.length; a++) {
    Yearsoot.push(0);
  }

  for (let a = 0; a < PockMOnTier.length; a++) {
    Rangesoot.push(Yearsoot);
  }

  luksoot.forEach((index)=>{
    for (let a = 0; a < PockMOnTier.length; a++) {
      if (PockMOnTier[a]===index.profile.income) {
        for (let b = 0; b < whatYearPhak.length; b++) {
          if (whatYearluksoot[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
            Rangesoot[a][b] +=1;
          }
        }
      }
    }
  });

  let ChartDataProv = [];

  for (let a = 0; a < ProvNAmePeo.length; a++) {
    ChartDataProv.push({
      label: whatsoot[a],
      data: Rangesoot[a],
      borderWidth: 1,
    })
  }
  setDataChart(whatYearPhak);
  setLabelChart(ChartDataProv);
  setOptionChart({
    plugins: {
      title: {
        display: true,
        text: 'รายได้ของนิสิตแต่ละภาควิชาแต่ละหลักสูตร'
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    }
  });
  
}
//===================================================================================//
//==========================เลือกปี====================================================//
function YearOfPock(e) {
  setPockYear(e.target.value)
  let luksoot = DataForPocket.filter((item)=>{return item.education.course === LuksootPoc && item.education.major === PockSys && item.education.course === LuksootPoc});
  let whatYearluksoot = Array.from(new Set(luksoot.map((index)=>{return index.education.stuID.slice(0,2)})));
  let Yearsoot = [];
  let Rangesoot = [];

  for (let a = 0; a < whatYearluksoot.length; a++) {
    Yearsoot.push(0);
  }

  for (let a = 0; a < PockMOnTier.length; a++) {
    Rangesoot.push(Yearsoot);
  }

  luksoot.forEach((index)=>{
    for (let a = 0; a < PockMOnTier.length; a++) {
      if (PockMOnTier[a]===index.profile.income) {
        for (let b = 0; b < whatYearPhak.length; b++) {
          if (whatYearluksoot[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
            Rangesoot[a][b] +=1;
          }
        }
      }
    }
  });

  let ChartDataProv = [];

  for (let a = 0; a < ProvNAmePeo.length; a++) {
    ChartDataProv.push({
      label: whatsoot[a],
      data: Rangesoot[a],
      borderWidth: 1,
    })
  }
  setDataChart(whatYearPhak);
  setLabelChart(ChartDataProv);
  setOptionChart({
    plugins: {
      title: {
        display: true,
        text: 'รายได้ของนิสิตแต่ละหลักสูตรในแต่ละปี'
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    }
  });
}


    return (
      <div>
        <select value={PockSys} onChange={PhakPock}>
          <option value={""}>--เลือกภาควิชา--</option>
          {Phakwicha.map((index)=>{
            return <option key={index} value={index}>{index}</option>
          })}
        </select>
        {PockSys && (
          <span>
            <select value={LuksootPoc} onChange={LucksootrOfPock}>
            <option value={""}>--เลือกหลักสูตร--</option>
            {luksoot.map((index)=>{
              return <option key={index} value={index}>{index}</option>
            })}
            </select>
            {LuksootPoc && (
            <select value={PockYear} onChange={YearOfPock}>
              <option value={""}>--เลือกปี--</option>
              {PeeSuksa.map((index)=>{
                return <option key={index} value={index}>{index}</option>
              })}
            </select>
          )}
          </span>
          
        )}
      </div>
    );
  }
//====================location==================================//
const provincesBySector = {
  "ภาคเหนือ":['เชียงใหม่', 'แม่ฮ่องสอน', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'พะเยา', 'แพร่', 'น่าน', 'อุตรดิตถ์', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'กำแพงเพชร', 'เพชรบูรณ์', 'พิจิตร'],
  "ภาคกลาง":['กรุงเทพมหานคร','อุทัยธานี','ชัยนาท','นครสวรรค์','นนทบุรี','ปทุมธานี','พระนครศรีอยุธยา','ลพบุรี','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระบุรี','สิงห์บุรี','อ่างทอง'],
  "ภาคตะวันออก": ['ชลบุรี','ระยอง','จันทบุรี','ตราด','นครนายก','ฉะเชิงเทรา','ปราจีนบุรี','สระแก้ว'],
  "ภาคตะวันตก": ['กาญจนบุรี', 'ประจวบคีรีขันธ์', 'สุพรรณบุรี', 'เพชรบุรี', 'นครปฐม', 'ราชบุรี'],
  "ภาคตะวันออกเฉียงเหนือ": ['กาฬสินธุ์','ขอนแก่น','ชัยภูมิ','นครพนม','นครราชสีมา','บุรีรัมย์','มหาสารคาม','มุกดาหาร','ยโสธร','ร้อยเอ็ด','เลย','ศรีสะเกษ','สกลนคร','สุรินทร์','หนองคาย','หนองบัวลำภู','อุดรธานี','อุบลราชธานี','อำนาจเจริญ'],
  "ภาคใต้":["กระบี่","ชุมพร","ตรัง","นครศรีธรรมราช","นราธิวาส","ปัตตานี","พังงา","พัทลุง","ภูเก็ต","ยะลา","ระนอง","สงขลา","สตูล","สุราษฎร์ธานี"]
  };

  const DataforAddress = GedData.filter((item) => {
    return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.address.province !== undefined;
  }).sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });
//ใช้หาlabelจากstuidและหาค่าไปใส่ในdataของกราฟจากddหลัก
  let eeryID = DataforAddress.map((index)=>{return index.education.stuID;});
    let yeerWhere = DataforAddress.map((index)=>{return index.address.province;});
    let SectorPeople =[[],[],[],[],[],[]]//north central east west esan southข้อมูลอันนี้นะ
    let IdYear = [];//get year by stuid
    let toKnowSector = Object.keys(provincesBySector);
    for (let a = 0; a < eeryID.length; a++) {
      if (!IdYear.includes(eeryID[a].slice(0,2))) {
        IdYear.push(eeryID[a].slice(0,2));
      }
    }
    for (let a = 0; a < SectorPeople.length; a++) {
      for (let b = 0; b < IdYear.length; b++) {
        SectorPeople[a].push(0);
      } 
    }
    DataforAddress.map((index)=>{
      for (let a = 0; a < toKnowSector.length; a++) {
        if (provincesBySector[toKnowSector[a]].includes(index.address.province)) {
          for (let b = 0; b < IdYear.length; b++) {
            if (IdYear[b]=== index.education.stuID.slice(0,2)) {
              SectorPeople[a][b] +=1;
            }
          }
        }
      }
    });
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
//เอาข้อมูลจังหวัดใส่chart  
  function AddressEng (){
    let Thatdistric = Array.from(new Set(DataforAddress.filter((item)=>{return item.address.province === selectedProvince}).map((index)=>{return index.address.district})));

    function PeopleSector(e) {
      setSection(e.target.value);
      setselectedProvince("");
    
      let JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
      let yearProv = Array(JustYear.length).fill(0); // number of people per year
      let ProvNAmePeo = Array.from(new Set(DataforAddress.filter((item) => provincesBySector[Section].includes(item.address.province)).map((index) => index.address.province))); // province names
      let ProvPeoNum = Array(ProvNAmePeo.length).fill().map(() => yearProv.slice()); // number of people per province per year
    
      DataforAddress.forEach((index) => {
        for (let a = 0; a < ProvNAmePeo.length; a++) {
          for (let b = 0; b < JustYear.length; b++) {
            if (ProvNAmePeo[a] === index.address.province && JustYear[b] === index.education.stuID.slice(0, 2)) {
              ProvPeoNum[a][b] += 1;
            }
          }
        }
      });
    
      //console.log(ProvPeoNum);

      let ChartDataProv = [];

      for (let a = 0; a < ProvNAmePeo.length; a++) {
        ChartDataProv.push({
          label: ProvNAmePeo[a],
          data: ProvPeoNum[a],
          borderWidth: 1,
        })
      }

      setDataChart(ChartDataProv);
      setLabelChart(JustYear);
      setOptionChart({
        plugins: {
          title: {
            display: true,
            text: 'จำนวนนักเรียนจากแต่ละจังหวัด'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      });
    }

    // useState(() => {
    //   let JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
    //   let yearProv = Array(JustYear.length).fill(0); // number of people per year
    //   let ProvNAmePeo = Array.from(new Set(DataforAddress.filter((item) => provincesBySector[Section].includes(item.address.province)).map((index) => index.address.province))); // province names
    //   let ProvPeoNum = Array(ProvNAmePeo.length).fill().map(() => yearProv.slice()); // number of people per province per year
    
    //   DataforAddress.forEach((index) => {
    //     for (let a = 0; a < ProvNAmePeo.length; a++) {
    //       for (let b = 0; b < JustYear.length; b++) {
    //         if (ProvNAmePeo[a] === index.address.province && JustYear[b] === index.education.stuID.slice(0, 2)) {
    //           ProvPeoNum[a][b] += 1;
    //         }
    //       }
    //     }
    //   });
    
    //   let ChartDataProv = [];
    
    //   for (let a = 0; a < ProvNAmePeo.length; a++) {
    //     ChartDataProv.push({
    //       label: ProvNAmePeo[a],
    //       data: ProvPeoNum[a],
    //       borderWidth: 1,
    //     })
    //   }
    
    //   setDataChart(ChartDataProv);
    //   setLabelChart(JustYear);
    //   setOptionChart({
    //     plugins: {
    //       title: {
    //         display: true,
    //         text: 'จำนวนนักเรียนจากแต่ละจังหวัด'
    //       },
    //     },
    //     responsive: true,
    //     scales: {
    //       x: {
    //         stacked: true,
    //       },
    //       y: {
    //         stacked: true
    //       }
    //     }
    //   });
    // }, [Section]);

    ////////////////////////////////////////////////////
    function peopleProvince(e) {
      setselectedProvince(e.target.value);
      let JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
      let Thedistrict = Array.from(new Set(DataforAddress.filter((item)=>{return item.address.province === selectedProvince})
      .map((index)=>{return index.address.district})));
      let yearProv = Array(JustYear.length).fill(0); // number of people per year
      let ProvPeoNum = Array(Thedistrict.length).fill().map(() => yearProv.slice()); // number of people per province per year

      DataforAddress.forEach((index) => {
        for (let a = 0; a < Thedistrict.length; a++) {
          for (let b = 0; b < JustYear.length; b++) {
            if (Thedistrict[a] === index.address.district && JustYear[b] === index.education.stuID.slice(0, 2)) {
              ProvPeoNum[a][b] += 1;
            }
          }
        }
      });

      let ChartDataProv = [];

      for (let a = 0; a < Thedistrict.length; a++) {
        ChartDataProv.push({
          label: Thedistrict[a],
          data: ProvPeoNum[a],
          borderWidth: 1,
        })
      }

      setDataChart(ChartDataProv);
      setLabelChart(JustYear);
      setOptionChart({
        plugins: {
          title: {
            display: true,
            text: 'จำนวนนักเรียนจากแต่ละอำเภอจากแต่ละจังหวัด'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      });
    }
    
////////////////////////////////////////////////////////////////////
//////อำเภอ////////////////////////////////////////////////////////////
function peopledistric(e) {
  setForprovince(e.target.value);
  let JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
  let Thedistrict = DataforAddress.filter((item)=>{return item.address.district === Forprovinces})
  let yearProv = []; // number of people per year

  for (let a = 0; a < JustYear.length; a++) {
    yearProv.push(0);
  }

  Thedistrict.forEach((index) => {
      for (let b = 0; b < JustYear.length; b++) {
        if (JustYear[b] === index.education.stuID.slice(0, 2)) {
          yearProv[b] += 1;
        }
      }
    }
  );
  // console.log(yearProv);

  setDataChart([{
    label: Forprovinces,
    data: yearProv,
    borderWidth: 1,
  }]);
  setLabelChart(JustYear);
  setOptionChart({
    plugins: {
      title: {
        display: true,
        text: 'จำนวนนักเรียนจากอำเภอแต่ละปี'
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    }
  });
}
/////////////////////////////////////////////////////
    return(
      <div>
        <select value={Section} onChange={PeopleSector}>
        <option value="">--Select a sector--</option>
        {Object.keys(provincesBySector).map((sector) => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
        </select>
        {Section && (
          <select value={selectedProvince} onChange={peopleProvince}>
          <option value="">--Select a Province--</option>
          {provincesBySector[Section].map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
          </select>
        )}
        {selectedProvince && (
          <select value={Forprovinces} onChange={peopledistric}>
            <option>--เลือกอำเภอ--</option>
            {Thatdistric.map((index)=>{
              return <option key={index} value={index}>{index}</option>
            })}
          </select>
        )}
      </div>
    );
  }

//news
const DataForNews = GedData.filter((item) => {
  return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.education !== undefined && item.education.eduBefore !== undefined
  && item.education.major !== undefined && item.education.newSources !== undefined})
  .sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });
const RawNews = DataForNews.map((index)=>{return index.education.newSources})
const RrecNews = [];
for (let a = 0; a < RawNews.length; a++) {
  for (let b = 0; b < RawNews[a].length; b++) {
    RrecNews.push(RawNews[a][b])
  }  
}

const theYearNews = Array.from(new Set(DataForNews.map((index) => index.education.stuID.slice(0, 2))));
const NonrepNews = Array.from(new Set(RrecNews));
const NewsNews = [];

for (let a = 0; a < NonrepNews.length; a++) {
  const yeerNews = Array.from({ length: theYearNews.length }, () => 0);
  NewsNews.push(yeerNews);
}

DataForNews.forEach((index) => {
  let somenews = index.education.newSources.map((RealNews) => RealNews);

  for (let a = 0; a < somenews.length; a++) {
    for (let b = 0; b < NonrepNews.length; b++) {
      if (NonrepNews[b] === somenews[a]) {
        for (let c = 0; c < theYearNews.length; c++) {
          if (NonrepNews[b] === somenews[a] && theYearNews[c] === index.education.stuID.slice(0, 2)) {
            NewsNews[b][c] += 1;
          }
        }
      }
    }
  }
});

// console.log(NewsNews);
// console.log(NonrepNews);


function NewEng(){
  let SchoolList = Array.from(new Set(DataForNews.map((index)=>{return index.education.eduBefore})));
  let UnilList = Array.from(new Set(DataForNews.map((index)=>{return index.education.major})));
  function SchoolNEws(e) {
    setSchoolOfNews(e.target.value)
    let SchNewsData = DataForNews.filter((index)=>{return index.education.eduBefore === SchoolOfNews;})

    let SchRawNews = SchNewsData.map((index)=>{return index.education.newSources})
    let SchRrecNews = [];
    for (let a = 0; a < SchRawNews.length; a++) {
      for (let b = 0; b < SchRawNews[a].length; b++) {
        SchRrecNews.push(SchRawNews[a][b])
      }  
    }

    let SchtheYearNews = Array.from(new Set(SchNewsData.map((index) => index.education.stuID.slice(0, 2))));
    let SchNonrepNews = Array.from(new Set(SchRrecNews));
    let SchNewsNews = [];

    for (let a = 0; a < SchNonrepNews.length; a++) {
      let schyeerNews = Array.from({ length: SchtheYearNews.length }, () => 0);
      SchNewsNews.push(schyeerNews);
    }

    SchNewsData.forEach((index) => {
      let somenews = index.education.newSources.map((RealNews) => RealNews);
    
      for (let a = 0; a < somenews.length; a++) {
        for (let b = 0; b < SchNonrepNews.length; b++) {
          if (SchNonrepNews[b] === somenews[a]) {
            for (let c = 0; c < SchtheYearNews.length; c++) {
              if (SchNonrepNews[b] === somenews[a] && SchtheYearNews[c] === index.education.stuID.slice(0, 2)) {
                SchNewsNews[b][c] += 1;
              }
            }
          }
        }
      }
    });
    // console.log(SchNewsNews);

    let NewsCase = [];
    for (let a = 0; a < SchNewsNews.length; a++) {
      NewsCase.push({
        label: SchNonrepNews[a],
        data: SchNewsNews[a],
        borderWidth: 1,
      })}

    setDataChart(NewsCase);
    setLabelChart(SchtheYearNews);
    setOptionChart(
      {
        plugins: {
          title: {
            display: true,
            text: 'ข่าวสารที่นักเรียนโรงเรียน'+UniOfNews+'ได้รับแต่ละปี'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    );

  }


  function UniNEws(e) {
    setUniverOfNews(e.target.value)
    let UniNewsData = DataForNews.filter((index)=>{return index.education.major === UniverOfNews;})

    let UniRawNews = UniNewsData.map((index)=>{return index.education.newSources})
    let UniRrecNews = [];
    for (let a = 0; a < UniRawNews.length; a++) {
      for (let b = 0; b < UniRawNews[a].length; b++) {
        UniRrecNews.push(UniRawNews[a][b])
      }  
    }

    let UnitheYearNews = Array.from(new Set(UniNewsData.map((index) => index.education.stuID.slice(0, 2))));
    let UniNonrepNews = Array.from(new Set(UniRrecNews));
    let UniNewsNews = [];

    for (let a = 0; a < UniNonrepNews.length; a++) {
      let schyeerNews = Array.from({ length: UnitheYearNews.length }, () => 0);
      UniNewsNews.push(schyeerNews);
    }

    UniNewsData.forEach((index) => {
      let somenews = index.education.newSources.map((RealNews) => RealNews);
    
      for (let a = 0; a < somenews.length; a++) {
        for (let b = 0; b < UniNonrepNews.length; b++) {
          if (UniNonrepNews[b] === somenews[a]) {
            for (let c = 0; c < UnitheYearNews.length; c++) {
              if (UniNonrepNews[b] === somenews[a] && UnitheYearNews[c] === index.education.stuID.slice(0, 2)) {
                UniNewsNews[b][c] += 1;
              }
            }
          }
        }
      }
    });
    // console.log(UniNewsNews);

    let NewsCase = [];
    for (let a = 0; a < UniNewsNews.length; a++) {
      NewsCase.push({
        label: UniNonrepNews[a],
        data: UniNewsNews[a],
        borderWidth: 1,
      })}

    setDataChart(NewsCase);
    setLabelChart(UnitheYearNews);
    setOptionChart(
      {
        plugins: {
          title: {
            display: true,
            text: 'ข่าวสารที่นิสิตภาค'+UniverOfNews+'ได้รับแต่ละปี'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    );

  }

  return(
    <div>
      <select value={schormajor} onChange={(e)=>{setschormajor(e.target.value)}}>
        <option value={"โรงเรียน"}>โรงเรียน</option>
        <option value={"ภาควิชา"}>ภาควิชา</option>
      </select>
      {schormajor === "โรงเรียน"&&(
          <select value={SchoolOfNews} onChange={SchoolNEws}>
            <option value={""}>--เลือกโรงเรียน--</option>
            {SchoolList.map((index)=>{
          return <option key={index} value={index}>{index}</option>
        })}
          </select>
      )}
      {schormajor === "ภาควิชา"&&(
        <select value={UniverOfNews} onChange={UniNEws}>
          <option value={""}>--เลือกภาควิชา--</option>
          {UnilList.map((index)=>{
            return <option key={index} value={index}>{index}</option>
          })}
        </select>
      )}
    </div>
  );
  }


  //reward
  const DataForRew = GedData.filter((item)=>{return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.reward !== undefined && item.education.major !== undefined})
  .sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });
  const YearRew = Array.from(new Set(DataForRew.filter((index)=>{return index.reward.study !== undefined || index.reward.work !== undefined}).map((index)=>{return index.education.stuID.slice(0,2)})));
  const WhatYearRewStu = [];

  for (let a = 0; a < YearRew.length; a++) {
    WhatYearRewStu.push(0);
  }

  DataForRew.filter((index)=>{return index.reward.study !== undefined }).map((index)=>{
    let THekeeStu = Object.keys(index.reward.study).length;
    let THeYeer = index.education.stuID.slice(0,2);
    for (let a = 0; a < YearRew.length; a++) {
      if (YearRew[a] === THeYeer) {
        WhatYearRewStu[a] += THekeeStu;
      }
    }
  });

  const WhatYearRewWork = [];

  for (let a = 0; a < YearRew.length; a++) {
    WhatYearRewWork.push(0);
  }
  //console.log(WhatYearRewWork);
  DataForRew.filter((index)=>{return index.reward.work !== undefined }).map((index)=>{
    let THekeeStu = Object.keys(index.reward.work).length;
    let THeYeer = index.education.stuID.slice(0,2);
    for (let a = 0; a < YearRew.length; a++) {
      if (YearRew[a] === THeYeer) {
        WhatYearRewWork[a] += THekeeStu;
      }
    }
  });


  function RewEng(){
    let RewStudy =Array.from(new Set(DataForRew.map((index)=>{return index}).filter((item)=>{return item.reward.study !== undefined})));
    let RewWork =Array.from(new Set(DataForRew.map((index)=>{return index}).filter((item)=>{return item.reward.work !== undefined})));
    let RewAll = Array.from(new Set(DataForRew.map((index)=>{return index}).filter((item)=>{return item.reward.study !== undefined || item.reward.work !== undefined})));

    let AllWOrkRew = DataForRew.filter((item)=>{return item.reward.work !== undefined});
    let WOrkWholetypeOfrew = [];
    AllWOrkRew.map((index)=>{
        let THekeeWOrk = Object.keys(index.reward.work);
        for (let a = 0; a < THekeeWOrk.length; a++) {
          WOrkWholetypeOfrew.push(index.reward.work[THekeeWOrk[a]].type);
          // console.log(WholetypeOfrew);
        }
      });
      let WOrksometypeOfrew = Array.from(new Set(WOrkWholetypeOfrew));//ชนิดรางวัลตอนทำงาน
      // console.log(WOrksometypeOfrew);

      function hteTypeoFREw(e) {
        setRewStudyorWork(e.target.value);
        switch (RewStudyorWork) {
          case "study":
            let StuRewYeah = Array.from(new Set(RewStudy.filter((index)=>{return index.reward.study !== undefined})
            .map((index)=>{return index.education.stuID.slice(0,2)}))) //ปีตอนเรียน
            // console.log(StuRewYeah);

            let AllStuRew = DataForRew.filter((item)=>{return item.reward.study !== undefined});
            let StuWholetypeOfrew = [];
            AllStuRew.map((index)=>{
                let THekeeStu = Object.keys(index.reward.study);
                for (let a = 0; a < THekeeStu.length; a++) {
                  StuWholetypeOfrew.push(index.reward.study[THekeeStu[a]].type);
                  //console.log(StuWholetypeOfrew);
                }
              });
            let StusometypeOfrew = Array.from(new Set(StuWholetypeOfrew));//ชนิดรางวัลตอนเรียน
            let stuYearType = [];
            for (let a = 0; a < StusometypeOfrew.length; a++) {
              stuYearType.push([]);
              for (let b = 0; b < StuRewYeah.length; b++) {
                stuYearType[a].push(0);
              }
            }

            // console.log(stuYearType);

            AllStuRew.forEach((index)=>{
              let Thetyp = Object.keys(index.reward.study);
              for (let a = 0; a < Thetyp.length; a++) {
                for (let b = 0; b < StusometypeOfrew.length; b++) {
                  if (StusometypeOfrew[b] === index.reward.study[Thetyp[a]].type) {
                    for (let c = 0; c < StuRewYeah.length; c++) {
                      if (StuRewYeah[c]===index.education.stuID.slice(0, 2) && StusometypeOfrew[b] === index.reward.study[Thetyp[a]].type) {
                        stuYearType[b][c] +=1;
                      }
                    }
                  }
                  }
                }
              
            });

            // console.log(stuYearType);
            let NewsCase = [];
            for (let a = 0; a < stuYearType.length; a++) {
              NewsCase.push({
                label: StusometypeOfrew[a],
                data: stuYearType[a],
                borderWidth: 1,
              })}

            setDataChart(NewsCase);
            setLabelChart(StuRewYeah);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รางวัลที่นิสิตได้รับขณะศึกษาอยู่'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
            break;
          case "work":
            let WorkRewYeah = Array.from(new Set(RewWork.filter((index)=>{return index.reward.work !== undefined})
            .map((index)=>{return index.education.stuID.slice(0,2)}))) //ปีตอนทำงาน
            // console.log(WorkRewYeah);

            let AllworkRew = DataForRew.filter((item)=>{return item.reward.work !== undefined});
            let workWholetypeOfrew = [];
            AllworkRew.map((index)=>{
                let THekeework = Object.keys(index.reward.work);
                for (let a = 0; a < THekeework.length; a++) {
                  workWholetypeOfrew.push(index.reward.work[THekeework[a]].type);
                  //console.log(StuWholetypeOfrew);
                }
              });

            let worksometypeOfrew = Array.from(new Set(workWholetypeOfrew));//ชนิดรางวัลตอนเรียน
            let workYearType = [];
            for (let a = 0; a < worksometypeOfrew.length; a++) {
              workYearType.push([]);
              for (let b = 0; b < WorkRewYeah.length; b++) {
                workYearType[a].push(0);
              }
            }

            AllworkRew.forEach((index)=>{
              let Thetyp = Object.keys(index.reward.work);
              for (let a = 0; a < Thetyp.length; a++) {
                for (let b = 0; b < worksometypeOfrew.length; b++) {
                  if (worksometypeOfrew[b] === index.reward.work[Thetyp[a]].type) {
                    for (let c = 0; c < WorkRewYeah.length; c++) {
                      if (WorkRewYeah[c]===index.education.stuID.slice(0, 2) && worksometypeOfrew[b] === index.reward.work[Thetyp[a]].type) {
                        workYearType[b][c] +=1;
                      }
                    }
                  }
                  }
                }
              
            });

            let WorkNewsCase = [];
            for (let a = 0; a < workYearType.length; a++) {
              WorkNewsCase.push({
                label: worksometypeOfrew[a],
                data: workYearType[a],
                borderWidth: 1,
              })}

            setDataChart(WorkNewsCase);
            setLabelChart(WorkRewYeah);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รางวัลที่นิสิตได้รับเมื่อทำงาน'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
            break;
          default:
            break;
        }
      }
 /////////////////////////////////////////////////////////////////////
      function PhakRew(e) {
        setPewofPhak(e.target.value);
        switch (RewStudyorWork) {
          case "study":
            let StuRewYeah = Array.from(new Set(RewStudy.filter((index)=>{return index.reward.study !== undefined && index.education.major === PewofPhak})
            .map((index)=>{return index.education.stuID.slice(0,2)}))) //ปีตอนเรียน
            // console.log(StuRewYeah);

            let AllStuRew = DataForRew.filter((item)=>{return item.reward.study !== undefined && item.education.major === PewofPhak });
            let StuWholetypeOfrew = [];
            AllStuRew.map((index)=>{
                let THekeeStu = Object.keys(index.reward.study);
                for (let a = 0; a < THekeeStu.length; a++) {
                  StuWholetypeOfrew.push(index.reward.study[THekeeStu[a]].type);
                  //console.log(StuWholetypeOfrew);
                }
              });
            let StusometypeOfrew = Array.from(new Set(StuWholetypeOfrew));//ชนิดรางวัลตอนเรียน
            let stuYearType = [];
            for (let a = 0; a < StusometypeOfrew.length; a++) {
              stuYearType.push([]);
              for (let b = 0; b < StuRewYeah.length; b++) {
                stuYearType[a].push(0);
              }
            }

            // console.log(stuYearType);

            AllStuRew.forEach((index)=>{
              let Thetyp = Object.keys(index.reward.study);
              for (let a = 0; a < Thetyp.length; a++) {
                for (let b = 0; b < StusometypeOfrew.length; b++) {
                  if (StusometypeOfrew[b] === index.reward.study[Thetyp[a]].type) {
                    for (let c = 0; c < StuRewYeah.length; c++) {
                      if (StuRewYeah[c]===index.education.stuID.slice(0, 2) && StusometypeOfrew[b] === index.reward.study[Thetyp[a]].type) {
                        stuYearType[b][c] +=1;
                      }
                    }
                  }
                  }
                }
              
            });

            // console.log(stuYearType);
            let NewsCase = [];
            for (let a = 0; a < stuYearType.length; a++) {
              NewsCase.push({
                label: StusometypeOfrew[a],
                data: stuYearType[a],
                borderWidth: 1,
              })}

            setDataChart(NewsCase);
            setLabelChart(StuRewYeah);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รางวัลที่นิสิตภาควิชา'+PewofPhak+'ได้รับขณะศึกษาอยู่'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
            break;
          case "work":
            let WorkRewYeah = Array.from(new Set(RewWork.filter((index)=>{return index.reward.work !== undefined && index .education.major === PewofPhak})
            .map((index)=>{return index.education.stuID.slice(0,2)}))) //ปีตอนทำงาน
            console.log(WorkRewYeah);

            let AllworkRew = DataForRew.filter((item)=>{return item.reward.work !== undefined && item .education.major === PewofPhak});
            let workWholetypeOfrew = [];
            AllworkRew.map((index)=>{
                let THekeework = Object.keys(index.reward.work);
                for (let a = 0; a < THekeework.length; a++) {
                  workWholetypeOfrew.push(index.reward.work[THekeework[a]].type);
                  //console.log(StuWholetypeOfrew);
                }
              });

            let worksometypeOfrew = Array.from(new Set(workWholetypeOfrew));//ชนิดรางวัลตอนเรียน
            let workYearType = [];
            for (let a = 0; a < worksometypeOfrew.length; a++) {
              workYearType.push([]);
              for (let b = 0; b < WorkRewYeah.length; b++) {
                workYearType[a].push(0);
              }
            }

            AllworkRew.forEach((index)=>{
              let Thetyp = Object.keys(index.reward.work);
              for (let a = 0; a < Thetyp.length; a++) {
                for (let b = 0; b < worksometypeOfrew.length; b++) {
                  if (worksometypeOfrew[b] === index.reward.work[Thetyp[a]].type) {
                    for (let c = 0; c < WorkRewYeah.length; c++) {
                      if (WorkRewYeah[c]===index.education.stuID.slice(0, 2) && worksometypeOfrew[b] === index.reward.work[Thetyp[a]].type) {
                        workYearType[b][c] +=1;
                      }
                    }
                  }
                  }
                }
              
            });

            let WorkNewsCase = [];
            for (let a = 0; a < workYearType.length; a++) {
              WorkNewsCase.push({
                label: worksometypeOfrew[a],
                data: workYearType[a],
                borderWidth: 1,
              })}

            setDataChart(WorkNewsCase);
            setLabelChart(WorkRewYeah);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รางวัลที่นิสิตภาควิชา'+PewofPhak+'ได้รับเมื่อทำงาน'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
            break;
          default:
            break;
        }
      }
        let RewMajor = Array.from(new Set(DataForRew.map((index)=>{
          return index.education.major;
        })));
  return(
    <div>
      <select value={RewStudyorWork} onChange={hteTypeoFREw}>
        <option>--ช่วงเวลาได้รับรางวัล--</option>
        <option value={"study"}>ตอนกำลังศึกษา</option>
        <option value={"work"}>ตอนทำงาน</option>
      </select>
      {RewStudyorWork && (
        <select value={PewofPhak} onChange={PhakRew}>
        <option value={""}>--เลือกภาควิชา--</option>
        {RewMajor.map((index)=>{
          return <option key={index} value={index}>{index}</option>
        })}
        </select>
      )}
    </div>
  );
  }
  //salary
  const SalaryTier = ["ต่ำกว่า10000","10000-20000","20000-30000","30000-40000","40000-50000","มากกว่า50000"];
  const DataForSalary = GedData.filter((item)=>{return item.work_experience !== undefined && item.education.stuID !== undefined 
    && item.education.stuID.length === 11 && Object.keys(item.work_experience).length !== 0})
  .sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });
  const SalData = DataForSalary.map((index)=>{return Object.keys(index.work_experience)});
  const salDataFilted = SalData.filter((index)=>{return index.length !== 0});

  const YearSal = Array.from(new Set(DataForSalary.map((index)=>{return index.education.stuID.slice(0,2)})));
  const SalYearSal = [];
  for (let a = 0; a < SalaryTier.length; a++) {
    SalYearSal.push([]);
    for (let b = 0; b < YearSal.length; b++) {
      SalYearSal[a].push(0);
    }
  }
//console.log(DataForSalary);
DataForSalary.map((index)=>{
    let whatsal = Object.keys(index.work_experience);
    let lengthWhatsal = Object.keys(index.work_experience).length;
    // console.log(index.work_experience[whatsal[lengthWhatsal-1]].income );
    for (let a = 0; a < SalaryTier.length; a++) {
      if (SalaryTier[a]===index.work_experience[whatsal[lengthWhatsal-1]].income) {
        for (let b = 0; b < YearSal.length; b++) {
          if (YearSal[b]===index.education.stuID.slice(0,2)) {
            SalYearSal[a][b] +=1;
          }
          
        }
      }
    }
  });

  const salaryCase = [];
  for (let a = 0; a < SalaryTier.length; a++) {
    salaryCase.push({
      label: SalaryTier[a],
      data: SalYearSal[a],
      borderWidth: 1,
    })}
  

  function SalaryEng(){
    let Phakwicha = Array.from(new Set(DataForSalary.map((index)=>{ return index.education.major})));

    let  luksoot = Array.from(new Set(DataForSalary.filter((item)=>{return item.education.major === PockSys})
    .map((index)=>{return index.education.course})));

    let PeeSuksa = Array.from(new Set(DataForSalary.filter((item)=>{return item.education.course === LuksootPoc && item.education.major === PockSys})
    .map((index)=>{return index.education.stuID.slice(0,2)})));

    function SalaryPhak(e) {
      setPockSys(e.target.value)
      let PhaksalDat = DataForSalary.filter((item)=>{return item.education.major === PockSys});
      
      let PhakSalYear = Array.from(new Set(DataForSalary.map((index)=>{return index.education.stuID.slice(0,2)})));
      let PhakYearArr = [];
      for (let a = 0; a < SalaryTier.length; a++) {
        PhakYearArr.push([]);
        for (let b = 0; b < PhakSalYear.length; b++) {
          PhakYearArr[a].push(0);
        }
      }

      PhaksalDat.map((index)=>{
        let whatsal = Object.keys(index.work_experience);
        let lengthWhatsal = Object.keys(index.work_experience).length;
        // console.log(index.work_experience[whatsal[lengthWhatsal-1]].income );
        for (let a = 0; a < SalaryTier.length; a++) {
          if (SalaryTier[a]===index.work_experience[whatsal[lengthWhatsal-1]].income) {
            for (let b = 0; b < PhakSalYear.length; b++) {
              if (PhakSalYear[b]===index.education.stuID.slice(0,2)) {
                PhakYearArr[a][b] +=1;
              }

            }
          }
        }
      });
      //console.log(PhakYearArr);

      let WorkNewsCase = [];
            for (let a = 0; a < SalaryTier.length; a++) {
              WorkNewsCase.push({
                label: SalaryTier[a],
                data: PhakYearArr[a],
                borderWidth: 1,
              })}

            setDataChart(WorkNewsCase);
            setLabelChart(PhakSalYear);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รายได้ที่ที่นิสิตภาควิชา'+PockSys+'ได้รับเมื่อทำงาน'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
    }
    

    function SalaryLuksoot(e) {
      setLuksootPoc(e.target.value)
      let PhaksalDat = DataForSalary.filter((item)=>{return item.education.major === PockSys && item.education.course === LuksootPoc});
      
      let PhakSalYear = Array.from(new Set(DataForSalary.map((index)=>{return index.education.stuID.slice(0,2)})));
      let PhakYearArr = [];
      for (let a = 0; a < SalaryTier.length; a++) {
        PhakYearArr.push([]);
        for (let b = 0; b < PhakSalYear.length; b++) {
          PhakYearArr[a].push(0);
        }
      }

      PhaksalDat.map((index)=>{
        let whatsal = Object.keys(index.work_experience);
        let lengthWhatsal = Object.keys(index.work_experience).length;
        // console.log(index.work_experience[whatsal[lengthWhatsal-1]].income );
        for (let a = 0; a < SalaryTier.length; a++) {
          if (SalaryTier[a]===index.work_experience[whatsal[lengthWhatsal-1]].income) {
            for (let b = 0; b < PhakSalYear.length; b++) {
              if (PhakSalYear[b]===index.education.stuID.slice(0,2)) {
                PhakYearArr[a][b] +=1;
              }

            }
          }
        }
      });
      //console.log(PhakYearArr);

      let WorkNewsCase = [];
            for (let a = 0; a < SalaryTier.length; a++) {
              WorkNewsCase.push({
                label: SalaryTier[a],
                data: PhakYearArr[a],
                borderWidth: 1,
              })}

            setDataChart(WorkNewsCase);
            setLabelChart(PhakSalYear);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รายได้ที่ที่นิสิตภาควิชา'+PockSys+'หลักสูตร'+LuksootPoc+'ได้รับเมื่อทำงาน'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
    }

    function Salarypee(e) {
      setPockYear(e.target.value)
      let PhaksalDat = DataForSalary.filter((item)=>{return item.education.major === PockSys && item.education.course === LuksootPoc
      && item.education.stuID.slice(0,2) === PockYear});
      
      let PhakSalYear = Array.from(new Set(DataForSalary.map((index)=>{return index.education.stuID.slice(0,2)})));
      let PhakYearArr = [];
      for (let a = 0; a < SalaryTier.length; a++) {
        PhakYearArr.push([]);
        for (let b = 0; b < PhakSalYear.length; b++) {
          PhakYearArr[a].push(0);
        }
      }

      PhaksalDat.map((index)=>{
        let whatsal = Object.keys(index.work_experience);
        let lengthWhatsal = Object.keys(index.work_experience).length;
        // console.log(index.work_experience[whatsal[lengthWhatsal-1]].income );
        for (let a = 0; a < SalaryTier.length; a++) {
          if (SalaryTier[a]===index.work_experience[whatsal[lengthWhatsal-1]].income) {
            for (let b = 0; b < PhakSalYear.length; b++) {
              if (PhakSalYear[b]===index.education.stuID.slice(0,2)) {
                PhakYearArr[a][b] +=1;
              }

            }
          }
        }
      });
      //console.log(PhakYearArr);

      let WorkNewsCase = [];
            for (let a = 0; a < SalaryTier.length; a++) {
              WorkNewsCase.push({
                label: SalaryTier[a],
                data: PhakYearArr[a],
                borderWidth: 1,
              })}

            setDataChart(WorkNewsCase);
            setLabelChart(PhakSalYear);
            setOptionChart({
                    plugins: {
                      title: {
                        display: true,
                        text: 'รายได้ที่ที่นิสิตภาควิชา'+PockSys+'หลักสูตร'+LuksootPoc+'ปี'+PockYear+'ได้รับเมื่อทำงาน'
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true
                      }
                    }
                  });
    }


    

    return (
      <div>
        <select value={PockSys} onChange={SalaryPhak}>
          <option>--เลือกภาควิชา--</option>
          {Phakwicha.map((index)=>{
            return <option key={index} value={index}>{index}</option>
          })}
        </select>
        {PockSys && (
          <select value={LuksootPoc} onChange={SalaryLuksoot}>
            <option value={""}>--เลือกหลักสูตร--</option>
            {luksoot.map((index)=>{
              return <option key={index} value={index}>{index}</option>
            })}
          </select>
        )}
        {LuksootPoc && (
          <select value={PockYear} onChange={Salarypee}>
            <option value={""}>--เลือกปี--</option>
            {PeeSuksa.map((index)=>{
              return <option key={index} value={index}>{index}</option>
            })}
          </select>
        )}
      </div>
    );
  }
  //familyincome
  const DataForFamilyInc = GedData.filter((item)=>{return item.education.stuID !== undefined && item.education.stuID.length === 11
  && item.family_information !== undefined})
  .sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });

  const IncTier = ['ต่ำกว่า 150000','150000-300000','300000-500000','500000-750000','750000-1ล้าน','2ล้าน-5ล้าน','มากวว่า 5ล้าน'];

  const wholeFamily = DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined || item.family_information.mother !== undefined}).map((index)=>{return index});
  const fatherinc = wholeFamily.filter((item)=>{return item.family_information.father !== undefined}).map((index)=>{return index.family_information.father.income});
  const Motherrinc = wholeFamily.filter((item)=>{return item.family_information.mother !== undefined}).map((index)=>{return index.family_information.mother.income});

  const FamIncYear = Array.from(new Set(wholeFamily.map((index)=>{return index.education.stuID.slice(0,2)})));
  const ArrIncFamYear = [];
  for (let a = 0; a < IncTier.length; a++) {
    ArrIncFamYear.push([]);
    for (let b = 0; b < FamIncYear.length; b++) {
      ArrIncFamYear[a].push(0)
    }
  }
  wholeFamily.map((index)=>{
    for (let a = 0; a < IncTier.length; a++) {
      if (IncTier[a]===index.family_information.father.income || IncTier[a]===index.family_information.mother.income) {
        for (let b = 0; b < FamIncYear.length; b++) {
          if (FamIncYear[b]===index.education.stuID.slice(0,2)) {
            ArrIncFamYear[a][b] +=1;
          }
        }
      }
    }
  })
  // console.log(ArrIncFamYear);

  let FamIncsCase = [];
  for (let a = 0; a < IncTier.length; a++) {
    FamIncsCase.push({
      label: IncTier[a],
      data: ArrIncFamYear[a],
      borderWidth: 1,
    })}

  function FamilyIncEng(){
    let Phakwicha = Array.from(new Set(DataForFamilyInc.map((index)=>{ return index.education.major})));

    let  luksoot = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.education.major === PockSys})
    .map((index)=>{return index.education.course})));

    let PeeSuksa = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.education.major === PockSys && item.education.course === LuksootPoc})
    .map((index)=>{return index.education.stuID.slice(0,2)})));

    function MOmDad(e) {
      setMomOrDad(e.target.value);
      switch (MomOrDad) {
        case "father":
          let DadYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          let DadInc = (DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined}));

          let letDadIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letDadIncArr.push([]);
            for (let b = 0; b < DadYearInc.length; b++) {
              letDadIncArr[a].push(0)
            }
          }

          DadInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.father.income) {
                for (let b = 0; b < DadYearInc.length; b++) {
                  if (DadYearInc[b] === index.education.stuID.slice(0,2)) {
                    letDadIncArr[a][b] +=1;
                  }
                }
              }
            }
          })

          let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letDadIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(FamIncYear);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้บิดาของนิสิตต่อปี'
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          //console.log(letDadIncArr);
          break;
        case "mother":
          let MomYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          // console.log(MomYearInc);
          let MomInc = (DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined}));

          let letMomIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letMomIncArr.push([]);
            for (let b = 0; b < MomYearInc.length; b++) {
              letMomIncArr[a].push(0)
            }
          }

          MomInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.mother.income) {
                for (let b = 0; b < MomYearInc.length; b++) {
                  if (MomYearInc[b] === index.education.stuID.slice(0,2)) {
                    letMomIncArr[a][b] +=1;
                  }
                }
              }
            }

            let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letMomIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(MomYearInc);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้มารดาของนิสิตต่อปี'
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          })
          break;  
        default:
          break;
      }
    }

    function PhakFam(e) {
      setPockSys(e.target.value);
      switch (MomOrDad) {
        case "father":
          let DadYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === PockSys})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          let DadInc = (DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === PockSys}));

          let letDadIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letDadIncArr.push([]);
            for (let b = 0; b < DadYearInc.length; b++) {
              letDadIncArr[a].push(0)
            }
          }

          DadInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.father.income) {
                for (let b = 0; b < DadYearInc.length; b++) {
                  if (DadYearInc[b] === index.education.stuID.slice(0,2)) {
                    letDadIncArr[a][b] +=1;
                  }
                }
              }
            }
          })

          let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letDadIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(FamIncYear);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้บิดาของนิสิตภาควิชา'+PockSys+'ต่อปี'
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          // console.log(letDadIncArr);
          break;
        case "mother":
          let MomYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined && item.education.major === PockSys})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          // console.log(MomYearInc);
          let MomInc = (DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined && item.education.major === PockSys}));

          let letMomIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letMomIncArr.push([]);
            for (let b = 0; b < MomYearInc.length; b++) {
              letMomIncArr[a].push(0)
            }
          }

          MomInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.mother.income) {
                for (let b = 0; b < MomYearInc.length; b++) {
                  if (MomYearInc[b] === index.education.stuID.slice(0,2)) {
                    letMomIncArr[a][b] +=1;
                  }
                }
              }
            }

            let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letMomIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(MomYearInc);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้มารดาของนิสิตภาควิชา'+PockSys+'ต่อปี'
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          })
          break;  
        default:
          break;
      }
    }
    
    function luksootFam(e) {
      setLuksootPoc(e.target.value);
      switch (MomOrDad) {
        case "father":
          let DadYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === PockSys
          && item.education.course === LuksootPoc})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          let DadInc = (DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === PockSys
            && item.education.course === LuksootPoc}));

          let letDadIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letDadIncArr.push([]);
            for (let b = 0; b < DadYearInc.length; b++) {
              letDadIncArr[a].push(0)
            }
          }

          DadInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.father.income) {
                for (let b = 0; b < DadYearInc.length; b++) {
                  if (DadYearInc[b] === index.education.stuID.slice(0,2)) {
                    letDadIncArr[a][b] +=1;
                  }
                }
              }
            }
          })

          let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letDadIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(FamIncYear);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้มารดาของนิสิตภาควิชา'+PockSys+'หลักสูตร'+LuksootPoc+'ต่อปี'
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          //console.log(letDadIncArr);
          break;
        case "mother":
          let MomYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined 
            && item.education.major === PockSys && item.education.course === LuksootPoc})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          // console.log(MomYearInc);
          let MomInc = (DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined && item.education.major === PockSys
            && item.education.course === LuksootPoc}));

          let letMomIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letMomIncArr.push([]);
            for (let b = 0; b < MomYearInc.length; b++) {
              letMomIncArr[a].push(0)
            }
          }

          MomInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.mother.income) {
                for (let b = 0; b < MomYearInc.length; b++) {
                  if (MomYearInc[b] === index.education.stuID.slice(0,2)) {
                    letMomIncArr[a][b] +=1;
                  }
                }
              }
            }

            let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letMomIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(MomYearInc);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้มารดาของนิสิตภาควิชา'+PockSys+'หลักสูตร'+LuksootPoc+'ต่อปี'
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          })
          break;  
        default:
          break;
      }
    }

    function YeerFam(e) {
      setPockYear(e.target.value);
      switch (MomOrDad) {
        case "father":
          let DadYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === PockSys
          && item.education.course === LuksootPoc && item.education.stuID.slice(0,2) === PockYear})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          let DadInc = (DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === PockSys
            && item.education.course === LuksootPoc && item.education.stuID.slice(0,2) === PockYear}));

          let letDadIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letDadIncArr.push([]);
            for (let b = 0; b < DadYearInc.length; b++) {
              letDadIncArr[a].push(0)
            }
          }

          DadInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.father.income) {
                for (let b = 0; b < DadYearInc.length; b++) {
                  if (DadYearInc[b] === index.education.stuID.slice(0,2)) {
                    letDadIncArr[a][b] +=1;
                  }
                }
              }
            }
          })

          let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letDadIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(FamIncYear);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้มารดาของนิสิตภาควิชา'+PockSys+'หลักสูตร'+LuksootPoc+'ปี'+PockYear+""
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          //console.log(letDadIncArr);
          break;
        case "mother":
          let MomYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined 
            && item.education.major === PockSys && item.education.course === LuksootPoc && item.education.stuID.slice(0,2) === PockYear})
          .map((index)=>{return index.education.stuID.slice(0,2)})));
          // console.log(MomYearInc);
          let MomInc = (DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined && item.education.major === PockSys
            && item.education.course === LuksootPoc && item.education.stuID.slice(0,2) === PockYear}));

          let letMomIncArr = [];

          for (let a = 0; a < IncTier.length; a++) {
            letMomIncArr.push([]);
            for (let b = 0; b < MomYearInc.length; b++) {
              letMomIncArr[a].push(0)
            }
          }

          MomInc.map((index)=>{
            for (let a = 0; a < IncTier.length; a++) {
              if (IncTier[a]=== index.family_information.mother.income) {
                for (let b = 0; b < MomYearInc.length; b++) {
                  if (MomYearInc[b] === index.education.stuID.slice(0,2)) {
                    letMomIncArr[a][b] +=1;
                  }
                }
              }
            }

            let DadIncsCase = [];
          for (let a = 0; a < IncTier.length; a++) {
            DadIncsCase.push({
              label: IncTier[a],
              data: letMomIncArr[a],
              borderWidth: 1,
            })}
            setLabelChart(MomYearInc);
            setDataChart(DadIncsCase);
            setOptionChart(
              {
                plugins: {
                  title: {
                    display: true,
                    text: 'รายได้มารดาของนิสิตภาควิชา'+PockSys+'หลักสูตร'+LuksootPoc+'ปี'+PockYear+""
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            );
          })
          break;  
        default:
          break;
      }
    }
    return (
      <div>
        <select value={MomOrDad} onChange={MOmDad}>
          <option>--รายได้ผู้ปกครอง--</option>
          <option value={"mother"}>มารดา</option>
          <option value={"father"}>บิดา</option>
        </select>
        {MomOrDad &&(<select value={PockSys} onChange={PhakFam}>
          <option value={""}>--เลือกภาควิชา--</option>
          {Phakwicha.map((index)=>{
            return <option key={index} value={index}>{index}</option>
          })}
        </select>)}
        {PockSys && (
          <select value={LuksootPoc} onChange={luksootFam}>
            <option value={""}>--เลือกหลักสูตร--</option>
            {luksoot.map((index)=>{
              return <option key={index} value={index}>{index}</option>
            })}
          </select>
        )}
        {LuksootPoc && (
          <select value={PockYear} onChange={YeerFam}>
            <option value={""}>--เลือกปี--</option>
            {PeeSuksa.map((index)=>{
              return <option key={index} value={index}>{index}</option>
            })}
          </select>
        )}
      </div>
    );
  }

  useEffect(() => {
    // Render the chart using Chart.js
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: LabelChart,
        datasets: DataChart,
      },
      options: OptionChart,
    });

    return () => {
      chart.destroy();
    };
  }, [DataChart,LabelChart,OptionChart]);

//เอาข้อมูลใส่chart

useEffect(()=>{
  switch (dropdown) {
    case "address":
      setLabelChart(IdYear);
      setDataChart([{
        label: 'ภาคเหนือ',
        data: SectorPeople[0],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'ภาคกลาง',
        data: SectorPeople[1],
        backgroundColor: 'rgba(108, 176, 80, 0.2)',
        borderColor: 'rgba(108, 176, 80, 1)',
        borderWidth: 1,
      },
      {
        label: 'ภาคตะวันออก',
        data: SectorPeople[2],
        backgroundColor: 'rgba(234, 138, 201, 0.2)',
        borderColor: 'rgba(234, 138, 201, 1)',
        borderWidth: 1,
      },
      {
        label: 'ภาคตะวันตก',
        data: SectorPeople[3],
        backgroundColor: 'rgba(255, 99, 71, 0.2)',
        borderColor: 'rgba(255, 99, 71, 1)',
        borderWidth: 1,
      },
      {
        label: 'ภาคออกเฉียงเหนือ',
        data: SectorPeople[4],
        backgroundColor: 'rgba(70, 138, 201, 0.2)',
        borderColor: 'rgba(70, 138, 201, 1)',
        borderWidth: 1,
      },
      {
        label: 'ภาคใต้',
        data: SectorPeople[5],
        backgroundColor: 'rgba(198, 68, 241, 0.2)',
        borderColor: 'rgba(198, 68, 241, 1)',
        borderWidth: 1,
      },]);
      setOptionChart({
      plugins: {
        title: {
          display: true,
          text: 'จำนวนนักเรียนแต่ละภาค'
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    });
      break;
    case "PocketMoney":
      setLabelChart(HowManyYear);
      setDataChart([{
        label: PockMOnTier[0],
        data: PhakAllPeo[0],
        borderWidth: 1,
      },
      {
        label: PockMOnTier[1],
        data: PhakAllPeo[1],
        borderWidth: 1,
      },
      {
        label: PockMOnTier[2],
        data: PhakAllPeo[2],
        borderWidth: 1,
      },
      {
        label: PockMOnTier[3],
        data: PhakAllPeo[3],
        borderWidth: 1,
      },
      {
        label: PockMOnTier[4],  
        data: PhakAllPeo[4],
        borderWidth: 1,
      },]);
      setOptionChart({
      plugins: {
        title: {
          display: true,
          text: 'รายได้ของนิสิต'
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    });
    break;
    case"News":
    let NewsCase = [];
    for (let a = 0; a < NewsNews.length; a++) {
      NewsCase.push({
        label: NonrepNews[a],
        data: NewsNews[a],
        borderWidth: 1,
      })
    }
    setDataChart(NewsCase);
    setLabelChart(theYearNews);
    setOptionChart({
      plugins: {
        title: {
          display: true,
          text: 'ข่าวสารที่นักเรียนได้รับแต่ละปี'
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    });
    break;
    case "Reward" :
    setDataChart([{
      label: "จำนวนรางวัลที่ได้ช่วงกำลังศึกษา",
      data: WhatYearRewStu,
      borderWidth: 1,
    },{
      label: "จำนวนรางวัลที่ได้ช่วงทำงาน",
      data: WhatYearRewWork,
      borderWidth: 1,
    },]);
    setLabelChart(YearRew);
    setOptionChart({
      plugins: {
        title: {
          display: true,
          text: 'รางวัลที่นิสิตได้รับ'
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    });
    break;
    case "salary" :
      setDataChart(salaryCase);
      setLabelChart(YearSal);
      setOptionChart({
        plugins: {
          title: {
            display: true,
            text: 'รายได้ของนิสิต'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      });
    break;
    case "familyincome":
      setLabelChart(FamIncYear);
      setDataChart(FamIncsCase);
      setOptionChart(
        {
          plugins: {
            title: {
              display: true,
              text: 'รายได้ของผู้ปกครองนิสิตต่อปี'
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
          }
        }
      );
    break;
    default:
      break;
  }
},[dropdown]);

  function TierfirstDropdown(e) {
    setdropdown(e.target.value);
  }

  return (
    <>
      <select value={dropdown} onChange={TierfirstDropdown}>
        <option value={""}>--เลือกข้อมูล--</option>
        <option value={"PocketMoney"}>รายได้จากผู้ปกครอง</option>
        <option value={"address"}>ที่อยู่นิสิต</option>
        <option value={"News"}>ข่าวสารที่ได้รับ</option>
        <option value={"Reward"}>รางวัลที่ได้รับ</option>
        <option value={"salary"}>เงินเดื่อนหลังจากจบ</option>
        <option value={"familyincome"}>รายได้ครอบครัว</option>
      </select>
      {dropdown === "PocketMoney" && MoneyPocket() }
      {dropdown === "address" && AddressEng() }
      {dropdown === "News" && NewEng() }
      {dropdown === "Reward" && RewEng() }
      {dropdown === "salary" && SalaryEng() }
      {dropdown === "familyincome" && FamilyIncEng() }
      <canvas ref={chartRef} />
    </>
  );
};

export default withAuth(Graph);
