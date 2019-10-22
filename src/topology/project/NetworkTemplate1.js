/**
 * @class NetworkTemplate1
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends NetworkTemplate1 {
 *  // available overrided stubs
 *  beforeProcessNodes() {}
 *  startProcessNodes() {}
 *  addNodeContent() {}
 *  bindingNodeSelectEvent() {}
 *  updateNodeContent() {}
 *  removeNode() {}
 *  beforeProcessLinks() {}
 *  startProcessLinks() {}
 *  addLinkContent() {}
 *  bindingLinkSelectEvent() {}
 *  updateLinkContent() {}
 *  removeLink() {}
 *  beforeProcessGroups() {}
 *  startProcessGroups() {}
 *  addGroupContent() {}
 *  updateGroupContent() {}
 *  removeGroup() {}
 * }
 *
 * <Topology identifier="topology" mode="2d" projectPath={'./customTopology/projectFolder'} projectName={'TestProject'}
 *  data={{nodes: [], links: []}} width={300} height={300} enableGroup />
 *
 */
import Topology2D from './Topology2D';
import CustomLayout from '../layout/CustomLayout';
import GroupNode from '../factory/data/GroupNode';
import Circle from '../factory/shape/Circle';
import PathLine from '../factory/shape/PathLine';
import RectScope from '../factory/shape/RectScope';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import { event as d3Event } from 'd3-selection';
export default class NetworkTemplate1 extends Topology2D {
  dummyGroupLinks = [];
  dummyGroupNodes = [];
  init() {
    super.init();
    const { state, props } = this;
    const projectState = state;
    const circle = new Circle({ ...props, projectState });
    const pathLine = new PathLine({ ...props, projectState });
    const rectScope = new RectScope({ ...props, projectState });
    // setting state
    const { factory } = state;
    state.factory = { ...factory, circle, pathLine, rectScope };
  }

  layout(props) {
    return new NetworkTemplate1Layout({ ...props, type: 'force', util: this.state.util, spec: this.state.spec, project: this });
  }

  dataPreprocessing(nodes, links) {
    const { enableGroup, projectName } = this.props;
    const { spec, factory } = this.state;

    if (enableGroup && nodes) {
      const groupNodeExpanding = e => {
        let event = new CustomEvent('updateTopology', { projectName });
        e.target.dispatchEvent(event);
        event = new CustomEvent('unselectAll', { projectName });
        d3Event.target.dispatchEvent(event);
      };
      GroupNode.dealWithGroupData(nodes, links, { spec, dummyGroupLinks: this.dummyGroupLinks, dummyGroupNodes: this.dummyGroupNodes, groupNodeExpanding });
    }
    const keys = Object.keys(factory);
    keys.forEach(key => {
      factory[key].dataPreprocessing(nodes, links);
    });
  }

  dataProcessed(nodes, links) {
    const { factory } = this.state;
    const keys = Object.keys(factory);
    keys.forEach(key => {
      factory[key].dataProcessed(nodes, links);
    });
  }

  addNodeContent(newNodeDom, data) {
    const { factory } = this.state;
    get(factory, 'circle').create(newNodeDom, data);
  }

  bindingNodeSelectEvent(nodeDom, selector) {
    selector.bindEvent('node', nodeDom, {
      selected: () => {
        console.log('node was selected...');
      },
      unselected: () => {
        console.log('node was unselected...');
      }
    });
  }

  updateNodeContent(nodeDom, data) {
    const { factory } = this.state;
    get(factory, 'circle').update(nodeDom, data);
  }

  removeNode(nodeDom) {
    const { factory } = this.state;
    get(factory, 'circle').delete(nodeDom);
  }

  addLinkContent(linkDom, data) {
    const { factory } = this.state;
    get(factory, 'pathLine').create(linkDom, data);
  }

  updateLinkContent(linkDom, data) {
    const { factory } = this.state;
    get(factory, 'pathLine').update(linkDom, data);
  }

  addGroupContent(groupDom, data) {
    const { factory } = this.state;
    get(factory, 'rectScope').create(groupDom, data);
  }

  updateGroupContent(groupDom, data) {
    const { factory } = this.state;
    get(factory, 'rectScope').update(groupDom, data);
  }

  refreshLineLabelPosition(groupDom, data) {
    const { factory } = this.state;
    invoke(factory, 'pathLine.refreshLineLabelPosition', groupDom, data);
  }

  quit() {
    // Destroy DOM
    const { animation } = this.state;
    animation.stopAllAnimation();
  }
}

class NetworkTemplate1Layout extends CustomLayout {}
