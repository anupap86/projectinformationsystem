import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function YearWorking(props) {
    const {data,MajorDD,CourseDD,YeerDD}=props;

    const SalaryTier = ["ต่ำกว่า10000","10000-20000","20000-30000","30000-40000","40000-50000","มากกว่า50000"];
    const DataForSalary = data.filter((item)=>{return item.work_experience !== undefined && item.education.stuID !== undefined 
        && item.education.stuID.length === 11 && Object.keys(item.work_experience).length !== 0})
    .sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });

    let PhaksalDat = DataForSalary.filter((item)=>{return item.education.major === MajorDD && item.education.course === CourseDD
        && item.education.stuID.slice(0,2) === YeerDD});
        
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

    // console.log();
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
                        text: 'รายได้ที่ที่นิสิตภาควิชา'+MajorDD+'หลักสูตร'+CourseDD+'ปี'+YeerDD+'ได้รับเมื่อทำงาน'
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
    }, [YeerDD]);
    return(
        <div>
            <canvas ref={chartRef} />
        </div>
    );
}

export default YearWorking;