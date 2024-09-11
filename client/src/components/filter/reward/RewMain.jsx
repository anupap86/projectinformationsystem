import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import PewPhak from './RewPhak';

function RewarMain(props) {
    const {dataRew} = props;
    const [RewStudyorWork,setRewStudyorWork]=useState("chart");

    const GedData = dataRew;
    const DataForRew = GedData.filter((item)=>{return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.reward !== undefined && item.education.major !== undefined})
    .sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
    });
    const YearRew = Array.from(new Set(DataForRew.filter((index)=>{return index.reward.study !== undefined || index.reward.work !== undefined}).map((index)=>{return index.education.stuID.slice(0,2)})));
    const WhatYearRewStu = [];

    for (let a = 0; a < YearRew.length; a++) {
        WhatYearRewStu.push(0);
    }

    DataForRew.filter((index)=>{return index.reward.study !== undefined }).map((index)=>{
        let THekeeStu = Object.keys(index.reward.study).length;
        let THeYeer = index.education.stuID.slice(0,2);
        for (let a = 0; a < YearRew.length; a++) {
            if (YearRew[a] === THeYeer) {
                WhatYearRewStu[a] += THekeeStu;
            }
        }
    });

    const WhatYearRewWork = [];
    for (let a = 0; a < YearRew.length; a++) {
        WhatYearRewWork.push(0);
    }

    DataForRew.filter((index)=>{return index.reward.work !== undefined }).map((index)=>{
        let THekeeStu = Object.keys(index.reward.work).length;
        let THeYeer = index.education.stuID.slice(0,2);
        for (let a = 0; a < YearRew.length; a++) {
            if (YearRew[a] === THeYeer) {
                WhatYearRewWork[a] += THekeeStu;
            }
        }
    });

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current && RewStudyorWork === 'chart') {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: YearRew,
                    datasets: [{
                        label: "จำนวนรางวัลที่ได้ช่วงกำลังศึกษา",
                        data: WhatYearRewStu,
                        borderWidth: 1,
                    },{
                        label: "จำนวนรางวัลที่ได้ช่วงทำงาน",
                        data: WhatYearRewWork,
                        borderWidth: 1,
                    },],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'รางวัลที่นิสิตได้รับ'
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
    }, [RewStudyorWork]);

    function hteTypeoFREw(e) {
        setRewStudyorWork(e.target.value);
    }
    return(
        <>
        <select value={RewStudyorWork} onChange={hteTypeoFREw}>
            <option>--ช่วงเวลาได้รับรางวัล--</option>
            <option value={"chart"}>ทุกช่วงเวลา</option>
            <option value={"study"}>ตอนกำลังศึกษา</option>
            <option value={"work"}>ตอนทำงาน</option>
        </select>
        {RewStudyorWork === "chart" && (
            <div>
                <canvas ref={chartRef} />
            </div>
        )}
        {RewStudyorWork !== "chart" && (
            <PewPhak DataForRew={DataForRew} DopDow={RewStudyorWork}/>
        )}
        </>
    );

}

export default RewarMain;