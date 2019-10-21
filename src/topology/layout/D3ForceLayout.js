/**
 * @description
 * https://wizardace.com/d3-forcesimulation-link-detail/
 *
 * @class D3ForceLayout
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import D3ForceLayout from '&/@chttl/topology/src/topology/layout/D3ForceLayout';
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  // override layout
 *  layout(props) {
 *    return new D3ForceLayout({ ...props, util: this.state.util, spec: this.state.spec, project: this });
 *  }
 * }
 *
 *
 */
import DefaultLayout from './DefaultLayout';
import invoke from 'lodash/invoke';
import { event as d3Event } from 'd3-selection';
const d3 = Object.assign({}, require('d3-selection'), require('d3-force'), require('d3-drag'));
export default class D3ForceLayout extends DefaultLayout {
  init() {
    console.log('layout initiating...');
    const { layoutParams } = this.props;
    const state = this.state;
    // simple force layout
    state._layout = this.generateD3ForceLayout(layoutParams);
  }
  generateD3ForceLayout() {
    // https://bl.ocks.org/almsuarez/baa897c189ed64ba2bb32cde2876533b
    // https://wizardace.com/d3-forcesimulation-link-detail/
    const layout = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-200))
      .on('tick', this.ticked);
    // stored state and props in layout
    layout.props = this.props;
    layout.state = this.state;
    return layout;
  }

  dragNode(dom) {
    const drag = invoke(d3, 'drag', dom);
    return drag
      .on('start', data => {
        this.dragStart(dom, data);
      })
      .on('drag', data => {
        this.dragging(dom, data);
      })
      .on('end', data => {
        this.dragEnd(dom, data);
      });
  }
  dragGroup() {
    return this.dragNode();
  }
  dragStart(dom, data) {
    super.dragStart(dom, data);
    const { _layout } = this.state;
    const x = d3Event.subject.x;
    const y = d3Event.subject.y;
    if (!d3Event.active) {
      _layout.alphaTarget(0.3).restart();
    }

    d3Event.subject.fx = x;
    d3Event.subject.fy = y;
  }
  dragging(dom, data) {
    super.dragging(dom, data);
    d3Event.subject.fx = d3Event.x;
    d3Event.subject.fy = d3Event.y;
  }
  dragEnd(dom, data) {
    super.dragging(dom, data);
    const { minimap, _layout } = this.state;
    invoke(minimap, 'refresh');
    if (!d3Event.active) {
      _layout.alphaTarget(0);
    }
    d3Event.subject.fx = null;
    d3Event.subject.fy = null;
  }
}
