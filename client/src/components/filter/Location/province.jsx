import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Distric from './distric';

function Province(props) {
    const provincesBySector = {
        "ภาคเหนือ":['เชียงใหม่', 'แม่ฮ่องสอน', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'พะเยา', 'แพร่', 'น่าน', 'อุตรดิตถ์', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'กำแพงเพชร', 'เพชรบูรณ์', 'พิจิตร'],
        "ภาคกลาง":['กรุงเทพมหานคร','อุทัยธานี','ชัยนาท','นครสวรรค์','นนทบุรี','ปทุมธานี','พระนครศรีอยุธยา','ลพบุรี','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระบุรี','สิงห์บุรี','อ่างทอง'],
        "ภาคตะวันออก": ['ชลบุรี','ระยอง','จันทบุรี','ตราด','นครนายก','ฉะเชิงเทรา','ปราจีนบุรี','สระแก้ว'],
        "ภาคตะวันตก": ['กาญจนบุรี', 'ประจวบคีรีขันธ์', 'สุพรรณบุรี', 'เพชรบุรี', 'นครปฐม', 'ราชบุรี'],
        "ภาคตะวันออกเฉียงเหนือ": ['กาฬสินธุ์','ขอนแก่น','ชัยภูมิ','นครพนม','นครราชสีมา','บุรีรัมย์','มหาสารคาม','มุกดาหาร','ยโสธร','ร้อยเอ็ด','เลย','ศรีสะเกษ','สกลนคร','สุรินทร์','หนองคาย','หนองบัวลำภู','อุดรธานี','อุบลราชธานี','อำนาจเจริญ'],
        "ภาคใต้":["กระบี่","ชุมพร","ตรัง","นครศรีธรรมราช","นราธิวาส","ปัตตานี","พังงา","พัทลุง","ภูเก็ต","ยะลา","ระนอง","สงขลา","สตูล","สุราษฎร์ธานี"]
        };
    const {Data,SelectSector}=props;
    const GedData = Data;
    const Section = SelectSector;
    const [selectedProvince,setselectedProvince] = useState('chart');
    useEffect(()=>{
        setselectedProvince('chart');
    },[SelectSector]);
    const DataforAddress = GedData.filter((item) => {
            return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.address.province !== undefined;
        }).sort((a, b) => {
            return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
        });
    
    const JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
    const yearProv = Array(JustYear.length).fill(0); // number of people per year
    const ProvNAmePeo = Array.from(new Set(DataforAddress.filter((item) => provincesBySector[Section].includes(item.address.province)).map((index) => index.address.province))); // province names
    const ProvPeoNum = Array(ProvNAmePeo.length).fill().map(() => yearProv.slice()); // number of people per province per year
    
    DataforAddress.forEach((index) => {
      for (let a = 0; a < ProvNAmePeo.length; a++) {
        for (let b = 0; b < JustYear.length; b++) {
          if (ProvNAmePeo[a] === index.address.province && JustYear[b] === index.education.stuID.slice(0, 2)) {
            ProvPeoNum[a][b] += 1;
          }
        }
      }
    });
    

    const ChartDataProv = [];

    for (let a = 0; a < ProvNAmePeo.length; a++) {
        ChartDataProv.push({
            label: ProvNAmePeo[a],
            data: ProvPeoNum[a],
            borderWidth: 1,
        })
    }

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current && selectedProvince === 'chart') {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: JustYear,
                    datasets: ChartDataProv,
                },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'จำนวนของนิสิตจาก'+Section+' '
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
                },
            });

            return () => {
                chart.destroy();
            };
        }
    }, [Section,Data,SelectSector,selectedProvince]);

    function peopleProvince(e){
        setselectedProvince(e.target.value);    
    }

    return(
        <>
            <select value={selectedProvince} onChange={peopleProvince}>
            <option value="">--Select a Province--</option>
            <option value={'chart'}>ทุกจังหวัด</option>
            {provincesBySector[Section].map((index) => (
                <option key={index} value={index}>
                    {index}
                </option>
            ))  }
        </select>
        {selectedProvince === 'chart' &&(
            <div>
                <canvas ref={chartRef} />
            </div>
        )}
        {provincesBySector[Section].includes(selectedProvince) &&(
            <Distric RawData={GedData} Data={provincesBySector[Section]} province={selectedProvince}/>
        )}
        </>
        
    );
}

export default Province;