/**
 * 資料格式
 * data: {
 *  id, from, to, status, zIndex, name, lineIndex, type: 'multiTwoWayLine'
 *  sourceFlow, targetFlow,
 *  sourceLabel, targetLabel
 * }
 */
import TwoWayLine from './TwoWayLine';
import Vector from '../../util/Vector';
import get from 'lodash/get';
export default class MultiTwoWayLine extends TwoWayLine {
  multiTwoWayLineInfo = {};
  dataPreprocessing(nodes, links) {
    const { multiTwoWayLineInfo } = this;
    if (links) {
      // clear
      Object.keys(multiTwoWayLineInfo).forEach(k => delete multiTwoWayLineInfo[k]);
      links.forEach(link => {
        if (link.type === 'multiTwoWayLine') {
          const key = `${link.from}_${link.to}`;
          const info = (multiTwoWayLineInfo[key] = multiTwoWayLineInfo[key] || { lineNumber: 0 });
          info.lineNumber += 1;
        }
      });
    }
  }
  genPath(lineType, lineWay, source, target, edgeData, arrowLength) {
    if (edgeData.lineType === 'diagonal') {
      const s2T = target.clone().subtract(source);
      const length = s2T.length();
      const controlPoint = s2T
        .clone()
        .norm()
        .multiply(new Vector(length - arrowLength, length - arrowLength))
        .add(source);
      const temp = [2, 2];
      return (
        'M' +
        source.x +
        ',' +
        source.y +
        'C' +
        (source.x + controlPoint.x) / temp[0] +
        ',' +
        source.y +
        ' ' +
        (source.x + controlPoint.x) / temp[1] +
        ',' +
        controlPoint.y +
        ' ' +
        controlPoint.x +
        ',' +
        controlPoint.y
      );
    } else if (edgeData.lineType === 'arc') {
      if (lineWay !== 'middle') {
        const s2T = target.clone().subtract(source);
        const length = s2T.length();
        const controlPoint = s2T
          .clone()
          .norm()
          .multiply(new Vector(length - arrowLength, length - arrowLength))
          .add(source);
        const sweepFlag = lineWay === 'left' ? 1 : 0;
        return 'M' + source.x + ',' + source.y + ` A${500} ${500}, 0 0 ${sweepFlag} ` + controlPoint.x + ',' + controlPoint.y;
      } else {
        return super.genPath(lineType, lineWay, source, target, edgeData, arrowLength);
      }
    } else {
      return super.genPath(lineType, lineWay, source, target, edgeData, arrowLength);
    }
  }
  // genArrow(source, target, arrowLength, arrowWidth) {
  //   const s2T = target.clone().subtract(source);

  //   //Arrow at the target end
  //   //const arrowLengthScalar = new Vector(-arrowLength, -arrowLength);
  //   const arrowLeftScalar = new Vector(arrowWidth / 2, arrowWidth / 2);
  //   const arrowRightScalar = new Vector(-arrowWidth / 2, -arrowWidth / 2);

  //   const length = s2T.length();
  //   const controlPoint = s2T
  //     .clone()
  //     .norm()
  //     .multiply(new Vector(length - arrowLength, length - arrowLength))
  //     .add(source);

  //   const arrowLengthOffset = s2T
  //     .clone()
  //     .norm()
  //     .multiply(new Vector(arrowLength, arrowLength));
  //   const arrowWidthOffset = new Vector(-s2T.y, s2T.x).norm();

  //   const arrowHead = arrowLengthOffset.clone().add(controlPoint);
  //   const arrowBaseLeft = arrowWidthOffset
  //     .clone()
  //     .multiply(arrowLeftScalar)
  //     .add(controlPoint);
  //   const arrowBaseRight = arrowWidthOffset
  //     .clone()
  //     .multiply(arrowRightScalar)
  //     .add(controlPoint);

  //   let arrow = 'M' + arrowHead.x + ',' + arrowHead.y + ' L' + arrowBaseLeft.x + ',' +
  //    arrowBaseLeft.y + 'L' + arrowBaseRight.x + ',' + arrowBaseRight.y;
  //   return arrow;
  // }
  getControlPoint(source, target, data) {
    let controlPoint;
    const { multiTwoWayLineInfo } = this;
    const key = `${data.from}_${data.to}`;
    const lineNum = get(multiTwoWayLineInfo[key], 'lineNumber', 1);
    const lineIndex = data.lineIndex || 0;
    const midPoint = new Vector((target.x + source.x) / 2, (target.y + source.y) / 2);
    const midIndex = (lineNum + 1) / 2 - 1;
    const scalar = Math.abs(lineIndex - midIndex) * 50;
    const leftScalar = new Vector(scalar, scalar);
    const rightScalar = new Vector(-scalar, -scalar);
    let lineWay = 'middle';
    if (lineNum > 1) {
      // source 2 target
      const s2T = target.clone().subtract(source);
      const offset = new Vector(-s2T.y, s2T.x).norm();
      if (lineNum % 2 === 0) {
        // even
        if (lineIndex <= midIndex) {
          // left
          lineWay = 'left';
          controlPoint = offset
            .clone()
            .multiply(leftScalar)
            .add(midPoint);
        } else {
          // right
          lineWay = 'right';
          controlPoint = offset
            .clone()
            .multiply(rightScalar)
            .add(midPoint);
        }
      } else {
        // odd
        if (lineIndex === midIndex) {
          controlPoint = midPoint;
        } else {
          if (lineIndex < midIndex) {
            // left
            lineWay = 'left';
            controlPoint = offset
              .clone()
              .multiply(leftScalar)
              .add(midPoint);
          } else {
            // right
            lineWay = 'right';
            controlPoint = offset
              .clone()
              .multiply(rightScalar)
              .add(midPoint);
          }
        }
      }
    } else {
      controlPoint = midPoint;
    }

    if (controlPoint) {
      controlPoint.lineWay = lineWay;
    }

    return controlPoint;
  }
}
