import NamesPathLine from './NamesPathLine';
import get from 'lodash/get';
const d3 = Object.assign({}, require('d3-selection'));
// subsidiary line
export default class SubLine extends NamesPathLine {
  strokeWidth = 1;
  stroke = '#3a3c3e';
  arrowInfo = { id: 'multiPathLineEndArrow', position: 'marker-end', width: 10, height: 10, refX: 2, refY: 0, stroke: '#2D2D2D', d: 'M0,-4L10,0L0,4 Z', viewBox: '0 -5 10 10' };
  zIndex = 8;
  appendLine(linkDom, data) {
    super.appendLine(linkDom, data);
    const { stroke, zIndex } = this;
    const { spec, util } = this.props.projectState;
    const linkStausStyle = spec.findStatusStyle(data, 'link');
    if (zIndex !== undefined) {
      util.moveZIndex(zIndex, linkDom);
    }
    linkDom.select('path').classed('subLine', true);
    linkDom.select('path').style('stroke', function(d) {
      return get(linkStausStyle, 'color', stroke);
    });
  }
  findDom(d3Id) {
    if (d3Id) {
      return d3.select(`#${d3Id}`);
    }
  }
  getLinkPathPosition({ data }) {
    const showLineArrow = get(data, 'arrow', false);
    const { spec, util } = this.props.projectState;
    let nodeWidth = 0;
    let nodeHeight = 0;
    if (get(data, 'target.category') === 'switchPort') {
      // port dom
      const dom = this.findDom(get(data, 'target.d3Id'));
      if (dom.node()) {
        const bbox = dom.node().getBBox();
        nodeWidth = bbox.width || 0;
        nodeHeight = bbox.height || 0;
      }
    } else {
      // main node
      const nodeStyle = spec.findTypeStyle(data.target, 'node');
      nodeWidth = showLineArrow ? get(nodeStyle, 'width', 0) + 10 : 0;
      nodeHeight = showLineArrow ? get(nodeStyle, 'height', 0) + 10 : 0;
    }
    const bias = { source: { x: 0, y: 0 }, target: { x: -nodeWidth, y: -nodeHeight } };
    return util.getLinkPathPosition({ data, lineType: get(data, 'lineType', 'linear'), bias });
  }
}
