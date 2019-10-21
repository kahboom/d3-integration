/**
 * 資料格式
 * data: {
 *  id, from, to, status, zIndex, name, lineIndex, type:'multiLine'
 * }
 */
import PathLine from './PathLine';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
const d3 = Object.assign({}, require('d3-shape'));
export default class MultiLine extends PathLine {
  strokeWidth = 2;
  stroke = '#3a3c3e';
  multiLineInfo = {};
  arrowInfo = { id: 'multiPathLineEndArrow', position: 'marker-end', width: 10, height: 10, refX: 7, refY: 0, stroke: '#2D2D2D', d: 'M0,-4L11,0L0,4 Z', viewBox: '0 -5 10 10' };
  dataPreprocessing(nodes, links) {
    super.dataPreprocessing(nodes, links);
    const { multiLineInfo } = this;
    if (links) {
      // clear
      Object.keys(multiLineInfo).forEach(k => delete multiLineInfo[k]);
      links.forEach(link => {
        if (link.type === 'multiLine') {
          const key = `${link.from}_${link.to}`;
          const info = (multiLineInfo[key] = multiLineInfo[key] || { lineNumber: 0 });
          info.lineNumber += 1;
        }
      });
    }
  }
  create(dom, data) {
    this.appendLine(dom, data);
  }
  appendLine(linkDom, data) {
    super.appendLine(linkDom, data);
    linkDom.select('path.link').classed('multiLine', true);
  }
  getLinkPathPosition({ data }) {
    // arrow
    // https://stackoverflow.com/questions/11808860/how-to-place-arrow-head-triangles-on-svg-lines
    const { multiLineInfo } = this;
    const { width, height } = this.props;
    const { spec, util } = this.props.projectState;
    const showLineArrow = get(data, 'arrow', false);
    const lineIndex = get(data, 'lineIndex', 0);
    const isOdd = lineIndex % 2 !== 0;
    const base = 20;
    const quotient = parseInt(lineIndex / 2) + 1;
    const curveFunc = d3.curveCardinal.tension(0);
    // 預設不填為arc
    const lineType = get(data, 'lineType', 'arc');
    const key = `${data.from}_${data.to}`;
    const lineNumber = get(multiLineInfo, [key, 'lineNumber'], 1);
    const getControlPoints = (source, target) => {
      const controlPoints = [];
      if (lineIndex > 0) {
        // const targetQuadrant = util.getQuadrant(target.x, target.y);
        if (lineType === 'cardinal') {
          const middleX = (source.x + target.x) / 2;
          const middleY = (source.y + target.y) / 2;
          const oddFlag = isOdd ? 1 : -1;
          const x = middleX + oddFlag * quotient * base;
          const y = middleY + oddFlag * quotient * base;
          const controlPoint1 = { x, y };
          controlPoints.push(controlPoint1);
        } else if (lineType === 'bundle') {
          const minX = Math.min(source.x, target.x);
          const minY = Math.min(source.y, target.y);
          const diffX = Math.abs(source.x - target.x);
          const diffY = Math.abs(source.y - target.y);
          const base = lineIndex > 0 ? 15 : 0;
          const factor = lineIndex * 0.1;
          const controlPoint1 = {};
          if (source.x < target.x) {
            controlPoint1.x = minX + diffX * factor + base;
          } else {
            controlPoint1.x = minX + diffX * factor - base;
          }
          if (source.y < target.y) {
            controlPoint1.y = minY + diffY * factor + base;
          } else {
            controlPoint1.y = minY + diffY * factor - base;
          }
          controlPoints.push(controlPoint1);
        }
      }
      return controlPoints;
    };
    if (['cardinal', 'bundle'].indexOf(lineType) !== -1) {
      return util.getLinkPathPosition({ data, lineType, getControlPoints, curveFunc });
    } else if (lineType === 'arc') {
      const dx = data.target.x - data.source.x;
      const dy = data.target.y - data.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      const lineInfo = { rx: dr, ry: dr, maxWidth: width, maxHeight: height, bias: { source: { x: -data.source.x, y: -data.source.y }, target: { x: -data.source.x, y: -data.source.y } } };
      const nodeStyle = spec.findTypeStyle(data.target, 'node');
      const nodeWidth = showLineArrow ? nodeStyle['width'] + 3 : 0;
      const nodeHeight = showLineArrow ? nodeStyle['height'] + 3 : 0;
      const nodeBias = { source: { x: 0, y: 0 }, target: { x: -nodeWidth, y: -nodeHeight } };
      return util.getLinkPathPosition({ data, lineType, bias: nodeBias, lineIndex, lineNumber, lineInfo, curveFunc });
    } else if (['linear', 'diagonal', 'polyPathLine'].indexOf(lineType) !== -1) {
      // https://webiks.com/d3-js-force-layout-straight-parallel-links/
      const lineNumberIsOdd = lineNumber % 2 !== 0;
      // 當線總數非偶數時，需要對lineIndex做微調
      const lineIndex = !lineNumberIsOdd ? data.lineIndex : data.lineIndex !== 0 ? data.lineIndex + 1 : data.lineIndex + 0.5;
      const lineIndexIsOdd = lineIndex % 2 !== 0;
      const lineDistance = 3;
      const targetDistance = lineIndex * lineDistance;
      const x1X0 = data.target.x - data.source.x;
      const y1Y0 = data.target.y - data.source.y;
      let x2X0;
      let y2Y0;
      if (y1Y0 === 0) {
        x2X0 = 0;
        y2Y0 = targetDistance;
      } else {
        const angle = Math.atan(x1X0 / y1Y0);
        x2X0 = -targetDistance * Math.cos(angle);
        y2Y0 = targetDistance * Math.sin(angle);
      }
      if (lineIndexIsOdd) {
        x2X0 = -x2X0;
        y2Y0 = -y2Y0;
      }
      const newData = cloneDeep(data);
      newData.source.x += x2X0;
      newData.source.y += y2Y0;
      newData.target.x += x2X0;
      newData.target.y += y2Y0;
      return super.getLinkPathPosition({ data: newData, lineType });
    }
  }
  refreshLineLabelPosition(gDom, data) {
    // text-position is not ready for getting bbox
    setTimeout(() => {
      super.refreshLineLabelPosition(gDom, data);
    });
  }
}
