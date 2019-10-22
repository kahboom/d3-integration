/**
 * @class Topology
 * @param {object} props - ex. {identifier, projectName, data, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * <Topology identifier="topology" mode="2d" projectName={'NetworkTemplate1'} data={{nodes: [], links: []}} width={300} height={300} enableGroup />
 *
 */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import D3Component from './D3Component';
import './style.css';

Topology.propTypes = {
  identifier: PropTypes.string,
  mode: PropTypes.oneOf(['2d', '3d']),
  projectPath: PropTypes.string,
  projectName: PropTypes.string,
  projectClass: PropTypes.func,
  data: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  configs: PropTypes.object,
  nodeType: PropTypes.object,
  linkType: PropTypes.object,
  status: PropTypes.object,
  view: PropTypes.object,
  toolbar: PropTypes.object
};

Topology.defaultProps = {
  identifier: 'unknown',
  mode: '2d',
  projectPath: './project',
  projectName: 'Force',
  projectClass: undefined,
  data: undefined,
  width: 300,
  height: 300
};

export default function Topology(props) {
  const refElement = useRef(null);
  const { identifier, mode, data, width, height } = props;
  // Declare a new state variable
  const [vis, setVis] = useState(undefined);
  const [message, setMessage] = useState(undefined);

  // init
  useEffect(() => {
    if (mode === '2d') {
      setVis(new D3Component(refElement.current, { ...props, identifier: `canvas_${identifier}` }));
    } else if (mode === '3d') {
      setMessage('Not Support 3D');
    }
  }, [mode]);

  // update
  useEffect(() => {
    if (vis) {
      console.log('receiving new data..');
      vis.update(props);
    }
  }, [data]);

  // quit
  useEffect(() => {
    if (vis) {
      return () => {
        vis.quit();
      };
    }
  }, []);

  // resize
  useEffect(() => {
    if (vis) {
      vis.resize(width, height);
    }
  }, [width, height]);

  return (
    <div id={identifier} ref={refElement} className="topology" style={{ width: '100%', height: '100%' }}>
      <span>{message}</span>
    </div>
  );
}
