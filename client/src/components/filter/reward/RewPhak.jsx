import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import RewEachPhak from './RewEachPhak';

function PewPhak(props) {
    const {DataForRew,DopDow} = props;
    const [PewofPhak,setPewofPhak]=useState("chart");
    const [DataChart,setDataChart] = useState([]);
    const [LabelChart,setLabelChart] = useState([]);
    const [OptionChart,setOptionChart] = useState({});

    useEffect(()=>{
        setPewofPhak("chart");
    },[DopDow])

    useEffect(()=>{
        let RewStudy =Array.from(new Set(DataForRew.map((index)=>{return index}).filter((item)=>{return item.reward.study !== undefined})));
        let RewWork =Array.from(new Set(DataForRew.map((index)=>{return index}).filter((item)=>{return item.reward.work !== undefined})));

        switch (DopDow) {
            case "study":
              let StuRewYeah = Array.from(new Set(RewStudy.filter((index)=>{return index.reward.study !== undefined})
              .map((index)=>{return index.education.stuID.slice(0,2)}))) //ปีตอนเรียน
    
              let AllStuRew = DataForRew.filter((item)=>{return item.reward.study !== undefined});
              let StuWholetypeOfrew = [];
              AllStuRew.map((index)=>{
                  let THekeeStu = Object.keys(index.reward.study);
                  for (let a = 0; a < THekeeStu.length; a++) {
                    StuWholetypeOfrew.push(index.reward.study[THekeeStu[a]].type);
                    //console.log(StuWholetypeOfrew);
                  }
                });
              let StusometypeOfrew = Array.from(new Set(StuWholetypeOfrew));//ชนิดรางวัลตอนเรียน
              let stuYearType = [];
              for (let a = 0; a < StusometypeOfrew.length; a++) {
                stuYearType.push([]);
                for (let b = 0; b < StuRewYeah.length; b++) {
                  stuYearType[a].push(0);
                }
              }
    
              // console.log(stuYearType);
    
              AllStuRew.forEach((index)=>{
                let Thetyp = Object.keys(index.reward.study);
                for (let a = 0; a < Thetyp.length; a++) {
                  for (let b = 0; b < StusometypeOfrew.length; b++) {
                    if (StusometypeOfrew[b] === index.reward.study[Thetyp[a]].type) {
                      for (let c = 0; c < StuRewYeah.length; c++) {
                        if (StuRewYeah[c]===index.education.stuID.slice(0, 2) && StusometypeOfrew[b] === index.reward.study[Thetyp[a]].type) {
                          stuYearType[b][c] +=1;
                        }
                      }
                    }
                    }
                  }
                
              });
    
              // console.log(stuYearType);
              let NewsCase = [];
              for (let a = 0; a < stuYearType.length; a++) {
                NewsCase.push({
                  label: StusometypeOfrew[a],
                  data: stuYearType[a],
                  borderWidth: 1,
                })}
    
              setDataChart(NewsCase);
              setLabelChart(StuRewYeah);
              setOptionChart({
                      plugins: {
                        title: {
                          display: true,
                          text: 'รางวัลที่นิสิตได้รับขณะศึกษาอยู่'
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
                    });
              break;
            case "work":
              let WorkRewYeah = Array.from(new Set(RewWork.filter((index)=>{return index.reward.work !== undefined})
              .map((index)=>{return index.education.stuID.slice(0,2)}))) //ปีตอนทำงาน
    
              let AllworkRew = DataForRew.filter((item)=>{return item.reward.work !== undefined});
              let workWholetypeOfrew = [];
              AllworkRew.map((index)=>{
                  let THekeework = Object.keys(index.reward.work);
                  for (let a = 0; a < THekeework.length; a++) {
                    workWholetypeOfrew.push(index.reward.work[THekeework[a]].type);
                    //console.log(StuWholetypeOfrew);
                  }
                });
    
              let worksometypeOfrew = Array.from(new Set(workWholetypeOfrew));//ชนิดรางวัลตอนเรียน
              let workYearType = [];
              for (let a = 0; a < worksometypeOfrew.length; a++) {
                workYearType.push([]);
                for (let b = 0; b < WorkRewYeah.length; b++) {
                  workYearType[a].push(0);
                }
              }
    
              AllworkRew.forEach((index)=>{
                let Thetyp = Object.keys(index.reward.work);
                for (let a = 0; a < Thetyp.length; a++) {
                  for (let b = 0; b < worksometypeOfrew.length; b++) {
                    if (worksometypeOfrew[b] === index.reward.work[Thetyp[a]].type) {
                      for (let c = 0; c < WorkRewYeah.length; c++) {
                        if (WorkRewYeah[c]===index.education.stuID.slice(0, 2) && worksometypeOfrew[b] === index.reward.work[Thetyp[a]].type) {
                          workYearType[b][c] +=1;
                        }
                      }
                    }
                    }
                  }
                
              });
    
              let WorkNewsCase = [];
              for (let a = 0; a < workYearType.length; a++) {
                WorkNewsCase.push({
                  label: worksometypeOfrew[a],
                  data: workYearType[a],
                  borderWidth: 1,
                })}
    
              setDataChart(WorkNewsCase);
              setLabelChart(WorkRewYeah);
              setOptionChart({
                      plugins: {
                        title: {
                          display: true,
                          text: 'รางวัลที่นิสิตได้รับเมื่อทำงาน'
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
                    });
              break;
            default:
              break;
          }
    },[DopDow,PewofPhak])

      const chartRef = useRef(null);
      useEffect(() => {
        if (chartRef.current && PewofPhak === "chart"){
            const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: LabelChart,
            datasets: DataChart,
          },
          options: OptionChart,
        });
    
        return () => {
          chart.destroy();
        };
        }
      }, [DopDow,PewofPhak,LabelChart,DataChart,OptionChart]);




    const RewMajor = Array.from(new Set(DataForRew.map((index)=>{
        return index.education.major;
    })));
    function PhakRew(e) {
        setPewofPhak(e.target.value);
    }
    return(
        <>
            <select value={PewofPhak} onChange={PhakRew}>
            <option value={""}>--เลือกภาควิชา--</option>
            <option value={"chart"}>ทุกภาควิชา</option>
            {RewMajor.map((index)=>{
                return <option key={index} value={index}>{index}</option>
            })}
            </select>
            {PewofPhak === "chart" &&(
                <div>
                    <canvas ref={chartRef} />
                </div>
            )}
            {PewofPhak !== "chart" &&(
                <RewEachPhak DataForRew={DataForRew} DopDowPhak={PewofPhak} DopDowMain={DopDow}/>
            )}
        </>
    );
}
export default PewPhak;