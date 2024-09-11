import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import MajorFam from './MajorFam';

function FamInc(Props) {
    const {datafam} = Props;
    const [MomOrDad,setMomOrDad] = useState('chart');
    useEffect(()=>{
        setMomOrDad('chart');
    },[])

    const DataForFamilyInc = datafam.filter((item)=>{return item.education.stuID !== undefined && item.education.stuID.length === 11
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

    const FamIncsCase = [];
    for (let a = 0; a < IncTier.length; a++) {
        FamIncsCase.push({
        label: IncTier[a],
        data: ArrIncFamYear[a],
        borderWidth: 1,
    })}

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: FamIncYear,
                    datasets: FamIncsCase,
                    },
                options: {
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
                },
            });
        
            return () => {
                chart.destroy();
            };
        }
    }, [datafam,MomOrDad]);

    function MOmDad(e) {
        setMomOrDad(e.target.value);
    }
    return(
        <>
        <select value={MomOrDad} onChange={MOmDad}>
            <option value={''}>--รายได้ผู้ปกครอง--</option>
            <option value={'chart'}>รวม</option>
            <option value={"mother"}>มารดา</option>
            <option value={"father"}>บิดา</option>
        </select>
        {MomOrDad === 'chart' && (
            <div>
                <canvas ref={chartRef} />
            </div>
        )}
        {MomOrDad !== 'chart' && (
            <MajorFam Data={datafam} MainDD={MomOrDad}/>
        )}
        </>
    );
}

export default FamInc;