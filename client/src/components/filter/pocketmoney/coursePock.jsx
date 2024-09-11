import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import YearPock from "./YearPock";

function CoursePocket(props) {
    const chartRef = useRef(null);
    const {DataCourse, Phakwicha} = props;
    const [DropDownChange,setDropDownChange] = useState('chart');
    useEffect(()=>{
        setDropDownChange('chart');
    },[DataCourse]);
    const PockMOnTier = ["ต่ำกว่า5000","5000-10000","10000-15000","15000-20000","มากกว่า20000"];
    const  luksoot = Array.from(new Set(DataCourse.filter((item)=>{return item.education.major === Phakwicha})
    .map((index)=>{return index.education.course})));
    const Theluksoot = DataCourse.filter((item)=>{return item.education.major === Phakwicha});
    const whatYearluksoot = Array.from(new Set(DataCourse.filter((item)=>{return item.education.major === Phakwicha}).map((index)=>{return index.education.stuID.slice(0,2)})));
    const Rangesoot = [];
    for (let a = 0; a < PockMOnTier.length; a++) {
        Rangesoot.push([]);
        for (let b = 0; b < whatYearluksoot.length; b++) {
            Rangesoot[a].push(0);
        }
    }
    Theluksoot.forEach((index)=>{
        for (let a = 0; a < PockMOnTier.length; a++) {
            if (PockMOnTier[a]===index.profile.income) {
                for (let b = 0; b < whatYearluksoot.length; b++) {
                    if (whatYearluksoot[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
                        Rangesoot[a][b] +=1;
                    }
                }
            }
        }
        });

    const ChartDataProv = [];

    for (let a = 0; a < PockMOnTier.length; a++) {
        ChartDataProv.push({
            label: PockMOnTier[a],
            data: Rangesoot[a],
            borderWidth: 1,
        })}
    
    useEffect(() => {
        if (chartRef.current && DropDownChange === 'chart') {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: whatYearluksoot,
                    datasets: ChartDataProv,
                },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'รายได้ของนิสิตภาควิชา'+Phakwicha+' '
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
    }, [DataCourse,DropDownChange]);
    function ChangeDrop(e) {
        setDropDownChange(e.target.value);
        }
        return(
            <>
                <select value={DropDownChange} onChange={ChangeDrop}>
                <option value={''}>--เลือกหลักสูตร--</option>
                    <option value={'chart'}>ทุกหลักสูตร</option>
                    {luksoot.map((index)=>{
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
                {DropDownChange === 'chart' && (
                <div>
                    <canvas ref={chartRef} />
                </div>
                )}
                {luksoot.includes(DropDownChange) &&(
                    <YearPock DaTaForYear={Theluksoot} CourseToYear={DropDownChange} pahk={Phakwicha}/>
                )}
            </>
        );
}

export default CoursePocket