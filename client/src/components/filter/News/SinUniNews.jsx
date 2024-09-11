import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function SinUniNews(props) {
    const {Data,DopDow} = props;
    const DataForNews = Data;
    const UniNewsData = DataForNews.filter((index)=>{return index.education.major === DopDow;})

    const UniRawNews = UniNewsData.map((index)=>{return index.education.newSources})
    const UniRrecNews = [];
    for (let a = 0; a < UniRawNews.length; a++) {
        for (let b = 0; b < UniRawNews[a].length; b++) {
            UniRrecNews.push(UniRawNews[a][b])
        }  
    }

    const UnitheYearNews = Array.from(new Set(UniNewsData.map((index) => index.education.stuID.slice(0, 2))));
    const UniNonrepNews = Array.from(new Set(UniRrecNews));
    const UniNewsNews = [];

    for (let a = 0; a < UniNonrepNews.length; a++) {
        let schyeerNews = Array.from({ length: UnitheYearNews.length }, () => 0);
        UniNewsNews.push(schyeerNews);
    }

    UniNewsData.forEach((index) => {
        let somenews = index.education.newSources.map((RealNews) => RealNews);
        
        for (let a = 0; a < somenews.length; a++) {
            for (let b = 0; b < UniNonrepNews.length; b++) {
                if (UniNonrepNews[b] === somenews[a]) {
                    for (let c = 0; c < UnitheYearNews.length; c++) {
                        if (UniNonrepNews[b] === somenews[a] && UnitheYearNews[c] === index.education.stuID.slice(0, 2)) {
                            UniNewsNews[b][c] += 1;
                        }
                    }
                }
            }
        }
    });
    // console.log(UniNewsNews);

    const NewsCase = [];
    for (let a = 0; a < UniNewsNews.length; a++) {
        NewsCase.push({
        label: UniNonrepNews[a],
        data: UniNewsNews[a],
        borderWidth: 1,
    })}

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: UnitheYearNews,
                    datasets: NewsCase,
                    },
                options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'ข่าวสารที่นิสิตคณะ'+DopDow+'ได้รับแต่ละปี'
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
    }, [Data,DopDow]);
    return(
        <div>   
            <canvas ref={chartRef} />
        </div>
    );
}

export default SinUniNews;