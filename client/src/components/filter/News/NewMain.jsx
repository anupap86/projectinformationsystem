import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import NewsSchool from './NewsSchool';
import UniNews from './NewsUni';

function Newsmain(props) {
    const {dataNews,dopdow}=props;
    const [schormajor,setschormajor] = useState("chart");
    const GedData = dataNews;
    useEffect(()=>{
        setschormajor("chart");
    },[dopdow])

    const DataForNews = GedData.filter((item) => {
        return item.education.stuID !== undefined && item.education.stuID.length === 11 && item.education !== undefined && item.education.eduBefore !== undefined
        && item.education.major !== undefined && item.education.newSources !== undefined})
        .sort((a, b) => {
        return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
        });
    

    const RawNews = DataForNews.map((index)=>{return index.education.newSources})
    const RrecNews = [];
    for (let a = 0; a < RawNews.length; a++) {
        for (let b = 0; b < RawNews[a].length; b++) {
            RrecNews.push(RawNews[a][b])
        }  
    }
    
    const theYearNews = Array.from(new Set(DataForNews.map((index) => index.education.stuID.slice(0, 2))));
    const NonrepNews = Array.from(new Set(RrecNews));
    const NewsNews = [];
    
    for (let a = 0; a < NonrepNews.length; a++) {
        const yeerNews = Array.from({ length: theYearNews.length }, () => 0);
        NewsNews.push(yeerNews);
    }
    
    DataForNews.forEach((index) => {
        let somenews = index.education.newSources.map((RealNews) => RealNews);
        
        for (let a = 0; a < somenews.length; a++) {
            for (let b = 0; b < NonrepNews.length; b++) {
                if (NonrepNews[b] === somenews[a]) {
                    for (let c = 0; c < theYearNews.length; c++) {
                        if (NonrepNews[b] === somenews[a] && theYearNews[c] === index.education.stuID.slice(0, 2)) {
                            NewsNews[b][c] += 1;
                        }
                    }
                }
            }
        }
    });

    const NewsCase = [];
    for (let a = 0; a < NewsNews.length; a++) {
        NewsCase.push({
            label: NonrepNews[a],
            data: NewsNews[a],
            borderWidth: 1,
        })
    }

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: theYearNews,
                    datasets: NewsCase,
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
    }, [schormajor,dataNews]);
    return(
        <>
        <select value={schormajor} onChange={(e)=>{setschormajor(e.target.value)}}>
            <option value={""}>--กลุ่มผู้ได้รับข่าวสาร--</option>
            <option value={"chart"}>ทั้งหมด</option>
            <option value={"โรงเรียน"}>โรงเรียน</option>
            <option value={"ภาควิชา"}>ภาควิชา</option>
        </select>
        {schormajor === "chart" &&(
            <div>
                <canvas ref={chartRef} />
            </div>
        )}
        {schormajor ==="โรงเรียน" &&(
            <NewsSchool data={DataForNews}/>
        )}
        {schormajor ==="ภาควิชา" &&(
            <UniNews data={DataForNews}/>
        )}
        </>
    );
}

export default Newsmain;