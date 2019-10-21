/**
 * @description
 * layout
 *
 * @class DefaultLayout
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import DefaultLayout from '&/@chttl/topology/src/topology/layout/DefaultLayout';
 *
 * class TestLayout extends DefaultLayout {
 *  //override functions
 *  initNodePosition(existedPositions, node) {
 *    returnthis.getAvailablePosition(existedPositions, { x: 100, y: 100 }, { direction: 'hRight' });
 *  }
 * }
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  // override ayout
 *  layout(props) {
 *    return new TestLayout({ ...props, util: this.state.util, spec: this.state.spec, project: this });
 *  }
 * }
 *
 *
 */

import d3TopoUtil from '../util/d3TopoUtil';
import get from 'lodash/get';
import set from 'lodash/set';
import invoke from 'lodash/invoke';
import { event as d3Event } from 'd3-selection';
const d3 = Object.assign({}, require('d3-selection'), require('d3-drag'), require('d3-zoom'));
export default class DefaultLayout {
  props;
  state;
  constructor(props) {
    console.log('layout constructing...');
    this.props = props || {};
    // default value
    this.defaultProps(props);
    const { maxZoomScale, minZoomScale } = this.props;
    // init state
    this.state = {
      zoomScale: 1, // zoomer's scale
      maxZoomScale,
      minZoomScale,
      scale: 1 // main-group's scale
    };
    this.init();
  }
  defaultProps(props) {
    const setting = (key, defaultValue) => {
      set(this.props, key, props[key] || defaultValue);
    };
    setting('overlapGap', 75);
    setting('maxZoomScale', 5);
    setting('minZoomScale', 0.5);
    setting('layoutParams', {});
  }
  init() {
    console.log('layout initiating...');
    const state = this.state;
    state._layout = {};
  }
  getScale() {
    return this.state.scale;
  }
  getZoomScale() {
    return this.state.zoomScale;
  }
  nodes(nodes) {
    if (nodes) {
      const { _layout } = this.state;
      invoke(_layout, 'nodes', nodes);
      return nodes;
    }
  }
  links(links) {
    if (links) {
      const { _layout } = this.state;
      invoke(_layout, 'links', links);
      return links;
    }
  }
  restart(...args) {
    const { _layout } = this.state;
    invoke(_layout, 'restart', ...args);
    return this;
  }
  start(...args) {
    const { _layout } = this.state;
    invoke(_layout, 'start', ...args);
    return this;
  }
  stop(...args) {
    const { _layout } = this.state;
    invoke(_layout, 'stop', ...args);
    return this;
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
  dragStart() {}
  dragging() {}
  dragEnd() {
    const { minimap } = this.state;
    invoke(minimap, 'refresh');
  }
  size(...args) {
    const { _layout } = this.state;
    invoke(_layout, 'size', ...args);
    return this;
  }
  tick(...args) {
    const { _layout } = this.state;
    invoke(_layout, 'tick', ...args);
    return this;
  }
  ticked() {
    const { util, project } = this.props;
    const { scale } = this.state;
    const { mainGroup } = project.state;
    mainGroup.selectAll('path.link').attr('d', data => {
      return util.getLinkPathPosition({ data, lineType: get(data, 'lineType', 'linear') });
    });
    mainGroup.selectAll('g.node').attr('transform', function(d) {
      return `translate(${d.x}, ${d.y}) scale(${scale})`;
    });
  }
  initZoom(canvas, zoomDoms, minimap, size) {
    const state = this.state;
    // setting state
    state.canvas = canvas;
    state.zoomDoms = zoomDoms;
    state.minimap = minimap;
    const zoom = (state.zoom = d3
      .zoom()
      .scaleExtent([state.minZoomScale, state.maxZoomScale]) // scale minimum and maximum
      // .translateExtent([[0, 0], size]) //pan area
      .extent([[0, 0], size])
      .on('start', () => {
        this.zoomStart();
        canvas.style('cursor', 'move');
      })
      .on('zoom', () => {
        this.zooming();
      })
      .on('end', () => {
        this.zoomEnd();
        canvas.style('cursor', null);
      }));
    return zoom;
  }
  zoomStart() {}
  zooming() {
    const { canvas, zoomDoms, minimap } = this.state;
    // let { x, y, k } = d3Event.transform;
    // const pointer = d3.mouse(canvas.node());
    // update dom
    zoomDoms.forEach(dom => {
      // dom.attr('transform', `translate(${x},${y}) scale(${k})`);
      dom.attr('transform', d3Event.transform);
      invoke(minimap, 'update', d3Event.transform);
      this.updateZoomExtents(canvas);
    });
  }
  zoomEnd() {
    // update scale
    this.state.zoomScale = d3Event.transform.k;
  }
  specialZoom(dom) {
    dom.on('dblclick.zoom', null);
    // on('mousewheel.zoom', () => {});
  }
  updateZoom(zoomTransform) {
    const { canvas, zoom, zoomDoms } = this.state;
    zoomDoms.forEach(zoomDom => {
      zoom.transform(zoomDom, zoomTransform);
    });
    this.updateZoomExtents(canvas);
    // update scale
    this.state.zoomScale = zoomTransform.k;
  }
  changeCanvasZoom(zoomTransform, duration) {
    const { canvas, zoom, minimap } = this.state;
    duration = duration !== undefined ? duration : 0;
    canvas
      .transition()
      .duration(duration)
      .call(zoom.transform, zoomTransform)
      .on('end', () => {
        this.updateZoom(zoomTransform);
        invoke(minimap, 'update', zoomTransform);
        this.updateZoomExtents(canvas);
      });
    // update scale
    this.state.zoomScale = zoomTransform.k;
  }
  changeZoomScale(newScale, duration) {
    const { util } = this.props;
    const { canvas } = this.state;
    const translate = util.getTranslateFromTransform(canvas.attr('transform'));
    const zoomTransform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(newScale);
    this.changeCanvasZoom(zoomTransform, duration);
  }
  deltaZoomScale(delta, duration) {
    const { zoomScale } = this.state;
    this.changeZoomScale(zoomScale + delta, duration);
  }
  // updates the zoom boundaries based on the current size and scale
  updateZoomExtents(dom) {
    if (dom) {
      const { identifier, util } = this.props;
      const { zoom } = this.state;
      const scale = util.getScaleFromTransform(dom.attr('transform'));
      const svg = d3.select(`svg#${identifier}`);
      const background = dom.select('.background');
      const targetWidth = Number(svg.attr('width')) || 0;
      const targetHeight = Number(svg.attr('height')) || 0;
      const viewportWidth = Number(background.attr('width')) || 0;
      const viewportHeight = Number(background.attr('height')) || 0;
      zoom.translateExtent([[-viewportWidth / scale, -viewportHeight / scale], [viewportWidth / scale + targetWidth, viewportHeight / scale + targetHeight]]);
    }
  }
  translate(transform) {
    // use dom.attr('transform') get transform str
    if (transform.indexOf('translate(') !== -1) {
      return transform
        .substring(transform.indexOf('translate(') + 10, transform.indexOf(')'))
        .split(',')
        .map(v => parseFloat(v));
    }
  }
  distance(x1, y1, x2, y2) {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  getPositionByCheckingOverlap(nodeId, x, y, xKey, yKey, restVertexSet, hInterval, isRelativePosition) {
    if (x !== undefined && y !== undefined && restVertexSet) {
      const me = this;
      const overlapDistance = 50;
      let overlap = true;
      const maximumLoop = 10000;
      let maximumLoopCounter = 0;
      const size = restVertexSet.length;
      if (!hInterval) {
        hInterval = this.props.overlapGap;
      }
      while (overlap) {
        overlap = false;
        for (let i = 0; i < size; i++) {
          const tempNode = restVertexSet[i];
          const basedX = isRelativePosition ? tempNode.topologyCenterX || 0 : 0;
          const basedY = isRelativePosition ? tempNode.topologyCenterY || 0 : 0;
          if (
            (tempNode.visible === null || tempNode.visible === undefined || tempNode.visible === true) &&
            nodeId !== tempNode.id &&
            tempNode[xKey] !== undefined &&
            tempNode[yKey] !== undefined &&
            me.distance(tempNode[xKey] - basedX, tempNode[yKey] - basedY, x, y) <= overlapDistance
          ) {
            overlap = true;
            x += hInterval;
            break;
          }
        }
        maximumLoopCounter++;
        if (maximumLoopCounter >= maximumLoop) {
          overlap = true;
        }
      }

      // if (baseX === vertex.x && baseY === vertex.y) {     vertex.y = tempVInterval;
      //     vertex.x = tempHInterval;     tempHInterval += hInterval;
      // tempVInterval += vInterval; }

      return { x: x, y: y };
    }
  }
  separateNodeXPosition(array, basedWidth, interval, override) {
    if (array.length % 2 === 0) {
      const middleN = array.length / 2 - 1;
      array.forEach(function(node, index) {
        if (override || node.x === undefined) {
          node.x = basedWidth - interval * (middleN - index) - interval / 2;
        }
      });
    } else {
      const middleN = Math.floor(array.length / 2);
      array.forEach(function(node, index) {
        if (override || node.x === undefined) {
          node.x = basedWidth - interval * (middleN - index);
        }
      });
    }
  }
  separateNodeYPosition(array, basedHeight, interval, override) {
    array.forEach(function(node) {
      if (override || node.y === undefined) {
        node.y = basedHeight + interval;
      }
    });
  }
  avoidRectGroupOverlap() {
    const { project } = this.props;
    const { mainGroup } = project.state;
    let move = 1;
    while (move > 0) {
      move = 0;
      mainGroup.selectAll('rect.group').each(function(d) {
        // eslint-disable-next-line no-invalid-this
        const that = this;
        let a;
        const thatDom = d3.select(that);
        // console.log(d3.select(that).style('visibility'));
        if (thatDom.style('visibility') !== 'hidden') {
          a = that.getBoundingClientRect();
          mainGroup.selectAll('rect.group').each(function() {
            // eslint-disable-next-line no-invalid-this
            const me = this;
            if (me != that) {
              const thisDom = d3.select(me);
              const b = me.getBoundingClientRect();
              if (thisDom.style('visibility') !== 'hidden') {
                const overlap = Math.abs(a.left - b.left) * 2 < a.width + b.width && Math.abs(a.top - b.top) * 2 < a.height + b.height;
                if (overlap) {
                  // determine amount of movement, move labels
                  const dx = (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) * 0.01;
                  const dy = (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) * 0.02;
                  // tt = d3TopoUtil.getParsedSvgTransform(thisDom.attr('transform')),
                  // to = d3TopoUtil.getParsedSvgTransform(thatDom.attr('transform'));
                  // const toTranslate = [to.translate.tx + dx, to.translate.ty + dy];
                  // const ttTranslate = [tt.translate.tx - dx, tt.translate.ty - dy];

                  thatDom.attr('x', thatDom.attr('x') + dx);
                  thatDom.attr('y', thatDom.attr('y') + dy);

                  thisDom.attr('x', thisDom.attr('x') - dx);
                  thisDom.attr('y', thisDom.attr('y') - dy);
                  // d.fixed = true;
                  a = me.getBoundingClientRect();
                }
              }
            }
          });
        }
      });
    }
  }
  avoidNodeOverlap2() {
    const { project } = this.props;
    const { mainGroup } = project.state;
    let move = 1;
    while (move > 0) {
      move = 0;
      mainGroup.selectAll('g.node').each(function(d) {
        // eslint-disable-next-line no-invalid-this
        const that = this;
        let a;
        const thatDom = d3.select(that);
        // console.log(d3.select(that).style('visibility'));
        if (thatDom.style('visibility') !== 'hidden') {
          a = that.getBoundingClientRect();
          mainGroup.selectAll('g.node').each(function() {
            // eslint-disable-next-line no-invalid-this
            const me = this;
            if (me != that) {
              const thisDom = d3.select(me);
              const b = me.getBoundingClientRect();
              if (thisDom.style('visibility') !== 'hidden') {
                const overlap = Math.abs(a.left - b.left) * 2 < a.width + b.width && Math.abs(a.top - b.top) * 2 < a.height + b.height;
                if (overlap) {
                  // determine amount of movement, move labels
                  const dx = (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) * 0.01;
                  const dy = (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) * 0.02;
                  // tt = d3TopoUtil.getParsedSvgTransform(thisDom.attr('transform')),
                  const to = d3TopoUtil.getParsedSvgTransform(thatDom.attr('transform'));
                  const toTranslate = [to.translate.tx + dx, to.translate.ty + dy];
                  // const ttTranslate = [tt.translate.tx - dx, tt.translate.ty - dy];
                  // thisDom.attr("transform", "translate(" + tt.translate + ")");
                  thatDom.attr('transform', `translate(${toTranslate[0]},${toTranslate[1]})`);
                  // d.fixed = true;
                  a = me.getBoundingClientRect();
                }
              }
            }
          });
        }
      });
    }
  }
  avoidNodeOverlap() {
    const { project } = this.props;
    const { mainGroup } = project.state;
    let move = 1;
    while (move > 0) {
      move = 0;
      mainGroup.selectAll('g.node').each(function() {
        // eslint-disable-next-line no-invalid-this
        const that = this;
        let a = that.getBoundingClientRect();
        mainGroup.selectAll('g.node').each(function() {
          // eslint-disable-next-line no-invalid-this
          const me = this;
          if (me !== that) {
            const b = me.getBoundingClientRect();
            if (Math.abs(a.left - b.left) * 2 < a.width + b.width && Math.abs(a.top - b.top) * 2 < a.height + b.height) {
              // overlap, move labels
              const dx = (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) * 0.01;
              const dy = (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) * 0.02;
              const tt = d3.transform(d3.select(me).attr('transform'));
              const to = d3.transform(d3.select(that).attr('transform'));
              move += Math.abs(dx) + Math.abs(dy);

              to.translate = [to.translate[0] + dx, to.translate[1] + dy];
              tt.translate = [tt.translate[0] - dx, tt.translate[1] - dy];
              d3.select(me).attr('transform', 'translate(' + tt.translate + ')');
              d3.select(that).attr('transform', 'translate(' + to.translate + ')');
              a = me.getBoundingClientRect();
            }
          }
        });
      });
    }
  }
  getAvailablePosition(existedPositions, assignedPosition, { direction, movement = 100 }) {
    const temp = assignedPosition;
    if (existedPositions && assignedPosition && direction) {
      while (existedPositions.findIndex(p => p && p.x === temp.x && p.y === temp.y) !== -1) {
        switch (direction) {
          case 'hRight':
            temp.x = temp.x + movement;
            break;
          case 'hLeft':
            temp.x = temp.x - movement;
            break;
          case 'vTop':
            temp.y = temp.y - movement;
            break;
          case 'vBottom':
            temp.y = temp.y + movement;
            break;
          default:
        }
      }
    }
    return { x: get(temp, 'x'), y: get(temp, 'y') };
  }
  skipPointerDownEvent(nativeEvent) {
    // 當點擊的對象是toolbar的按鈕時，不視為是選取節點或線的動作
    const eventDomPath = get(nativeEvent, 'path', []);
    const isToolbarEvent =
      eventDomPath.findIndex(dom => {
        let isExist = false;
        const classList = get(dom, 'classList'); // DOMTokenList
        if (classList) {
          const listLength = classList.length;
          for (let i = 0; i < listLength; i++) {
            const item = classList.item(i);
            if (item.indexOf('tool') !== -1) {
              isExist = true;
              break;
            }
          }
        }
        return isExist;
      }) !== -1;
    return nativeEvent && isToolbarEvent;
  }
}
