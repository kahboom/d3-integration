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
 *    return this.getAvailablePosition(existedPositions, { x: 100, y: 100 }, { direction: 'hRight' });
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

  dragStart() {
    //console.log('Drag start');
  }

  dragging() {
    //console.log('Dragging..');
  }

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

  initZoom(canvas, zoomDoms, minimap, size) {
    const state = this.state;
    // setting state
    state.canvas = canvas;
    state.zoomDoms = zoomDoms;
    state.minimap = minimap;

    return (state.zoom = d3
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

  /**
   * Calculate available positions based on existing nodes.
   * @param existedPositions
   * @param assignedPosition
   * @param direction
   * @param movement
   * @return {{x: *, y: *}}
   */
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
