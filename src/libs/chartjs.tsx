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
    Chart,
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

export const DynamicLineChartWithoutReact = ({count, delay} : {count: number, delay: number}) => {
    const dataLength = 100;
    const numLines = count;
    const plot = useRef<HTMLCanvasElement>(null);
    let data = Array.from({ length: numLines }, () =>
      Array.from({ length: dataLength })
    );
  
    useEffect(() => {
      const ctx = plot.current!.getContext('2d')
      if (ctx == null) return

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: dataLength }, (_, i) => i),
            datasets: data.map((lineData, index) => ({
                label: `Line ${index + 1}`,
                data: lineData,
                borderColor: `hsl(${(index * 360) / numLines}, 70%, 50%)`,
                fill: false,
                animation: false,
            }))
        },
        options: options
      });

      const interval = setInterval(() => {
        data = data.map(lineData => {
          if (lineData.length > dataLength) {lineData.shift()}
          lineData.push(Math.random() * 100)
          return lineData
        });

        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = data[index];
        });

        chart.update();
      }, delay);
      return () => clearInterval(interval);
    }, []);

  return (
    <div style={{width: '1200px', height: '800px'}}>
      <canvas width={1200} height={800} ref={plot}></canvas>
    </div>
  );
};