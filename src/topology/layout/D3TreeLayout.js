/**
 * @description
 * DefaultLayout d3 hierarchy, D3 Tree layout
 * https://codepen.io/EleftheriaBatsou/pen/LmddvN
 *
 * @class D3TreeLayout
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import D3TreeLayout from '&/@chttl/topology/src/topology/layout/D3TreeLayout';
 *
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  // override layout
 *  layout(props) {
 *    return new D3TreeLayout({ ...props, util: this.state.util, spec: this.state.spec, project: this });
 *  }
 * }
 *
 *
 */
import DefaultLayout from './DefaultLayout';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
const d3 = Object.assign({}, require('d3-hierarchy'));
export default class D3TreeLayout extends DefaultLayout {
  init() {
    console.log('layout initiating...');
    const { width, height, layoutParams } = this.props;
    const state = this.state;
    // setting state
    state._layout = this.generateD3TreeLayout(layoutParams);
    state.renderDirection = layoutParams.renderDirection || 'h';
    state.depthLength = 180;
    if (state.renderDirection === 'h') {
      state.translate = [-width / 2, -height / 2 + 50];
    } else {
      state.translate = [-height / 2, -width / 2 + 50];
    }
  }
  generateD3TreeLayout() {
    // https://bl.ocks.org/mbostock/3184089
    // https://codepen.io/EleftheriaBatsou/pen/LmddvN
    const { width, height, layoutParams } = this.props;
    const layout = d3.tree();
    if (layoutParams.renderDirection === 'h') {
      layout.size([width, height]);
    } else {
      layout.size([height, width]);
    }
    // stored state and props in layout
    layout.props = this.props;
    layout.state = this.state;
    return layout;
  }
  hierarchy(...args) {
    return invoke(d3, 'hierarchy', ...args);
  }
  normalizeTreeData(nodes) {
    if (nodes && nodes.length > 0) {
      // Assigns parent, children, height, depth
      const root = this.hierarchy(nodes[0], function(d) {
        return d.children;
      });
      // Assigns the x and y position for the nodes
      const treeData = this.state._layout(root);
      return treeData;
    }
  }
  swapPosition(data) {
    const tempX = data.x;
    data.x = data.y;
    data.y = tempX;
    return data;
  }
  nodes(nodes) {
    if (nodes) {
      const { translate, depthLength, renderDirection } = this.state;
      const treeData = this.normalizeTreeData(nodes);
      // Compute the new tree layout.
      const newNodes = treeData.descendants();
      // Normalize data.
      newNodes.forEach(d => {
        d.id = get(d, 'data.id');
        d.name = get(d, 'data.name');
        d.category = get(d, 'data.category');
        d.status = get(d, 'data.status');
        d.x = d.x + translate[0];
        d.y = d.depth * depthLength + translate[1];
        if (renderDirection === 'v') {
          this.swapPosition(d);
        }
      });
      return newNodes;
    }
  }
  links(links, nodes) {
    if (nodes) {
      const { translate, depthLength, renderDirection } = this.state;
      const treeData = this.normalizeTreeData(nodes);
      // Compute the new tree layout.
      const newNodes = treeData.descendants();
      const root = newNodes.length > 0 ? newNodes[0] : {};
      root.x += translate[0];
      root.y += translate[1];
      if (renderDirection === 'v') {
        this.swapPosition(root);
      }
      const newLinks = newNodes.slice(1);
      // Normalize data.
      newLinks.forEach(d => {
        d.id = get(d, 'data.id');
        d.status = get(d, 'data.status');
        d.x = d.x + translate[0];
        d.y = d.depth * depthLength + translate[1];
        if (renderDirection === 'v') {
          this.swapPosition(d);
        }
        d.target = d.target || d;
        d.source = d.source || d.parent;
        d.lineType = 'diagonal';
      });
      return newLinks;
    }
  }
}
