import { useEffect, useRef, useState } from "react"
import uPlot from "uplot"

const getX = (): number[] => {
    let cords = Array(100).fill(0).map((_, idx) => idx)
    return cords
  }
  
  const getY1 = (): [NodeJS.Timer, number[]] => {
    let cords = [0]
    const id = setInterval(() => {
      cords.push((Math.random() * 100) | 1) 
    }, 1000);
    return [id, cords]
  }
  
  const getY2 = (interval: number): [NodeJS.Timer, number[]] => {
    let cords = [0]
    const id = setInterval(() => {
      if (cords.length > 100) {
        cords.shift()
      }
      cords.push((Math.random() * 100) | 1) 
    }, interval);
    return [id, cords]
  }
  
  
 export const UpLotChart = ({count, delay} : {count: number, delay: number}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(true);
    const [ulot, setUlot] = useState<uPlot>();
  
    useEffect(() => {
      const coordsX = getX()
  
      const data: uPlot.AlignedData = [
        coordsX, 
      ]; // Пример данных
  
      const opts: uPlot.Options = {
        title: "My Chart",
        id: "chart1",
        class: "my-chart",
        width: 1600,
        height: 600,
        scales: {
                      x: {
                          time: false,
                  range: [0, 100],
                      },
                      y: {
                          auto: false,
                          range: [0, 100],
                      },
                  },
        series: [
          {
            label: 'Main'
          },
        ],
        axes: [
                  {},
          {},
          { show: false},
          {
                      label: 'meter',
                      stroke: 'blue',
                      side: 1,
            show: true
                  }
        ],
      };
  
      const uplotChart = new uPlot(opts, data);
  
      if (chartRef.current) {
        chartRef.current.appendChild(uplotChart.root);
      }
  
      let ids: NodeJS.Timer[] = []
  
      for (let i = 0; i < count; i++) {
        const [idY2, coords2] = getY2(delay)
        ids.push(idY2)
  
        uplotChart.setData([...uplotChart.data, coords2] as uPlot.AlignedData)
    
        uplotChart.addSeries({
              show: true,
              label: 'Data' + i,
              spanGaps: false,
              value: (self, rawValue) => rawValue,
              stroke: "#" + i + i +"00" + i + i,
              width: 1,
            })
      }
  
      const idPlot = setInterval(()=> {
        uplotChart.redraw()
      }, delay)
      setUlot(uplotChart)
  
      return () => {
        uplotChart.destroy();
  
        clearInterval(idPlot)
        ids.forEach(i => {clearInterval(i)})
      };
    }, []);
  
    const handleClick = () => {
      setShow((prevShow) => !prevShow)
      ulot?.series.map(i => {
        if (i.label === 'Data2') i.show = show
        return i
      })
    }
  
    return <div>
      <button onClick={handleClick}>toggle show</button>
      <div ref={chartRef}></div>
    </div>;
  };