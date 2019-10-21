/**
 * @class project/Based
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/project/Topology.react';
 * import Based from '&/@chttl/topology/src/topology/project/Based';
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  // override function
 *  getDataProcessor(){
 *   super.getDataProcessor()
 *  }
 *  // available overrided stubs
 *  initiated() {}
 *  dataPreprocessing() {}
 *  dataProcessed() {}
 *  quit() {}
 *  resize() {}
 *  refresh() {}
 * }
 *
 * <Topology identifier="topology" mode="2d" projectPath={'./customTopology/projectFolder'} projectName={'TestProject'}
 *  data={{nodes: [], links: []}} width={300} height={300} enableGroup />
 *
 */
import DefaultDataProcessor from '../dataProcessor/DefaultDataProcessor';
export default class Based {
  props;
  state;
  constructor(props) {
    console.log('project constructing...');
    this.props = props || {};
    // init state
    this.state = {};
    this.init();
  }
  init() {
    console.log('project initiating...');
  }
  getDataProcessor(props) {
    // do not store data processor instance in project
    return new DefaultDataProcessor(props);
  }
  initiated() {}
  dataPreprocessing() {}
  dataProcessed() {}
  quit() {}
  resize() {}
  refresh() {}
}
