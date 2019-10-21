/**
 * 資料格式
 * data: {
 *  id, from, to, status, zIndex, name, lineIndex, type: 'testPathLine'
 * }
 */
// https://jsfiddle.net/skyr9999/an4yLpy9/
import PathLine from './PathLine';
import get from 'lodash/get';
export default class PolyPathLine extends PathLine {
  appendLine(linkDom, data) {
    super.appendLine(linkDom, data);
    linkDom.select('path.link').classed('polyPathLine', true);
  }
  getLinkPathPosition({ data }) {
    const showLineArrow = get(data, 'arrow', false);
    const { spec, util } = this.props.projectState;
    // const bias = merge({ source: { x: 0, y: 0 }, target: { x: 0, y: 0 } }, get(data, 'bias', {}));
    const nodeStyle = spec.findTypeStyle(data.target, 'node');
    const nodeWidth = showLineArrow ? get(nodeStyle, 'width', 0) + 10 : 0;
    const nodeHeight = showLineArrow ? get(nodeStyle, 'height', 0) + 10 : 0;
    const bias = { source: { x: 0, y: 0 }, target: { x: -nodeWidth, y: -nodeHeight } };
    return util.getLinkPathPosition({ data, lineType: 'polyPathLine', bias });
  }
}
