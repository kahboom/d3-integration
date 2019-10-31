/**
 * data: {
 *  id, from, to, status, zIndex, name,
 *  sourceFlow, targetFlow,
 *  sourceLabel, targetLabel
 * }
 */
import Vector from 'victor';
import Shape2D from './Shape2D';
import get from 'lodash/get';
export default class TwoWayLine extends Shape2D {
  create(dom, data) {
    this.appendLine(dom, data);
  }
  update(dom, data) {
    this.updateLine(dom, data);
  }

  appendLine(gDom, data) {
    const { enableEdgeActions } = this.props;
    const { shapeGenerator } = this.state;
    // dataStyle = {},
    // topoSpec = me.topoSpec,
    let visible = false;
    // dataStyle = topoSpec.findDataStyle(data, 'line');
    if (get(data, 'source.visible') !== false && get(data, 'target.visible') !== false) {
      visible = true;
    }
    const sourceColor = this.getLineColor({ value: data.sourceFlow });
    const targetColor = this.getLineColor({ value: data.targetFlow });
    const sourceWidth = this.getLineWidth(data.sourceFlow);
    const targetWidth = this.getLineWidth(data.targetFlow);

    // add gDom properties
    gDom.classed('twoWayLine', true);

    const gS2TDom = gDom.append('g').attr('class', 's2TLink');
    const gT2SDom = gDom.append('g').attr('class', 't2SLink');

    // add sourceToTarget
    shapeGenerator.newPath(gS2TDom, {
      attributes: {
        class: 's2TLine',
        id: function(d) {
          return 'linkId_' + d.id;
        },
        visibility: visible ? 'visible' : 'hidden',
        stroke: sourceColor,
        cursor: enableEdgeActions ? 'pointer' : 'default',
        'stroke-dasharray': null
      },
      styles: {
        'stroke-width': sourceWidth,
        'fill-opacity': 0
      }
    });

    // add targetToSource
    shapeGenerator.newPath(gT2SDom, {
      attributes: {
        class: 't2SLine',
        id: function(d) {
          return 'rlinkId_' + d.id;
        },
        visibility: visible ? 'visible' : 'hidden',
        stroke: targetColor,
        cursor: enableEdgeActions ? 'pointer' : 'default'
      },
      styles: {
        'stroke-width': targetWidth,
        'fill-opacity': 0
      }
    });

    // add sourceToTarget arrow
    shapeGenerator.newPath(gS2TDom, {
      attributes: {
        class: 's2TArrow'
      },
      styles: {
        'stroke-width': 0,
        fill: sourceColor
      }
    });

    // add targetToSource arrow
    shapeGenerator.newPath(gT2SDom, {
      attributes: {
        class: 't2SArrow'
      },
      styles: {
        'stroke-width': 0,
        fill: targetColor
      }
    });
    // add link label
    this.appendTextLabel(gDom, data.sourceLabel, 's2T', data); // source to target
    this.appendTextLabel(gDom, data.targetLabel, 't2S', data); // target to source

    // init position
    this.refreshPathPosition(gDom, data);
  }

  refreshPathPosition(gDom, data) {
    const bias = { source: { x: 0, y: 0 }, target: { x: 0, y: 0 } };
    const s2TLabelDom = gDom.select('g.s2TlabelG');
    const t2SLabelDom = gDom.select('g.t2SlabelG');
    const arrowInfo = {
      sourceLength: this.getLineArrowLength(data.sourceFlow),
      sourceWidth: this.getLineArrowWidth(data.sourceFlow),
      targetLength: this.getLineArrowLength(data.targetFlow),
      targetWidth: this.getLineArrowWidth(data.targetFlow)
    };
    const s2TLine = this.getPathPosition({ data: data, lineType: 'sourceToTargetLine', bias, labelDom: s2TLabelDom, arrowInfo });
    const t2SLine = this.getPathPosition({ data: data, lineType: 'targetToSourceLine', bias, labelDom: t2SLabelDom, arrowInfo });
    const s2TArrow = this.getPathPosition({ data: data, lineType: 'sourceToTargetArrow', bias, arrowInfo });
    const t2SArrow = this.getPathPosition({ data: data, lineType: 'targetToSourceArrow', bias, arrowInfo });
    gDom.select('path.s2TLine').attr('d', s2TLine);
    gDom.select('path.t2SLine').attr('d', t2SLine);
    gDom.select('path.s2TArrow').attr('d', s2TArrow);
    gDom.select('path.t2SArrow').attr('d', t2SArrow);
  }

