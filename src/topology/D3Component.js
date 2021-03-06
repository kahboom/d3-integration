/**
 * @description
 * D3 SVG DOM，Topology.react.js dispatch
 * Primarily used for initialization (e.g. Selector, SVG, project, layout).
 *
 * @class D3Component
 * @param {object} props - ex. {identifier, projectName, data, width, height, projectPath...}.
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>
 * import D3Component from '&/@chttl/topology/src/topology/D3Component';
 *
 * //projectName，Tree/Force/NetworkTemplate1
 *
 * const vis = new D3Component(refElement.current, { identifier: 'canvas_id', projectName, data, width, height }));
 * //update
 * vis.update(props);
 * //quit
 * vis.quit();
 *
 */
import Selector from './util/Selector';
import Minimap from './util/Minimap';
import get from 'lodash/get';
import set from 'lodash/set';
import invoke from 'lodash/invoke';
import assign from 'lodash/assign';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';

const d3 = Object.assign({}, require('d3-selection'), require('d3-zoom'));

export default class D3Component {
  props;
  state;

  constructor(containerEl, props) {
    this.props = props || {};
    this.defaultProps(props);

    this.state = {
      defaultNodeZIndex: 7,
      defaultLinkZIndex: 5,
      defaultGroupZIndex: 3
    };
    this.init(containerEl);
  }

  defaultProps(props) {
    const setting = (key, defaultValue) => {
      set(this.props, key, props[key] || defaultValue);
    };
    setting('projectPath', './project');
    setting('mainGroupStyleClass', 'svg-main-group');
    setting('backgroundColor', '#eee');
    setting('initZoomScale', 1);
    setting('initNodeAdditionalDistance', 0);
    setting('enableCanvasSelectEvent', true);
    setting('enableGroup', true);
    setting('enableNodeLabel', true);
    setting('enableGroupLabel', true);
    setting('enableToolTip', false);
    setting('enableLinkLabel', true);
    setting('enableLineArrow', true);
    setting('enableMinimap', true);
    setting('minimapScale', 0.2);
  }

  init(containerEl) {
    const {
      identifier,
      projectPath,
      projectName,
      projectClass,
      mainGroupStyleClass,
      enableViewbox,
      width,
      height,
      backgroundColor,
      initZoomScale,
      enableCanvasSelectEvent,
      enableMinimap,
      minimapScale
    } = this.props;

    const state = this.state;
    const initPosition = [width / 2, height / 2];

    /**
     * Initiate project & layout
     */
    const project = (state.project = this.initProject(projectPath, projectName, projectClass));
    const { layout } = project.state;

    /**
     * Initiate selector
     * @type {Selector}
     */
    const selector = (state.selector = new Selector({ ...this.props, layout }));

    /**
     * Initiate SVG
     * @type {Selection<BaseType, unknown, HTMLElement, any>}
     */
    const svg = (state.svg = d3.select(containerEl).append('svg'));

    /**
     * Canvas selected/unselected
     */
    if (enableCanvasSelectEvent) {
      selector.bindEvent('canvas', svg, {
        selected: () => {
          console.log('canvas was selected...');
        },
        unselected: () => {
          console.log('canvas was unselected...');
        }
      });
    }

    /**
     * SVG size
     */
    const svgWidth = width;
    const svgHeight = height;

    /**
     * Viewbox & viewport adjustment
     */
    if (enableViewbox) {
      // viewbox
      const viewBox = [0, 0, width, height].join(' ');
      svg.attr('viewBox', viewBox).attr('preserveAspectRatio', 'xMinYMin meet');
    } else {
      // viewport
      svg.attr('width', svgWidth).attr('height', svgHeight);
    }

    /**
     * SVG ID
     */
    svg.attr('id', identifier);

    const outerWrapper = svg
      .append('g')
      .attr('class', 'wrapper outer')
      .attr('transform', 'translate(0, 0)');

    /**
     * Initiate background
     * @type {string | this}
     */
    state.background = outerWrapper
      .append('rect')
      .attr('class', 'background')
      .attr('fill', backgroundColor)
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', width)
      .attr('height', height);

    /**
     * Initiate zoomer
     * It's important to translate position into initPosition for node-link locations.
     * @type {Selection<BaseType>}
     */
    const innerWrapper = svg
      .append('g')
      .attr('class', 'wrapper inner zoomer')
      .style('transform-origin', '0 0')
      // init zoomer position
      .attr('transform', `translate(${initPosition[0]},${initPosition[1]}) scale(${layout.getZoomScale()})`);

    /**
     * Initiate inner wrapper background
     */
    innerWrapper
      .append('rect')
      .attr('class', 'background')
      .attr('fill', '#fff')
      .attr('opacity', 0)
      .attr('x', -initPosition[0])
      .attr('y', -initPosition[1])
      .attr('width', width)
      .attr('height', height);

    /**
     * Initiate main group
     * @type {Selection<BaseType>}
     */
    const mainGroup = innerWrapper
      .append('g')
      .classed(mainGroupStyleClass, true)
      .style('transform-origin', '0 0')
      .attr('transform', `translate(0,0) scale(${layout.getScale()})`);

    /**
     * Initiate main group background
     */
    mainGroup
      .append('rect')
      .attr('class', 'background')
      .attr('fill', '#fff')
      .attr('opacity', 0)
      .attr('x', -initPosition[0])
      .attr('y', -initPosition[1])
      .attr('width', width)
      .attr('height', height);

    /**
     * Initiate Minimap
     * @type {Minimap}
     */
    const minimap = (state.minimap = new Minimap({
      enableMinimap,
      base: svg,
      host: svg,
      target: mainGroup,
      layout,
      initZoomScale,
      minimapScale,
      scale: layout.getZoomScale(),
      x: width - (width * minimapScale) / 2 - 5,
      y: height - (height * minimapScale) / 2 - 5,
      svgWidth,
      svgHeight,
      width,
      height
    }));

    /**
     * Initiate zoom event
     */
    const zoom = layout.initZoom(innerWrapper, [mainGroup], minimap, [width, height]);

    innerWrapper.call(zoom);
    layout.specialZoom(innerWrapper);

    if (initZoomScale !== layout.getZoomScale()) {
      layout.changeCanvasZoom(d3.zoomIdentity.translate(0, 0).scale(initZoomScale), 0, true);
    }

    // append stratum layer for z-index
    for (let i = 0; i <= 10; i++) {
      mainGroup.append('svg:desc').attr('class', `zIndex-${i}-stratum`);
    }

    state.mainGroup = mainGroup;

    /**
     * Initiate custom event
     */
    svg.node().addEventListener(
      'updateTopology',
      () => {
        this.update(this.props);
      },
      true
    );

    svg.node().addEventListener(
      'unselectAll',
      () => {
        this.unselectAll();
      },
      true
    );

    /**
     * Initiate Minimap
     */
    if (enableMinimap) {
      // init clip-path
      innerWrapper.attr('clip-path', 'url(#wrapperClipPath_forMinimap)');
      /** ADD SHAPE **/
      minimap.render();
    }

    /**
     * Initiate Data processor
     * Data processor instance is not stored in project instance.
     */
    this.state.dataprocessor = invoke(project, 'getDataProcessor', { ...this.props, project, mainGroup, selector });

    invoke(project, 'initiated');

    this.update(this.props);
  }

