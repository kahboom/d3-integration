import get from 'lodash/get';
import parseSvgTransform from './svgTransformParser';
//import { parse as parseSvgTransform } from 'svg-transform-parser';
const d3 = Object.assign({}, require('d3-selection'), require('d3-scale'), require('d3-shape'));
const configurations = {};

const d3TopoUtil = {
  replaceIconByBrowser: function(nodeType) {
    if (nodeType && !this.isChromeAgent()) {
      for (const key in nodeType) {
        if (nodeType.hasOwnProperty(key)) {
          const nodeTypeValues = nodeType[key];
          if (nodeTypeValues['icon'] && nodeTypeValues['icon'].indexOf('svg') >= 0 && nodeTypeValues['iconOfPng']) {
            nodeTypeValues['icon'] = nodeTypeValues['iconOfPng'];
          }
        }
      }
    }
  },

  removeConfiguration: function(id) {
    delete configurations[id];
  },

  colorGoogleArray() {
    return [
      '#3366cc',
      '#dc3912',
      '#ff9900',
      '#109618',
      '#990099',
      '#0099c6',
      '#dd4477',
      '#66aa00',
      '#b82e2e',
      '#316395',
      '#994499',
      '#22aa99',
      '#aaaa11',
      '#6633cc',
      '#e67300',
      '#8b0707',
      '#651067',
      '#329262',
      '#5574a6',
      '#3b3eac'
    ];
  },

  colorGoogle: function() {
    // return d3.scale.ordinal().range(this.colorGoogleArray());
    return d3.scaleBand().range(this.colorGoogleArray());
  },

  isHullObj: function(obj) {
    return obj && obj.id && obj.nodes && obj.path && obj.d3Id && obj.d3Id.indexOf('pathhull-') !== -1;
  },

  isRectGroupObj: function(obj) {
    return obj && obj.id && obj.nodes && obj.d3Id && obj.d3Id.indexOf('rectgroup-') !== -1;
  },

  isNodeObj: function(obj) {
    return obj && obj.id && obj.d3Id && obj.d3Id.indexOf('gnode-') !== -1;
  },

  isLinkObj: function(obj) {
    return obj && obj.id && obj.d3Id && obj.d3Id.indexOf('glink-') !== -1;
  },

  isPanAction: function(mouseDownPosition, mouseUpPosition) {
    if (mouseDownPosition && mouseUpPosition) {
      if (this.diff(mouseUpPosition.x, mouseDownPosition.x) > 5 || this.diff(mouseUpPosition.y, mouseDownPosition.y) > 5) {
        return true;
      }
    }
    return false;
  },

  isIEAgent: function() {
    if (this.isIEAgentValue !== undefined) {
      return this.isIEAgentValue;
    }
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Trident') !== -1 || userAgent.indexOf('MSIE ') !== -1 || !!document.documentMode) {
      this.isIEAgentValue = true;
      return true;
    } else {
      this.isIEAgentValue = false;
      return false;
    }
  },

  isOperaAgent: function() {
    if (this.isOperaAgentValue !== undefined) {
      return this.isOperaAgentValue;
    }
    if (!!window.opera || window.navigator.userAgent.indexOf(' OPR/') >= 0) {
      this.isOperaAgentValue = true;
      return true;
    } else {
      this.isOperaAgentValue = false;
      return false;
    }
  },

  isChromeAgent: function() {
    if (this.isChromeAgentValue !== undefined) {
      return this.isChromeAgentValue;
    }
    if (!!window.chrome && !this.isOperaAgent()) {
      this.isChromeAgentValue = true;
      return true;
    } else {
      this.isChromeAgentValue = false;
      return false;
    }
  },

  isFirefoxAgent: function() {
    if (this.isFirefoxAgentValue !== undefined) {
      return this.isFirefoxAgentValue;
    }
    if (typeof window.InstallTrigger !== 'undefined') {
      this.isFirefoxAgentValue = true;
      return true;
    } else {
      this.isFirefoxAgentValue = false;
      return false;
    }
  },

  isSafariAgent: function() {
    if (this.isSafariAgentValue !== undefined) {
      return this.isSafariAgentValue;
    }
    if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') >= 0) {
      this.isSafariAgentValue = true;
      return true;
    } else {
      this.isSafariAgentValue = false;
      return false;
    }
  },

  isNumber: function(n) {
    let result = false;
    try {
      result = !isNaN(parseFloat(n)) && isFinite(n);
    } catch (e) {
      result = false;
    }
    return result;
  },

  isDomExist(d3Dom) {
    return !d3Dom || !d3Dom.node();
  },

  diff: function(a, b) {
    return Math.abs(a - b);
  },

  distance: function(x1, y1, x2, y2) {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  },

  getQuadrant(x, y) {
    // 要注意的是拓撲的四個象限跟傳統數學四個象限的分佈不太一樣
    let quadrant = -1;
    if (x > 0 && y > 0) {
      quadrant = 1;
    } else if (x < 0 && y > 0) {
      quadrant = 2;
    } else if (x < 0 && y < 0) {
      quadrant = 3;
    } else if (x > 0 && y < 0) {
      quadrant = 4;
    }
    return quadrant;
  },

  getValueFromObject(obj, key, defaultValue) {
    if (obj) {
      const value = get(obj, key, defaultValue);
      if (value !== undefined && value !== null && !isNaN(value) && value !== Infinity && value !== -Infinity) {
        return value;
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  },

  checkNumber(value, defaultValue) {
    if (this.isNumber(value)) {
      return value;
    } else {
      return defaultValue;
    }
  },

  findObjectInArray(array, item) {
    let iteratorIndex = -1;
    if (array && array.forEach) {
      array.forEach(function(temp, i) {
        if ((item.oid !== undefined && item.oid === temp.oid) || (item.id !== undefined && item.id === temp.id)) {
          iteratorIndex = i;
        }
      }, item);
    }
    return iteratorIndex;
  },

  getSizeInt(value, defaultValue) {
    let sizeInt;
    try {
      sizeInt = value ? parseInt(value.replace('px', '')) : defaultValue;
    } catch (e) {
      sizeInt = defaultValue;
    }
    return sizeInt;
  },

  // normal line position
  getLinkPathPosition({
    data,
    lineType,
    lineIndex = 0,
    lineNumber = 1,
    curveFunc,
    getControlPoints = () => {
      return [];
    },
    reversed = false,
    bias,
    lineInfo
  }) {
    let result;
    // https://www.dashingd3js.com/svg-paths-and-d3js
    // bias就是點的padding
    bias = bias || { source: { x: 0, y: 0 }, target: { x: 0, y: 0 } };
    const defaultInterpolateTypes = {
      linear: d3.curveLinear,
      basis: d3.curveBasis,
      cardinal: d3.curveCardinal,
      bundle: d3.curveBundle,
      monotone: d3.curveMonotoneX
    };
    if (!curveFunc) {
      curveFunc = lineType && defaultInterpolateTypes[lineType] ? defaultInterpolateTypes[lineType] : defaultInterpolateTypes['linear'];
    }
    switch (lineType) {
      case 'arc':
        if (lineInfo) {
          // https://www.oxxostudio.tw/articles/201406/svg-05-path-2.html
          const startIndex = lineNumber % 2 !== 0 ? lineIndex + 1 : lineIndex; // odd or even number
          const lineNumberQuotient = parseInt(lineNumber / 2);
          const isOdd = startIndex % 2 !== 0;
          const sweepFlag = isOdd ? 1 : 0;
          const quotient = parseInt(startIndex / 2) + ((1 * lineNumber) % 2 !== 0 ? 0 : 1); // odd line number start from 0
          const sourceWithBias = { x: data.source.x + lineInfo.bias.source.x, y: data.source.y + lineInfo.bias.source.y };
          const targetWithBias = { x: data.target.x + lineInfo.bias.target.x, y: data.target.y + lineInfo.bias.target.y };
          const hypotenuse = this.distance(sourceWithBias.x, sourceWithBias.y, targetWithBias.x, targetWithBias.y);
          const oppositeWithYAxis = this.distance(0, targetWithBias.y, targetWithBias.x, targetWithBias.y);
          const angleWithYAxis = this.getAngleOfRightTriangle(hypotenuse, oppositeWithYAxis);
          let rx;
          let ry;
          if (angleWithYAxis <= 30) {
            rx = lineInfo.rx * quotient;
            ry = lineInfo.ry;
          } else if (angleWithYAxis <= 75) {
            rx = lineInfo.rx * (quotient > 0 ? lineNumberQuotient / 10 + 1 / quotient : 0);
            ry = lineInfo.ry * (quotient > 0 ? lineNumberQuotient / 10 + 1.5 / quotient : 0);
          } else {
            rx = lineInfo.rx;
            ry = lineInfo.ry * quotient;
          }
          const p = this.getNormPosition(data, bias);
          result = 'M' + p.source.x + ',' + p.source.y + ` A${rx} ${ry}, 0 0 ${sweepFlag} ` + p.target.x + ',' + p.target.y;
        }
        break;
      case 'diagonal':
        if (data) {
          const p = this.getNormPosition(data, bias);
          result = `M ${p.source.x} ${p.source.y}
          C ${(p.source.x + p.target.x) / 2} ${p.source.y},
            ${(p.source.x + p.target.x) / 2} ${p.target.y},
            ${p.target.x} ${p.target.y}`;
        }
        break;
      case 'polyPathLine':
        if (data) {
          const p = this.getNormPosition(data, bias);
          result = 'M' + p.source.x + ',' + p.source.y + 'V' + (3 * p.source.y + 4 * p.target.y) / 7 + 'H' + p.target.x + 'V' + p.target.y;
        }
        break;
      default:
        if (data) {
          const line = this.genLine(bias).curve(curveFunc);
          let pointArray = [data.source, ...getControlPoints(data.source, data.target), data.target];
          pointArray = reversed ? pointArray.reverse() : pointArray;
          result = line(pointArray);
        }
    }
    return result;
  },
  getNormPosition(data, bias) {
    const norm = this.getNorm(data.source, data.target);
    const sourceX = data.source.x + bias.source.x * norm.x;
    const sourceY = data.source.y + bias.source.y * norm.y;
    const targetX = data.target.x + bias.target.x * norm.x;
    const targetY = data.target.y + bias.target.y * norm.y;
    return { source: { x: sourceX, y: sourceY }, target: { x: targetX, y: targetY } };
  },
  getNorm(source, target) {
    // 保持連接點一直面著兩點之間
    // 參考http://bl.ocks.org/rkirsling/5001347
    if (source !== undefined && target !== undefined) {
      const deltaX = target.x - source.x;
      const deltaY = target.y - source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      return { x: normX, y: normY };
    } else {
      return { x: 1, y: 1 };
    }
  },
  genLine(bias) {
    return d3
      .line()
      .x((d, index, array) => {
        const source = array[0];
        const target = array[array.length - 1];
        const norm = this.getNorm(source, target);
        let b = 0;
        if (index === 0) {
          b = bias.source.x;
        } else if (index === array.length - 1) {
          b = bias.target.x;
        }
        return d && this.isNumber(d.x) ? d.x + b * norm.x : b * norm.x || 0;
      })
      .y((d, index, array) => {
        const source = array[0];
        const target = array[array.length - 1];
        const norm = this.getNorm(source, target);
        let b = 0;
        if (index === 0) {
          b = bias.source.y;
        } else if (index === array.length - 1) {
          b = bias.target.y;
        }
        return d && this.isNumber(d.y) ? d.y + b * norm.y : b * norm.y || 0;
      });
  },
  getTranslateFromTransform(string) {
    const position = typeof string === 'string' ? string.indexOf('translate(') + 10 : -1;
    return position > -1
      ? string
          .substring(position, string.indexOf(')', position))
          .split(',')
          .map(t => Number(t))
      : [0, 0];
  },
  getScaleFromTransform(string) {
    const transform = string ? parseSvgTransform(string) : {};
    return get(transform, 'scale.sx', 1);
  },
  getParsedSvgTransform(string) {
    return string ? parseSvgTransform(string) : {};
  },
  functor(v) {
    return typeof v === 'function'
      ? v
      : function() {
          return v;
        };
  },
  getPointerPosition(event) {
    let x;
    let y;
    if (event instanceof TouchEvent) {
      x = get(event, 'changedTouches[0].clientX', 0);
      y = get(event, 'changedTouches[0].clientY', 0);
    } else {
      x = event.clientX || 0;
      y = event.clientY || 0;
    }
    return { x, y };
  },
  getComponentCenterPosition(dom, parentDom) {
    const position = { x: 0, y: 0 };
    const domElement = dom.node();
    if (domElement && parentDom) {
      const bbox = domElement.getBBox();
      const parentTranslateValue = this.getTranslateFromTransform(parentDom.attr('transform'));
      const relatedX = bbox.x || 0;
      const centerX = relatedX + bbox.width / 2 || 0;
      const relatedY = bbox.y || 0;
      const centerY = relatedY + bbox.height / 2 || 0;
      position.x = parentTranslateValue[0] + centerX;
      position.y = parentTranslateValue[1] + centerY;
    }
    return position;
  },
  getAngleOfRightTriangle(hypotenuse, opposite) {
    const sinOfAngleX = opposite / hypotenuse; // 0.5
    return (Math.asin(sinOfAngleX) * 180) / Math.PI;
  },
  moveZIndex(zIndex, dom) {
    if (zIndex !== undefined) {
      // rearrange z-index
      const parentNode = d3.select(dom.node().parentNode);
      const zIndexStatumDom = parentNode.select(`desc.zIndex-${zIndex}-stratum`);
      if (zIndexStatumDom.node() && parentNode.node()) {
        // https://www.w3schools.com/jsref/met_node_insertbefore.asp
        parentNode.node().insertBefore(dom.node(), zIndexStatumDom.node());
      }
    }
  },
  findRegressionLineByTwoPoints(x1, y1, x2, y2) {
    const a = x1 - x2 !== 0 ? (y1 - y2) / (x1 - x2) : 0;
    const b = y1 - x1 * a;
    return { a, b };
  },
  findRegressionLineByLeastSquares(valuesX, valuesY) {
    let sumX = 0;
    let sumY = 0;
    let sumXy = 0;
    let sumXx = 0;
    let count = 0;
    /*
     * We'll use those variables for faster read/write access.
     */
    let x = 0;
    let y = 0;
    const valuesLength = valuesX.length;
    if (valuesLength !== valuesY.length) {
      throw new Error('The parameters valuesX and valuesY need to have same size!');
    }
    /*
     * Nothing to do.
     */
    if (valuesLength === 0) {
      return [[], []];
    }
    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (let v = 0; v < valuesLength; v++) {
      x = valuesX[v];
      y = valuesY[v];
      sumX += x;
      sumY += y;
      sumXx += x * x;
      sumXy += x * y;
      count++;
    }
    /*
     * Calculate a and b for the formular:
     * y = x * a + b
     */
    const temp = count * sumXx - sumX * sumX;
    const a = temp !== 0 ? (count * sumXy - sumX * sumY) / temp : 0;
    const b = count !== 0 ? sumY / count - (a * sumX) / count : 0;
    return { a, b };
  },
  restoreNodePosition(node) {
    if (node.x !== undefined && node.addX !== undefined) {
      node.x -= node.addX;
    }
    if (node.y !== undefined && node.addY !== undefined) {
      node.y -= node.addY;
    }
    return true;
  },
  distanceNodePosition({ node, additionalDistance, isExpand, incremental = 'v' }) {
    let result = false;
    // 驗證expand是否可行
    if (isExpand && (node.addX !== undefined || node.addY !== undefined)) {
      return result;
    }
    if (additionalDistance !== undefined && additionalDistance !== 0) {
      // const quadrant = this.getQuadrant(node.x, node.y);
      let distanceFactorX = 1;
      let distanceFactorY = 1;
      // 透過遞增函式，越遠增加越多距離的方式來擴展
      if (incremental === 'v') {
        // vertical incremental
        distanceFactorY = Math.log2(this.distance(0, 0, 0, node.y) / 100);
      } else if (incremental === 'h') {
        // horizontal incremental
        distanceFactorX = Math.log2(this.distance(0, 0, node.x, 0) / 100);
      }
      let newX = node.x;
      let newY = node.y;
      const factor = isExpand ? 1 : -1;
      if (node.x !== 0) {
        additionalDistance *= distanceFactorX > 1 ? distanceFactorX : 1;
        const addX = node.x > 0 ? additionalDistance * factor : -additionalDistance * factor;
        newX += addX;
        node.addX = addX;
      }
      if (node.y !== 0) {
        additionalDistance *= distanceFactorY > 1 ? distanceFactorY : 1;
        const addY = node.y > 0 ? additionalDistance * factor : -additionalDistance * factor;
        newY += addY;
        node.addY = addY;
      }
      // setting new position
      node.x = newX;
      node.y = newY;
      result = true;
    }
    return result;
  }
};

export default d3TopoUtil;
