import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function YeahYeah(props) {
    const {DataYeah,CourseToYeah,YearToYeah,pahk}=props;
    const chartRef = useRef(null);

    const PockMOnTier = ["ต่ำกว่า5000","5000-10000","10000-15000","15000-20000","มากกว่า20000"];
    const Yearsoot = DataYeah.filter((item)=>{return item.education.stuID.slice(0,2) === YearToYeah});
    const whatYear = Array.from(new Set(Yearsoot.map((index)=>{return index.education.stuID.slice(0,2)}))); 
    const Rangesoot = [];
    for (let a = 0; a < PockMOnTier.length; a++) {
        Rangesoot.push([]);
        for (let b = 0; b < whatYear.length; b++) {
            Rangesoot[a].push(0);
        }
    }
    Yearsoot.map((index)=>{
        for (let a = 0; a < PockMOnTier.length; a++) {
            if (PockMOnTier[a]===index.profile.income) {
                for (let b = 0; b < whatYear.length; b++) {
                    if (whatYear[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
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
        })
    }

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: whatYear,
                    datasets: ChartDataProv,
                    },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'รายได้ของนิสิตภาควิชา'+pahk+'หลักสูตร'+CourseToYeah+'ปี'+YearToYeah+''
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
    }, [DataYeah,YearToYeah,pahk]);

    return(
        <div>
            <canvas ref={chartRef} />
        </div>
    );
}

export default YeahYeah;