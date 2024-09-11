import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import DisDis from './Disdis';

function Distric(props) {
    const {RawData,Data,province}=props;
    const [Forprovince,setForprovince]=useState('chart');

    useEffect(()=>{
        setForprovince('chart');
    },[province]);

    const DataforAddress = RawData.filter((item) => {
        return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.address.province !== undefined;
    }).sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });

    let Thatdistric = Array.from(new Set(DataforAddress.filter((item)=>{return item.address.province === province}).map((index)=>{return index.address.district})));
    let JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
    let Thedistrict = Array.from(new Set(DataforAddress.filter((item)=>{return item.address.province === province})
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

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current && Forprovince === 'chart') {
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
                        text: 'จำนวนนักเรียนจากแต่ละอำเภอจาก'+province+' '
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
    }, [RawData,Data,province,Forprovince]);
    function peopledistric(e) {
        setForprovince(e.target.value);
    }
    return(
        <>
        <select value={Forprovince} onChange={peopledistric}>
            <option value={''}>--เลือกอำเภอ--</option>
            <option value={'chart'}>ทุกอำเภอ</option>
            {Thatdistric.map((index)=>{
                return <option key={index} value={index}>{index}</option>
            })}
        </select>
        {Forprovince === 'chart' &&(
            <div>
                <canvas ref={chartRef} />
            </div>
        )}
        {Thatdistric.includes(Forprovince) && (
            <DisDis RawData={RawData} data={DataforAddress} theProv={Forprovince}/>
        )}
        </>
    );
}

export default Distric;