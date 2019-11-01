/**
 * @class Shape2D
 * @param {object} props - ex. {identifier, projectName, projectState...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import Shape2D from '&/@chttl/topology/src/topology/factory/shape/Shape2D';
 *
 * class CustomShape extends Shape2D {
 *  //do something
 *  create(dom, data) {
 *   this.appendShape(dom, data);
 *   this.addAnimation(dom, data);
 *  }
 *  appendShape(){
 *   //do something
 *  }
 *  appendShape(){
 *   //do something
 *  }
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
import Based from './Based';
import { ShapeGenerator } from './ShapeGenerator';
import { ViewGenerator } from './ViewGenerator';
import get from 'lodash/get';
export default class Shape2D extends Based {
  fontAwesomeClass = 'FontAwesome';
  init() {
    super.init();
    this.state.shapeGenerator = ShapeGenerator;
    this.state.viewGenerator = ViewGenerator;
  }

  // animation
  addAnimation(newNodeDom, data) {
    this.transAnimation(newNodeDom, data);
    // if using this method, need to stop animation when shape is gone.
  }

  transAnimation(target, data) {
    const drawType = 'node';
    const { spec, animation } = this.props.projectState;
    const dataStyle = spec.findDataStyle(data, drawType);
    // console.debug('addAnimation statusStyle', statusStyle);
    if (dataStyle && dataStyle.animate && dataStyle['visibility'] !== false) {
      // if(!Animate.getTimerActive()){
      //     Animate.setTimerActive(true);
      // }
      animation.setAnimation(data, target, dataStyle.animate);
    } else {
      // console.debug('no animate!---> stop');
      animation.stopAnimation(target);
    }
  }

  // utils
  radius(d, nodeStyle) {
    return get(nodeStyle, 'width', 0);
  }
  getFontBySpec(data, nodeStyle) {
    let font;
    const { nodeSize } = this.props;
    const { fontAwesomeClass } = this;
    // if(data.depth !== 0){ //smaller children
    if (nodeStyle.fontSize) {
      font = `${nodeStyle.fontSize} "${fontAwesomeClass}"`;
    } else if (nodeSize) {
      font = `${nodeSize}px "${fontAwesomeClass}"`;
    }
    return font;
  }
}
