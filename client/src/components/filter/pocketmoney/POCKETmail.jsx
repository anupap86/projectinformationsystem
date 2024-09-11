import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import CoursePock from "./coursePock";

function POCKmain(props) {
  const { dataForPock } = props;
  const [selectedOption, setSelectedOption] = useState('chart');  
  const chartRef = useRef(null);

  const PockMOnTier = ["ต่ำกว่า5000","5000-10000","10000-15000","15000-20000","มากกว่า20000"];
  const DataForPocket = dataForPock.filter((item) => { return item.profile.income !== undefined && item.education.stuID !== undefined 
    && item.education.stuID.length === 11 && item.education !== undefined && item.education.course !== undefined 
    && item.education.major !== undefined && PockMOnTier.includes(item.profile.income)})
  .sort((a, b) => {
    return a.education.stuID.slice(0, 2) - b.education.stuID.slice(0, 2);
  });

  const HowManyYear = Array.from(new Set(DataForPocket.map((index)=>{return index.education.stuID.slice(0,2)})));
  const YearPokple = new Array(HowManyYear.length).fill(0);
  const PhakAllPeo = [];
  for (let a = 0; a < PockMOnTier.length; a++) {
    PhakAllPeo.push(Array.from(YearPokple)); // create a new array for each element of PhakAllPeo
  }

  const Phakwicha = Array.from(new Set(DataForPocket.map((index)=>{ return index.education.major})));

DataForPocket.forEach((index) => {
  for (let a = 0; a < PockMOnTier.length; a++) {
      for (let b = 0; b < HowManyYear.length; b++) {
        if (HowManyYear[b]===index.education.stuID.slice(0,2) && PockMOnTier[a]===index.profile.income) {
          PhakAllPeo[a][b] +=1;
        }
      }
  }
});
  
  useEffect(() => {
    if (chartRef.current && selectedOption === 'chart') {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: HowManyYear,
          datasets: [{
            label: PockMOnTier[0],
            data: PhakAllPeo[0],
            borderWidth: 1,
          },
          {
            label: PockMOnTier[1],
            data: PhakAllPeo[1],
            borderWidth: 1,
          },
          {
            label: PockMOnTier[2],
            data: PhakAllPeo[2],
            borderWidth: 1,
          },
          {
            label: PockMOnTier[3],
            data: PhakAllPeo[3],
            borderWidth: 1,
          },
          {
            label: PockMOnTier[4],  
            data: PhakAllPeo[4],
            borderWidth: 1,
          },],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'รายได้ของนิสิตแต่ละภาควิชา'
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
  }, [selectedOption]);
  
  function handleOptionChange(e) {
    setSelectedOption(e.target.value);
  }
  return (
    <>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value=''>--เลือกภาควิชา--</option>
        <option value='chart'>ทุกภาควิชา</option>
        {Phakwicha.map((index)=>{
            return <option key={index} value={index}>{index}</option>
          })}
      </select>
      {selectedOption === 'chart' && (
        <div>
          <canvas ref={chartRef} />
        </div>
      )}
      {Phakwicha.includes(selectedOption) && (
          <CoursePock DataCourse={DataForPocket} Phakwicha={selectedOption}/>
      )}
    </>
  );
}

export default POCKmain;
