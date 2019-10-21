/**
 * @description
 * Topology Shape
 *
 * @class shape/Based
 * @param {object} props - ex. {identifier, projectName, projectState...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import Based from '&/@chttl/topology/src/topology/factory/shape/Based';
 *
 * class CustomShape extends Based {
 *  //do something
 * }
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  init() {
 *   super.init();
 *   const customShape = new CustomShape({ ...props, projectState });
 *   // setting state
 *   const { factory } = state;
 *   state.factory = { ...factory, customShape };
 *  }
 *  addNodeContent(newNodeDom, data) {
 *   const { factory } = this.state;
 *   get(factory, 'customShape').create(newNodeDom, data);
 *  }
 * }
 *
 *
 */
export default class Based {
  props;
  state;
  constructor(props) {
    console.log('shape constructing...');
    this.props = props || {};
    // init state
    this.state = {};
    this.init();
  }
  init() {
    console.log('shape initiating...');
  }
  // stubs
  dataPreprocessing() {}
  create() {}
  update() {}
  delete() {}
  dataProcessed() {}
}
