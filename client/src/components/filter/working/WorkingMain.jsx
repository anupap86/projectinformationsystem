import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import PhakWorking from './PhakWorking';

function WorkingMain(props) {
    const {dataSal} = props;
    const [PockSys,setPockSys] = useState('chart');

    const SalaryTier = ["ต่ำกว่า10000","10000-20000","20000-30000","30000-40000","40000-50000","มากกว่า50000"];
    const DataForSalary = dataSal.filter((item)=>{return item.work_experience !== undefined && item.education.stuID !== undefined 
        && item.education.stuID.length === 11 && Object.keys(item.work_experience).length !== 0})
    .sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });

    const Phakwicha = Array.from(new Set(DataForSalary.map((index)=>{ return index.education.major})));

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

    DataForSalary.map((index)=>{
        let whatsal = Object.keys(index.work_experience);
        let lengthWhatsal = Object.keys(index.work_experience).length;
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

    useEffect(()=>{
        setPockSys('chart');
    },[]);

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current && PockSys === 'chart') {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: YearSal,
                    datasets: salaryCase,
                    },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'รายได้ของนิสิตหลังจากจบการศึกษาไปแล้ว'
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
    }, [PockSys]);
    function SalaryPhak(e) {
        setPockSys(e.target.value)
    }
    return(
        <>
        <select value={PockSys} onChange={SalaryPhak}>
            <option value={''}>--เลือกภาควิชา--</option>
            <option value={'chart'}>ทุกภาควิชา</option>
            {Phakwicha.map((index)=>{
                return <option key={index} value={index}>{index}</option>
            })}
        </select>
        {PockSys === 'chart' && (
                <div>
                    <canvas ref={chartRef} />
                </div>
            )}
        {Phakwicha.includes(PockSys) &&(
            <PhakWorking data={dataSal} DopDow={PockSys}/>
        )}
        </>
    );
}

export default WorkingMain;