import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Topology from './topology/Topology';
import integrationJson from './data/integration.json';
import siteNetworkJson from './data/siteNetwork.json';

import './styles.css';

function App() {
  const [width, setWidth] = useState(window.innerWidth - 20 || 0);
  const [height, setHeight] = useState(window.innerHeight - 20 || 0);
  const [data, setData] = useState(undefined);
  //const projectName = 'Integration';
  const projectName = 'SiteNetwork';

  //dynamic change data
  useEffect(() => {
    let temp = data;
    if (projectName === 'SiteNetwork') {
      temp = siteNetworkJson;
      setData(temp);
    } else if (projectName === 'Integration') {
      if (!temp) {
        temp = integrationJson;
        setData(temp);
      } else if (temp.nodes[1].ports[4].status !== 'up') {
        const newData = { nodes: temp.nodes, links: temp.links };
        newData.nodes[1].ports[4].status = 'up';
        newData.nodes[3].status = 'running';
        newData.nodes[7].status = 'running';
        delete newData.nodes[9];
        setTimeout(() => {
          setData(newData);
        }, 5000);
      }
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