  getPathPosition({ data, lineType, bias, labelDom, arrowInfo }) {
    let result;
    const source = new Vector(data.source.x + bias.source.x, data.source.y + bias.source.y);
    const target = new Vector(data.target.x + bias.target.x, data.target.y + bias.target.y);
    const controlPoint = this.getControlPoint(source, target, data);
    switch (lineType) {
      case 'sourceToTargetArrow':
      default:
        result = this.genArrow(source, controlPoint, arrowInfo.sourceLength, arrowInfo.sourceWidth);
        break;
      case 'targetToSourceArrow':
        result = this.genArrow(target, controlPoint, arrowInfo.targetLength, arrowInfo.targetWidth);
        break;
      case 'sourceToTargetLine':
        if (source) {
          const offsetPoint = source
            .clone()
            .subtract(controlPoint)
            .norm()
            .multiply(new Vector(8, 8))
            .add(controlPoint);
          this.updateLabel(labelDom, source, controlPoint, data);
          result = this.genPath(lineType, controlPoint.lineWay, offsetPoint, source, data, arrowInfo.sourceLength);
        }
        break;
      case 'targetToSourceLine':
        if (target) {
          const offsetTarget = controlPoint
            .clone()
            .subtract(target)
            .norm()
            .multiply(new Vector(5, 5))
            .add(controlPoint);
          this.updateLabel(labelDom, target, controlPoint, data);
          result = this.genPath(lineType, controlPoint.lineWay, target, offsetTarget, data, arrowInfo.targetLength);
        }
        break;
    }
    return result;
  }

  getControlPoint(source, target) {
    const controlPoint = new Vector((target.x + source.x) / 2, (target.y + source.y) / 2);
    controlPoint.lineWay = 'middle';
    return controlPoint;
  }

  genPath(lineType, lineWay, source, target, edgeData, arrowLength) {
    const s2T = target.clone().subtract(source);
    const length = s2T.length();
    const controlPoint = s2T
      .clone()
      .norm()
      .multiply(new Vector(length - arrowLength, length - arrowLength))
      .add(source);
    const path = 'M' + source.x + ',' + source.y + ' L ' + controlPoint.x + ' ' + controlPoint.y;
    return path;
  }

  genArrow(source, target, arrowLength, arrowWidth) {
    const s2T = target.clone().subtract(source);

    // Arrow at the target end
    // const arrowLengthScalar = new Vector(-arrowLength, -arrowLength);
    const arrowLeftScalar = new Vector(arrowWidth / 2, arrowWidth / 2);
    const arrowRightScalar = new Vector(-arrowWidth / 2, -arrowWidth / 2);

    const length = s2T.length();
    const controlPoint = s2T
      .clone()
      .norm()
      .multiply(new Vector(length - arrowLength, length - arrowLength))
      .add(source);

    const arrowLengthOffset = s2T
      .clone()
      .norm()
      .multiply(new Vector(arrowLength, arrowLength));
    const arrowWidthOffset = new Vector(-s2T.y, s2T.x).norm();

    const arrowHead = arrowLengthOffset.clone().add(controlPoint);
    const arrowBaseLeft = arrowWidthOffset
      .clone()
      .multiply(arrowLeftScalar)
      .add(controlPoint);
    const arrowBaseRight = arrowWidthOffset
      .clone()
      .multiply(arrowRightScalar)
      .add(controlPoint);

    let arrow = 'M' + arrowHead.x + ',' + arrowHead.y + ' ';
    arrow += 'L' + arrowBaseLeft.x + ',' + arrowBaseLeft.y;
    arrow += 'L' + arrowBaseRight.x + ',' + arrowBaseRight.y;

    return arrow;
  }

  getControlPointForTest(point1, point2) {
    const w = Math.abs(point1.x - point2.x);
    const h = Math.abs(point1.y - point2.y);
    const control1 = new Vector(point2.x + w * 0.5523, point2.y);
    const control2 = new Vector(point1.x, point1.y + h * 0.5523);
    return { control1, control2 };
  }

