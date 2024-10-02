import './App.css';
import '../node_modules/uplot/dist/uPlot.min.css';
import { ChangeEvent, useState } from 'react';
import { UpLotChart } from './libs/uPlot';
import { RealTimeMultiLineChart } from './libs/D3';
import { DynamicLineChart } from './libs/chartjsReact';
import { DynamicLineChartWithoutReact } from './libs/chartjs';

function App() {
  const [graphType, setGraphType] = useState('')
  const [count, setCount] = useState(1)
  const [delay, setDelay] = useState(0.2)

  const chooseType = (type: string) => {
    setGraphType(type)
  }

  const changeCount = (n: ChangeEvent<HTMLInputElement>) => {
    const value = +n.currentTarget.value
    if (value < 1) return
    setCount(value)
  }

  const changeDelay = (n: ChangeEvent<HTMLInputElement>) => {
    const value = +n.currentTarget.value
    setDelay(value)
  }

  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent: 'center'}}>
          <div>
            <div>Количетво графиков</div>
            <input type="number" value={count} onChange={changeCount}/>
          </div>
          <div>
            <div>Задержка для отрисовки в мс</div>
            <input type="number" value={delay} onChange={changeDelay}/>
          </div>
      </div>
        
        <button onClick={()=> {chooseType('uPlot')}}>uPlot</button>
        <button onClick={()=> {chooseType('D3')}}>D3</button>
        <button onClick={()=> {chooseType('chartjs_ReactBind')}}>chartjs with react bind lib</button>
        <button onClick={()=> {chooseType('chartjs')}}>chartjs</button>
      <div>
        {(graphType === 'uPlot') && <UpLotChart count={count} delay={delay}/>}
        {(graphType === 'D3') && <RealTimeMultiLineChart count={count} delay={delay}/>}
        {(graphType === 'chartjs_ReactBind') && <DynamicLineChart count={count} delay={delay}/>}
        {(graphType === 'chartjs') && <DynamicLineChartWithoutReact count={count} delay={delay}/>}
      </div>
    </div>
  );
}

export default App;
