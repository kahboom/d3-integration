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

  function handleDataMapperContainers(idx, containerIdx) {
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

    /**
     * Displays the input fields
     */
    const containerForInput = {
      id: 'input-' + idx,
      name: 'Input Fields',
      category: 'example',
      status: 'update',
      groupIds: [containerIdx],
      groupable: true
    };

    /**
     * Displays the output fields
     */
    const containerForOutput = {
      id: 'output-' + idx,
      name: 'Output Fields',
      category: 'example',
      status: 'update',
      groupIds: [containerIdx],
      groupable: true
    };

    newNodes.push(container, containerForInput, containerForOutput);
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

    handleDataMapperContainers(idx, containerIdx);

    /**
     * Handle links for actual data mapper step
     * If index is 0, skip, otherwise subtract 1 for link
     */

    // From inline node of data mapper to Mappings container
    newLinks.push({ id: 'l-container-' + idx, from: idx, to: containerIdx });

    // From inline Data Mapper node of data mapper to Input fields, when Mappings container is expanded
    newLinks.push({ id: 'l-input-fields-' + idx, from: idx, to: 'input-' + idx });

    // From inline Data Mapper node of data mapper to Output fields, when Mappings container is expanded
    newLinks.push({ id: 'l-output-fields-' + idx, from: idx, to: 'output-' + idx });

    mappings.forEach((mapping, mappingIdx) => {
      handleDataMapperMapping(mapping, mappingIdx, containerIdx);
    });
  }

  useEffect(() => {
    let id;
    let temp = data;

    function syndesisHelper(originalJson) {
      /**
       * TODO: Replace with Interface + TS
       * Iterate over each step
       * Accommodate data structure
       */
      const steps = originalJson.flows ? originalJson.flows[0].steps : [];

      steps.forEach((step, idx) => {
        id = idx.toString();
        /**
         * Handle data mapper step separately
         */
        if(step.stepKind === 'mapper') {
          handleDataMapper(step, id);
        } else {
          const newStep = {
            id: id,
            name: step.name || step.connection.connector.name,
            status: originalJson.currentState.toLowerCase(),
            category: step.stepKind
          };

          newNodes.push(newStep);
        }

        /**
         * Handle links
         * If index is 0, skip, otherwise subtract 1 for link
         * If not first, from previous node to current node
         */
        if (id !== 0) {newLinks.push({ id: 'l-prev-node' + id, from: id - 1, to: id })}
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
