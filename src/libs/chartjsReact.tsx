import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { hover } from "@testing-library/user-event/dist/hover";
import { TypedChartComponent } from "react-chartjs-2/dist/types";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export const options = {
    responsive: false,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
        tooltip: {
            enabled: false
        }
    }
  };

export const DynamicLineChart = ({count, delay} : {count: number, delay: number}) => {
    const dataLength = 100;
    const numLines = count;
    const [data, setData] = useState<number[][]>(Array.from({ length: numLines }, () => []));
  
    useEffect(() => {
      const interval = setInterval(() => {
        const newData = data.map(lineData => {
            if (lineData.length > dataLength) {lineData.shift()}
            lineData.push(Math.random() * 100)
            return lineData
          });
          setData(newData);
        }, delay);
      return () => clearInterval(interval);
    }, []);

  return (
       <Line
        width={1200}
        height={800}
        data={{
          labels: Array.from({ length: dataLength }, (_, i) => i),
          datasets: data.map((lineData, index) => ({
            label: `Line ${index + 1}`,
            data: lineData,
            borderColor: `hsl(${(index * 360) / numLines}, 70%, 50%)`,
            fill: false,
            animation: false,
            maintainAspectRatio: false,
          }))
        }}
        options={options}
      />
  );
};