import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import CourseFam from './CoursFam';

function MajorFam(props) {
    const {Data,MainDD}=props;
    const [PockSys,setPockSys] = useState('chart');
    const [DataChart,setDataChart] = useState([]);
    const [LabelChart,setLabelChart] = useState([]);
    const [OptionChart,setOptionChart] = useState({});

    useEffect(()=>{
        setPockSys('chart');
    },[MainDD])

    const DataForFamilyInc = Data.filter((item)=>{return item.education.stuID !== undefined && item.education.stuID.length === 11
    && item.family_information !== undefined})
    .sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });

    const Phakwicha = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.education.major !== undefined}).map((index)=>{ return index.education.major})));
    const IncTier = ['ต่ำกว่า 150000','150000-300000','300000-500000','500000-750000','750000-1ล้าน','2ล้าน-5ล้าน','มากวว่า 5ล้าน'];

    const wholeFamily = DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined || item.family_information.mother !== undefined}).map((index)=>{return index});
    const fatherinc = wholeFamily.filter((item)=>{return item.family_information.father !== undefined}).map((index)=>{return index.family_information.father.income});
    const Motherrinc = wholeFamily.filter((item)=>{return item.family_information.mother !== undefined}).map((index)=>{return index.family_information.mother.income});

        useEffect(()=>{
                switch (MainDD) {
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
                        setLabelChart(DadYearInc);
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
                
        },[MainDD]);   
    
    const chartRef = useRef(null);  
    useEffect(() => {
        if (chartRef.current && PockSys === 'chart') {
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
        }
      }, [MainDD, LabelChart, DataChart, OptionChart, PockSys]);
      

      function PhakFam(e) {
        setPockSys(e.target.value);
      }

    return(
        <>
            <select value={PockSys} onChange={PhakFam}>
                <option value={""}>--เลือกภาควิชา--</option>
                <option value={'chart'}>ทุกภาควิชา</option>
                {Phakwicha.map((index)=>{
                    return <option key={index} value={index}>{index}</option>
                })}
            </select>
            {PockSys === 'chart' &&(
                <div>
                <canvas ref={chartRef} />
            </div>
            )}
            {PockSys !== 'chart' &&(
                <CourseFam data={Data} MainDD={MainDD} MajorDD={PockSys}/>
            )}
        </>
    );
}

export default MajorFam;