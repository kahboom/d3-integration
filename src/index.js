import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Topology from './topology/Topology';
//import integrationJson from './data/integration.json';
import integrationJson from './data/import.json';
//import integrationJson from './data/mapping.json';
//import syndesisHelper from './topology/util/SyndesisHelper';

import './styles.css';

function App() {
  const [width, setWidth] = useState(window.innerWidth - 20 || 0);
  const [height, setHeight] = useState(window.innerHeight - 20 || 0);
  const [data, setData] = useState(undefined);
  const projectName = 'Integration';

  let newLinks = [];
  let newNodes = [];

  function handleDataMapperMapping(mapping, mappingIdx, containerIdx) {
    /**
     * Sub-groups while you still have the ID for the parent group
     * Handle sub-group links
     * To/from data mapper step
     * To/from each other
     * If index is 0, skip, otherwise subtract 1 for link
     **/
    newNodes.push({
      id: 'map-' + mappingIdx,
      name: mapping.inputField[0].name + ' to ' + mapping.outputField[0].name,
      groupIds: [containerIdx], // from container ID
      category: 'example',
      status: 'update',
      groupable: true
    });
  }

  function handleDataMapperContainer(idx, containerIdx) {
    /**
     * Create container for sub-groups
     */
    const container = {
      id: containerIdx,
      name: 'Mappings',
      category: 'container',
      status: 'unpublished',
      views: ['setting'],
      isGroup: true,
      isExpand: false,
      expandable: true,
      collapsible: true
    };

    newNodes.push(container);
  }

  function handleDataMapper(step, idx) {
    const mappings = JSON.parse(step.configuredProperties.atlasmapping).AtlasMapping.mappings.mapping;

    const newStep = {
      id: idx,
      name: step.name || step.connection.connector.name || null,
      category: 'mapper',
      views: ['number'],
      status: 'error',
      objNumber: mappings.length,
      isGroup: true,
      isExpand: true,
      expandable: true,
      collapsible: true
    };

    newNodes.push(newStep);

    const containerIdx = idx + '1234';

    handleDataMapperContainer(idx, containerIdx);

    /**
     * Handle links for actual data mapper step
     * If index is 0, skip, otherwise subtract 1 for link
     */
    const linkTest = { id: 'l' + idx, from: idx, to: containerIdx };
    newLinks.push(linkTest);

    mappings.forEach((mapping, mappingIdx) => {
      handleDataMapperMapping(mapping, mappingIdx, containerIdx);
    });
  }

  useEffect(() => {
    let temp = data;

    function syndesisHelper(originalJson) {
      /**
       * TODO: Replace with Interface + TS
       * Iterate over each step
       * Accommodate data structure
       */
      const steps = originalJson.flows ? originalJson.flows[0].steps : [];

      steps.forEach((step, idx) => {
        const stringId = idx.toString();
        /**
         * Handle data mapper step separately
         */
        if(step.stepKind === 'mapper') {
          handleDataMapper(step, stringId);
        } else {
          const newStep = {
            id: stringId,
            name: step.name || step.connection.connector.name,
            category: step.stepKind
          };

          newNodes.push(newStep);

          /**
           * Handle links
           * If index is 0, skip, otherwise subtract 1 for link
           */
        }

        /**
         * Alternatively, you can handle links separately?
         */
      });

      const newSet = {nodes: newNodes, links: newLinks};

      //console.log('newSet: ' + JSON.stringify(newSet));

      console.log(newSet);

      setData(newSet);
    }

    if (projectName === 'Integration') {
      syndesisHelper(integrationJson);
      //temp = integrationJson;
      //setData(temp);
    } else {
      temp = integrationJson;
      setData(temp);
    }
  }, [integrationJson]);

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
    <div className='App'>
      <Topology identifier='topology' mode='2d' projectName={projectName} data={data} width={width} height={height} enableGroup />
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