  initProject(projectPath, projectName, projectClass) {
    const ProjectClass = projectClass || require(`${projectPath}/${projectName}.js`).default;
    return new ProjectClass(this.props);
  }

  updateState() {
    const { data } = this.props;
    const state = this.state;
    const nodesStickyValues = ['isExpand'];

    // update nodes and links state
    set(state, 'nodes', this.updateStateFromProps('nodes', state.nodes, get(data, 'nodes'), nodesStickyValues));
    set(state, 'links', this.updateStateFromProps('links', state.links, get(data, 'links')));

    // link from & to into source & target
    this.linkSourceAndTarget(state.nodes, state.links);
  }

  update(newProps) {
    console.log('updating topology...');
    const { background } = this.state;

    // merge properties(keep default value)
    assign(this.props, newProps);

    const { backgroundColor, enableMinimap } = this.props;

    this.updateState();

    const { nodes, links, minimap, dataprocessor } = this.state;

    // update background
    background.attr('fill', backgroundColor);

    // process(add/update/remove) nodes, links, groups...
    dataprocessor.process(nodes, links);

    // update minimap
    if (enableMinimap) {
      minimap.refresh();
    }
  }

  unselectAll() {
    const { selector } = this.state;
    selector.unselectAll();
  }

  quit() {
    const { svg, project } = this.state;
    invoke(project, 'quit');

    // remove custom event
    svg.node().removeEventListener('updateTopology');
    svg.node().removeEventListener('unselectAll');
  }

  resize(width, height) {
    const { svg } = this.state;
    console.log('resizing topology...');

    // setting size
    this.props.width = width;
    this.props.height = height;
    svg.attr('width', width).attr('height', height);
  }

  updateStateFromProps(key, stateData, propsData, stickyValues) {
    if (propsData) {
      if (!stateData) {
        stateData = cloneDeep(propsData);
      } else {
        const temp = [];

        propsData.forEach(p => {
          const s = stateData.find(s => s.id === p.id);
          if (s) {
            // --->update from props, --->remove from props
            const refP = stickyValues ? omit(p, stickyValues) : p;
            // merge
            merge(s, refP);
            temp.push(s);
          } else {
            // --->add from props
            // clone
            temp.push(cloneDeep(p));
          }
        });

        stateData = temp;
      }
    }
    return stateData;
  }

  linkSourceAndTarget(nodes, links) {
    const nodeMap = {};

    if (nodes) {
      nodes.forEach(n => {
        if (n && n.id) {
          nodeMap[n.id] = n;
        }
      });
    }

    if (links) {
      links.forEach(l => {
        l.source = nodeMap[l.from] || {};
        l.target = nodeMap[l.to] || {};
      });
    }
  }
}
