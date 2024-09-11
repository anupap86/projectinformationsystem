import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Province from './province';

function AddressEng(props){
    const {dataforAd}=props;
    const GedData = dataforAd;
    const provincesBySector = {
        "ภาคเหนือ":['เชียงใหม่', 'แม่ฮ่องสอน', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'พะเยา', 'แพร่', 'น่าน', 'อุตรดิตถ์', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'กำแพงเพชร', 'เพชรบูรณ์', 'พิจิตร'],
        "ภาคกลาง":['กรุงเทพมหานคร','อุทัยธานี','ชัยนาท','นครสวรรค์','นนทบุรี','ปทุมธานี','พระนครศรีอยุธยา','ลพบุรี','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระบุรี','สิงห์บุรี','อ่างทอง'],
        "ภาคตะวันออก": ['ชลบุรี','ระยอง','จันทบุรี','ตราด','นครนายก','ฉะเชิงเทรา','ปราจีนบุรี','สระแก้ว'],
        "ภาคตะวันตก": ['กาญจนบุรี', 'ประจวบคีรีขันธ์', 'สุพรรณบุรี', 'เพชรบุรี', 'นครปฐม', 'ราชบุรี'],
        "ภาคตะวันออกเฉียงเหนือ": ['กาฬสินธุ์','ขอนแก่น','ชัยภูมิ','นครพนม','นครราชสีมา','บุรีรัมย์','มหาสารคาม','มุกดาหาร','ยโสธร','ร้อยเอ็ด','เลย','ศรีสะเกษ','สกลนคร','สุรินทร์','หนองคาย','หนองบัวลำภู','อุดรธานี','อุบลราชธานี','อำนาจเจริญ'],
        "ภาคใต้":["กระบี่","ชุมพร","ตรัง","นครศรีธรรมราช","นราธิวาส","ปัตตานี","พังงา","พัทลุง","ภูเก็ต","ยะลา","ระนอง","สงขลา","สตูล","สุราษฎร์ธานี"]
        };

    const [Section,setSection] = useState('chart');
    const chartRef = useRef(null);
    
    const DataforAddress = GedData.filter((item) => {
        return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.address.province !== undefined;
    }).sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });
    //ใช้หาlabelจากstuidและหาค่าไปใส่ในdataของกราฟจากddหลัก
    const eeryID = DataforAddress.map((index)=>{return index.education.stuID;});
    const yeerWhere = DataforAddress.map((index)=>{return index.address.province;});
    const SectorPeople =[[],[],[],[],[],[]]//north central east west esan southข้อมูลอันนี้นะ
    const IdYear = [];//get year by stuid
    const toKnowSector = Object.keys(provincesBySector);
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

    useEffect(() => {
        if (chartRef.current && Section === 'chart') {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: IdYear,
                datasets: [{
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
                  },],
              },
              options: {
                plugins: {
                  title: {
                    display: true,
                    text: 'จำนวนของนิสิตแต่ละภาค'
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
      }, [Section]);

    function PeopleSector(e) {
        setSection(e.target.value);
    }

    return(
        <>
            <select value={Section} onChange={PeopleSector}>
        <option value={''}>--Select a sector--</option>
        <option value={'chart'}>ทุกภาค</option>
        {Object.keys(provincesBySector).map((sector) => (
            <option key={sector} value={sector}>
                {sector}
            </option>
        ))}
        </select>
        {Section === 'chart'&&(
        <div>
            <canvas ref={chartRef} />
        </div>
        )}
        {toKnowSector.includes(Section)&&(
          <Province Data={GedData} SelectSector={Section}/>
        )}
        </>
    );
} 

export default AddressEng