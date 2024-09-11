import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function DisDis(props) {
    const {RawData,data,theProv} = props;
    const DataforAddress = RawData.filter((item) => {
        return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.address.province !== undefined;
    }).sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });
    const chartRef = useRef(null);
    const JustYear = Array.from(new Set(DataforAddress.map((index) => index.education.stuID.slice(0, 2)))); // years
    const Thedistrict = DataforAddress.filter((item)=>{return item.address.district === theProv})
    const yearProv = []; // number of people per year

    for (let a = 0; a < JustYear.length; a++) {
        yearProv.push(0);
    }

    Thedistrict.forEach((index) => {
        for (let b = 0; b < JustYear.length; b++) {
            if (JustYear[b] === index.education.stuID.slice(0, 2)) {
                yearProv[b] += 1;
            }
        }
        }
    );  
    // console.log(yearProv);
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: JustYear,
                    datasets: [{
                        label: theProv,
                        data: yearProv,
                        borderWidth: 1,
                    }],
                },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'จำนวนนักเรียนจากอำเภอ'+theProv+' '
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
    }, [RawData,data,theProv]);    
        return(
            <div>
                <canvas ref={chartRef} />
            </div>
        );
    }

export default DisDis;