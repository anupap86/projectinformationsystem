import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import SingleSchoolNews from './SingleShoolNews';

function NewsSchool(props) {
    const {data} = props;
    const DataForNews = data;
    const [SchoolOfNews,setSchoolOfNews]= useState("chart");
    const SchoolList = Array.from(new Set(DataForNews.map((index)=>{return index.education.eduBefore})));
    const SchNewsData = DataForNews.filter((index)=>{return index.education.eduBefore !== undefined;});
    const SchRawNews = SchNewsData.map((index)=>{return index.education.newSources})
    const SchRrecNews = [];
    for (let a = 0; a < SchRawNews.length; a++) {
        for (let b = 0; b < SchRawNews[a].length; b++) {
            SchRrecNews.push(SchRawNews[a][b])
        }  
    }


    const SchtheYearNews = Array.from(new Set(SchNewsData.map((index) => index.education.stuID.slice(0, 2))));
    const SchNonrepNews = Array.from(new Set(SchRrecNews));
    const SchNewsNews = [];

    for (let a = 0; a < SchNonrepNews.length; a++) {
        let schyeerNews = Array.from({ length: SchtheYearNews.length }, () => 0);
        SchNewsNews.push(schyeerNews);
    }

    SchNewsData.forEach((index) => {
        let somenews = index.education.newSources.map((RealNews) => RealNews);
        
        for (let a = 0; a < somenews.length; a++) {
            for (let b = 0; b < SchNonrepNews.length; b++) {
                if (SchNonrepNews[b] === somenews[a]) {
                    for (let c = 0; c < SchtheYearNews.length; c++) {
                        if (SchNonrepNews[b] === somenews[a] && SchtheYearNews[c] === index.education.stuID.slice(0, 2)) {
                            SchNewsNews[b][c] += 1;
                        }
                    }
                }
            }
        }
    });

    const NewsCase = [];
    for (let a = 0; a < SchNewsNews.length; a++) {
        NewsCase.push({
        label: SchNonrepNews[a],
        data: SchNewsNews[a],
        borderWidth: 1,
    })}

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: SchtheYearNews,
                    datasets: NewsCase,
                    },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'ข่าวสารที่นักเรียนทุกโรงเรียนได้รับแต่ละปี'
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
    }, [SchoolOfNews,data]);

    function SchoolNEws(e) {
        setSchoolOfNews(e.target.value)
    }
    return(
        <>
        <select value={SchoolOfNews} onChange={SchoolNEws}>
            <option value={""}>--เลือกโรงเรียน--</option>
            <option value={"chart"}>ทุกโรงเรียน</option>
        {SchoolList.map((index)=>{
            return <option key={index} value={index}>{index}</option>
        })}
        </select>
        {SchoolOfNews === "chart" && (
            <div>   
                <canvas ref={chartRef} />
            </div>
        )}
        {SchoolList.includes(SchoolOfNews) &&(
        <SingleSchoolNews Data={DataForNews} DopDow={SchoolOfNews}/>
        )}
        </>
    );
}

export default NewsSchool;