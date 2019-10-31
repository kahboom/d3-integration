import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Topology from './topology/Topology';
import integrationJson from './data/import.json';

import './styles.css';

function App() {
  const [width, setWidth] = useState(window.innerWidth - 20 || 0);
  const [height, setHeight] = useState(window.innerHeight - 20 || 0);
  const [data, setData] = useState(undefined);
  const projectName = 'Integration';

  let newLinks = [];
  let newNodes = [];
  let dataMapperContainerId;
  let dataMapperInputContainerId;
  let dataMapperOutputContainerId;

  function handleDataMapperMapping(mapping, mappingIdx) {
    /**
     * Individual mappings from the data mapper step
     **/
    newNodes.push({
      id: 'map-input-' + mappingIdx,
      name: mapping.inputField[0].name,
      groupIds: [dataMapperInputContainerId],
      category: 'example',
      status: 'update',
      groupable: true
    });

    newNodes.push({
      id: 'map-output-' + mappingIdx,
      name: mapping.outputField[0].name,
      groupIds: [dataMapperOutputContainerId],
      category: 'example',
      status: 'update',
      groupable: true
    });
  }

  function handleDataMapperFieldContainers(idx) {
    /**
     * Displays the input fields
     */
    const containerForInput = {
      id: dataMapperInputContainerId,
      name: 'Input Fields',
      category: 'fields',
      groupIds: [dataMapperContainerId],
      groupable: true,
      expandable: true,
      isExpand: true,
      collapsible: true
    };

    /**
     * Displays the output fields
     */
    const containerForOutput = {
      id: dataMapperOutputContainerId,
      name: 'Output Fields',
      category: 'fields',
      groupIds: [dataMapperContainerId],
      groupable: true,
      isExpand: true,
      expandable: true,
      collapsible: true
    };

    newNodes.push(containerForInput, containerForOutput);
  }
  
  function handleDataMapperContainer(idx) {
    /**
     * Create container for sub-groups
     */
    const container = {
      id: dataMapperContainerId,
      name: 'Mappings',
      category: 'container',
      views: ['setting', 'colorTag-01'],
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

    dataMapperContainerId = 'mapper-container-' + idx;
    dataMapperInputContainerId = 'mapper-input-container-' + idx;
    dataMapperOutputContainerId = 'mapper-output-container-' + idx;

    handleDataMapperContainer(idx);
    handleDataMapperFieldContainers(idx);

    /**
     * Handle links for data mapper step
     */

    // From inline node of data mapper to Mappings container
    newLinks.push({ id: 'l-container-' + idx, from: idx, to: dataMapperContainerId });

    // From inline Data Mapper node of data mapper to Input fields, when Mappings container is expanded
    newLinks.push({ id: 'l-input-fields-' + idx, from: idx, to: dataMapperInputContainerId });

    // From inline Data Mapper node of data mapper to Output fields, when Mappings container is expanded
    newLinks.push({ id: 'l-output-fields-' + idx, from: idx, to: dataMapperOutputContainerId });

    mappings.forEach((mapping, mappingIdx) => {
      handleDataMapperMapping(mapping, mappingIdx);
    });
  }



  useEffect(() => {
    let id;
    let temp = data;

    function syndesisHelper(originalJson) {
      /**
       * TODO: Replace with Interface + TS
       * Iterate over each step
       */
      const steps = originalJson.flows ? originalJson.flows[0].steps : [];

      const statusList = ['published', 'unpublished', 'error', 'pending', 'deleting'];

      steps.forEach((step, idx) => {
        id = idx.toString();
        const randomIndex = Math.floor(Math.random() * statusList.length);

        /**
         * Handle data mapper step separately
         */
        if(step.stepKind === 'mapper') {
          handleDataMapper(step, id);
        } else {
          const newStep = {
            id: id,
            name: step.name || step.connection.connector.name,
            status: id === 1 ? 'pending' : statusList[randomIndex],
            category: step.stepKind
          };

          newNodes.push(newStep);
        }

        /**
         * Handle links
         */
        if (id !== 0) {newLinks.push({ id: 'l-prev-node' + id, from: id - 1, to: id })}
      });

      setData({nodes: newNodes, links: newLinks});
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
