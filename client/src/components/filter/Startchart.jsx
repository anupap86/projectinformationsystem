import Chart from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';

function ChartComponent(props) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: props.labels,
          datasets: [
            {
              label: props.title,
              data: props.data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: props.xTitle,
              },
            },
            y: {
              title: {
                display: true,
                text: props.yTitle,
              },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}

export default ChartComponent;