  getBeizerMidPointByHeight(point1, point2, height, clockwise) {
    const getAngleWithPoint1 = (point1, point2) => {
      return Math.atan2(point2.y - point1.y, point2.x - point1.x);
    };

    const getMidPointWithPoint1 = (point1, point2) => {
      return new Vector((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
    };

    const angle = getAngleWithPoint1(point1, point2);
    const direction = clockwise ? 1 : -1;
    const perpendicularAngle = angle + direction * (Math.PI / 2);
    const midPoint = getMidPointWithPoint1(point1, point2);
    return new Vector(midPoint.x + Math.cos(perpendicularAngle) * height, midPoint.y + Math.sin(perpendicularAngle) * height);
  }

  updateLabel(labelDom, source, target) {
    const offset =
      target
        .clone()
        .subtract(source)
        .length() * 0.7;
    const point = target
      .clone()
      .subtract(source)
      .norm()
      .multiply(new Vector(offset, offset))
      .add(source);
    const width = labelDom.select('rect').attr('width');
    const leftOffset = width / 2;
    const x = point.x - leftOffset;
    labelDom.attr('transform', 'translate(' + x + ',' + point.y + ')');
  }

  updatePortLabel(labelDom, source, target) {
    if (!labelDom.select('rect').empty()) {
      const offset =
        target
          .clone()
          .subtract(source)
          .length() * 0.4;
      const point = target
        .clone()
        .subtract(source)
        .norm()
        .multiply(new Vector(offset, offset))
        .add(source);
      const width = labelDom.select('rect').attr('width');
      const leftOffset = width / 2;
      const x = point.x - leftOffset;
      labelDom.attr('transform', 'translate(' + x + ',' + point.y + ')');
    }
  }

  appendTextLabel(gDom, text, direction) {
    const { nodeLabelSize, nodeLabelWeight } = this.props;
    const { shapeGenerator } = this.state;
    const gClass = `${direction}labelG glabel`;
    const labelGdom = gDom.append('g');
    labelGdom.attr('class', gClass);
    const textAttr = {
      attributes: {
        class: 'line-label',
        dy: '0.35em',
        x: 1.55,
        y: 10
      },
      styles: {
        fill: '#555',
        'font-size': nodeLabelSize,
        'font-weight': nodeLabelWeight
      },
      text: text === '---' ? 'NaN' : text // parseFloat(text).toFixed(2)// + '%'
    };
    const rectAttr = {
      attributes: {
        class: direction + 'Rect',
        stroke: '#000',
        'stroke-width': '1px',
        fill: '#FFF',
        height: 20
      }
    };
    shapeGenerator.newRect(labelGdom, rectAttr);
    shapeGenerator.newText(labelGdom, textAttr);

    // caculate rect width
    labelGdom.selectAll('rect').attr('width', function() {
      // eslint-disable-next-line no-invalid-this
      return this.parentNode.getBBox().width + 2;
    });
    return labelGdom;
  }

  updateLine(gDom, data) {
    const { shapeGenerator } = this.state;
    let visible = false;
    if (get(data, 'source.visible') !== false && get(data, 'target.visible') !== false) {
      visible = true;
    }
    // update link
    const sourceColor = this.getLineColor({ value: data.sourceFlow });
    const targetColor = this.getLineColor({ value: data.targetFlow });
    shapeGenerator.path(gDom.select('path.s2TLine'), { attributes: { visibility: visible ? 'visible' : 'hidden', stroke: sourceColor } });
    shapeGenerator.path(gDom.select('path.t2SLine'), { attributes: { visibility: visible ? 'visible' : 'hidden', stroke: targetColor } });
    // update label
    shapeGenerator.settingText(gDom.select('g.s2TlabelG > text.line-label'), data.sourceLabel === '---' ? 'NaN' : data.sourceLabel);
    shapeGenerator.settingText(gDom.select('g.t2SlabelG > text.line-label'), data.targetLabel === '---' ? 'NaN' : data.targetLabel);
  }
  getDefaultColorInfo(unit) {
    return {
      gray: { code: '#cccccc', label: 'None' },
      blue: { code: '#1938ff', label: `${unit}` }
    };
  }
  getLineColor({ value }) {
    const { getLineColor: getColor, colorInfo } = this.props;
    if (getColor) {
      return getColor({ colorInfo, value });
    } else {
      get(colorInfo || this.getDefaultColorInfo, 'gray.code');
    }
  }
  getLineWidth(value) {
    const { getLineWidth: getWidth } = this.props;
    return getWidth ? getWidth(value) : 3;
  }
  getLineArrowLength(value) {
    const { getLineArrowLength: getArrowLength } = this.props;
    return getArrowLength ? getArrowLength(value) : 11;
  }
  getLineArrowWidth(value) {
    const { getLineArrowWidth: geArrowWidth } = this.props;
    return geArrowWidth ? geArrowWidth(value) : 15.5;
  }
}
