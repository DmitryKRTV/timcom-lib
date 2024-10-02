import { useEffect, useRef } from "react";
import * as d3 from 'd3';

export const RealTimeMultiLineChart = ({count, delay} : {count: number, delay: number}) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const colors = d3.schemeCategory10;
  const data: number[][] = Array.from({ length: count }, () => []);

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    const width = 1200;
    const height = 800;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([1, 100]).range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    const yAxisGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    const updateChart = () => {
      data.forEach((lineData, index) => {
        const update = svg.selectAll(`.line-${index}`).data([lineData]);

        update.enter()
          .append('path')
          .attr('class', `line-${index}`)
          .attr('fill', 'none')
          .attr('stroke', colors[index % 10])
          .attr('stroke-width', 2)
          .attr('d', line);

        update.attr('d', line);
      });

      // Обновление оси y при добавлении новых данных
      yScale.domain([1, d3.max(data.flat()) || 100]);
      yAxis = d3.axisLeft(yScale);
      yAxisGroup.transition().call(yAxis);
    };

    const interval = setInterval(() => {
      data.forEach((lineData) => {
        const newDataPoint = Math.floor(Math.random() * 100);
        lineData.push(newDataPoint);
        if (lineData.length > 100) lineData.shift();
      });

      updateChart();
    }, delay);

    return () => clearInterval(interval);
  }, []);

  return <svg ref={chartRef} width="1200" height="800"></svg>;
};