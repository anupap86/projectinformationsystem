import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import YearWorking from './YearWorking';

function LuksootWorking(props) {
    const {Data,doPdow,mainDopDow}=props
    const [PockYear,setPockYear] = useState('chart');
    useEffect(()=>{
        setPockYear('chart');
    },[doPdow])
    const SalaryTier = ["ต่ำกว่า10000","10000-20000","20000-30000","30000-40000","40000-50000","มากกว่า50000"];
    const DataForSalary = Data.filter((item)=>{return item.work_experience !== undefined && item.education.stuID !== undefined 
        && item.education.stuID.length === 11 && Object.keys(item.work_experience).length !== 0})
    .sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });

    const PeeSuksa = Array.from(new Set(DataForSalary.filter((item)=>{return item.education.course === doPdow && item.education.major === mainDopDow})
    .map((index)=>{return index.education.stuID.slice(0,2)})));
    const PhaksalDat = DataForSalary.filter((item)=>{return item.education.major === mainDopDow && item.education.course === doPdow});
      
      const PhakSalYear = Array.from(new Set(DataForSalary.map((index)=>{return index.education.stuID.slice(0,2)})));
      const PhakYearArr = [];
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

    const WorkNewsCase = [];
    for (let a = 0; a < SalaryTier.length; a++) {
        WorkNewsCase.push({
        label: SalaryTier[a],
        data: PhakYearArr[a],
        borderWidth: 1,
    })}

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: PhakSalYear,
                    datasets: WorkNewsCase,
                    },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'รายได้ที่ที่นิสิตภาควิชา'+mainDopDow+'หลักสูตร'+doPdow+'ได้รับเมื่อทำงาน'
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
    }, [doPdow,PockYear]);

    function Salarypee(e) {
        setPockYear(e.target.value)
    }
    return(
        <>
        <select value={PockYear} onChange={Salarypee}>
            <option value={""}>--เลือกปี--</option>
            <option value={'chart'}>ทุกปี</option>
            {PeeSuksa.map((index)=>{
                return <option key={index} value={index}>{index}</option>
            })}
        </select>
        {PockYear === 'chart' && (
            <div>
                <canvas ref={chartRef} />
            </div>
        )}
        {PockYear !== 'chart' &&(
            <YearWorking data={Data} MajorDD={mainDopDow} CourseDD={doPdow} YeerDD={PockYear}/>
        )}
        </>
    );
}

export default LuksootWorking;