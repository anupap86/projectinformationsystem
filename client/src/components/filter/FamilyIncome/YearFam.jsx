import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import YeahFam from './YeahFam';

function YearFam(props) {
    const {dataDD,MomDad,Major,Course} = props;
    const [PockYear,setPockYear] = useState('chart');
    const [DataChart,setDataChart] = useState([]);
    const [LabelChart,setLabelChart] = useState([]);
    const [OptionChart,setOptionChart] = useState({});
    useEffect(()=>{
        setPockYear('chart');
    },[Course])
    const DataForFamilyInc = dataDD.filter((item)=>{return item.education.stuID !== undefined && item.education.stuID.length === 11
        && item.family_information !== undefined})
        .sort((a, b) => {
            return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
        });
    const IncTier = ['ต่ำกว่า 150000','150000-300000','300000-500000','500000-750000','750000-1ล้าน','2ล้าน-5ล้าน','มากวว่า 5ล้าน'];
    const PeeSuksa = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.education.major === Major && item.education.course === Course})
    .map((index)=>{return index.education.stuID.slice(0,2)})));

    console.log(PeeSuksa);
    useEffect(()=>{
            switch (MomDad) {
                case "father":
                let DadYearInc = Array.from(new Set(DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === Major
                && item.education.course === Course})
                .map((index)=>{return index.education.stuID.slice(0,2)})));
                let DadInc = (DataForFamilyInc.filter((item)=>{return item.family_information.father !== undefined && item.education.major === Major
                    && item.education.course === Course}));
        
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
                            text: 'รายได้บิดาของนิสิตภาควิชา'+Major+'หลักสูตร'+Course+'ต่อปี'
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
                    && item.education.major === Major && item.education.course === Course})
                .map((index)=>{return index.education.stuID.slice(0,2)})));
                // console.log(MomYearInc);
                let MomInc = (DataForFamilyInc.filter((item)=>{return item.family_information.mother !== undefined && item.education.major === Major
                    && item.education.course === Course}));
        
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
                            text: 'รายได้มารดาของนิสิตภาควิชา'+Major+'หลักสูตร'+Course+'ต่อปี'
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
    },[PockYear,MomDad,Major,Course])

    const chartRef = useRef(null);  
    useEffect(() => {
            if (chartRef.current && PockYear === 'chart') {
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
        }, [ LabelChart, DataChart, OptionChart, Major,Course,PockYear]);

    function YeerFam(e) {
        setPockYear(e.target.value);
    }
    return(
        <>
            <select value={PockYear} onChange={YeerFam}>
                <option value={""}>--เลือกปี--</option>
                <option value={'chart'}>ทุกปี</option>
                {PeeSuksa.map((index)=>{
                    return <option key={index} value={index}>{index}</option>
                })}
            </select>
            {PockYear === 'chart' &&(
                <div>
                    <canvas ref={chartRef} />
                </div>
            )}
            {PeeSuksa.includes(PockYear) &&(
                <div>
                    <YeahFam data={dataDD} MomDadDD={MomDad} MajorDD={Major} CourseDD={Course} YearDD={PockYear}/>
                </div>
            )}
        </>
    );
}

export default YearFam;