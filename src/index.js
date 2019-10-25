import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Topology from './topology/Topology';
import integrationJson from './data/integration.json';

import './styles.css';

function App() {
  const [width, setWidth] = useState(window.innerWidth - 20 || 0);
  const [height, setHeight] = useState(window.innerHeight - 20 || 0);
  const [data, setData] = useState(undefined);
  const projectName = 'Integration';

  useEffect(() => {
    let temp = data;
    if (projectName === 'Integration') {
      temp = integrationJson;
      setData(temp);
    } else {
      temp = integrationJson;
      setData(temp);
    }
  }, [data]);

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWidth(window.innerWidth - 20 || 0);
        setHeight(window.innerHeight - 20 || 0);
      }, 300);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Topology identifier="topology" mode="2d" projectName={projectName} data={data} width={width} height={height} enableGroup />
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
