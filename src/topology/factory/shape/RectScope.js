import Shape2D from './Shape2D';
import get from 'lodash/get';
import defaultsDeep from 'lodash/defaultsDeep';
import { event as d3Event } from 'd3-selection';
const d3 = Object.assign({}, require('d3-selection'));
export default class RectScope extends Shape2D {
  create(dom, data) {
    this.appendGroupContent(dom, data);
  }
  update(dom, data) {
    this.updateGroupContent(dom, data);
  }
  appendGroupContent(dom, data) {
    const { fontAwesomeClass } = this;
    const { projectName, enableGroupLabel, projectState } = this.props;
    const { shapeGenerator } = this.state;
    const { spec, mainGroup } = projectState;
    const dataStyle = defaultsDeep({}, data['statusStyle']);
    const groupNodeData = get(mainGroup.select(`#gnode-${data.nodeId}`).data(), [0]);
    shapeGenerator.g(dom, {
      attributes: {
        class: 'group'
      }
    });
    shapeGenerator.newRect(dom, {
      attributes: {
        class: 'groupHull main-content highlight-area',
        rx: dataStyle['cornerRadius'],
        ry: dataStyle['cornerRadius']
      },
      styles: {
        fill: function() {
          return dataStyle['color'];
        },
        stroke: function() {
          return dataStyle['borderColor'];
        },
        'stroke-linejoin': 'round',
        visibility: this.getVisibility(data, groupNodeData),
        opacity: function() {
          return dataStyle['opacity'];
        }
      }
    });
    // append collapse icon
    if (data.toolbar && data.toolbar.indexOf('collapse') !== -1) {
      const drawType = 'group';
      const toolName = 'collapse';
      const toolbarStyle = spec.findToolbarStyle(data, drawType);
      const toolStyle = toolbarStyle[toolName];
      const toolProps = get(toolStyle, toolName + 'PropertyMap');
      const clickEvent = d => {
        const groupNodeData = get(mainGroup.select(`#gnode-${data.nodeId}`).data(), [0]);
        groupNodeData.isExpand = false;
        let event = new CustomEvent('updateTopology', { projectName });
        d3Event.target.dispatchEvent(event);
        event = new CustomEvent('unselectAll', { projectName });
        d3Event.target.dispatchEvent(event);
      };
      shapeGenerator.newText(dom, {
        attributes: {
          class: drawType + '-tool-' + toolName + ' tool',
          'text-anchor': 'middle',
          width: '16px',
          height: '16px',
          'base-x': get(toolProps, 'relativePosition.x', 0),
          'base-y': get(toolProps, 'relativePosition.y', 0)
        },
        styles: {
          'pointer-events': 'all',
          font: `bold 16px "${fontAwesomeClass}"`,
          'dominant-baseline': 'central',
          'alignment-baseline': 'central',
          cursor: groupNodeData.isExpand ? 'pointer' : 'default',
          fill: get(toolProps, 'color'),
          visibility: this.getVisibility(data, groupNodeData)
        },
        text: get(toolProps, 'text'),
        events: {
          click: function(d) {
            if (groupNodeData.isExpand === true) {
              clickEvent.call(this, d);
              d3Event.stopPropagation();
            }
          }
        }
      });
    }
    // group title
    if (enableGroupLabel) {
      this.appendGroupLabel(dom, data, groupNodeData);
    }
    // update group rect and collapse position
    this.updatePosition(dom, data);
  }

  appendGroupLabel(gDom, data, groupNodeData) {
    const { nodeLabelFontFamily } = this.props;
    const { util } = this.props.projectState;
    const dom = gDom
      .append('text')
      .attr('class', 'group-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('x', d => {
        return d.position.minX + (d.position.maxX - d.position.minX) / 2;
      })
      .attr('y', d => {
        if (!util.isIEAgent()) {
          return d.position.maxY + 3;
        } else {
          return d.position.maxY + 12;
        }
      })
      .style('z-index', '1')
      .style('font-size', '16px')
      .style('visibility', this.getVisibility(data, groupNodeData))
      .attr('fill', () => {
        const innerGroupDeep = get(data, 'innerGroupDeep', 0);
        if (innerGroupDeep !== 0) {
          // multi-layer group
          const catalyst = 2;
          let factor = 7 - ((innerGroupDeep * catalyst) % 7);
          factor = factor > 1 ? factor : 1;
          return `#${factor}${factor}${factor}`;
        } else {
          return '#777';
        }
      })
      .style('font-weight', 900)
      .style('font-family', nodeLabelFontFamily)
      .text(function(d) {
        return d.name;
      });
    return { dom };
  }

  updateGroupContent(gDom, data) {
    const { projectState } = this.props;
    const { shapeGenerator } = this.state;
    const { mainGroup } = projectState;
    const rectDom = gDom.select('.main-content');
    const collapseToolDom = gDom.select(`text.group-tool-collapse`);
    const groupDom = mainGroup.select(`#gnode-${data.nodeId}`);
    const groupNodeData = get(groupDom.data(), [0]);
    shapeGenerator.rect(rectDom, { styles: { visibility: this.getVisibility(data, groupNodeData) } });
    this.updateGroupLabel(gDom, data, groupNodeData);
    // update group rect and collapse position
    this.updatePosition(gDom, data);
    // update collapse tool
    collapseToolDom.style('cursor', groupNodeData.isExpand ? 'pointer' : 'default').style('visibility', this.getVisibility(data, groupNodeData));
  }

  updateGroupLabel(gDom, data, groupNodeData) {
    const { enableGroupLabel: enable } = this.props;
    const labels = gDom.select('text.group-label');
    if (enable && !labels.node()) {
      // add
      this.appendGroupLabel(gDom, data, groupNodeData);
    } else if (!enable && labels.node()) {
      // remove
      labels.remove();
    } else if (enable) {
      // update
      labels
        .attr('x', function(d) {
          return d.position.minX + (d.position.maxX - d.position.minX) / 2;
        })
        .attr('y', function(d) {
          return d.position.maxY + 5;
        })
        .style('visibility', this.getVisibility(data, groupNodeData));
    }
  }

  updatePosition(gDom, data) {
    // update group rect position
    this.updateRectPosition(gDom.select('rect.main-content'), data);
    // update group collapse button position
    const collapseTools = gDom.select('.tool');
    collapseTools
      .attr('x', function() {
        // eslint-disable-next-line no-invalid-this
        const base = d3.select(this).attr('base-x');
        return data.position.minX + parseInt(base) + 'px';
      })
      .attr('y', function() {
        // eslint-disable-next-line no-invalid-this
        const base = d3.select(this).attr('base-y');
        return data.position.minY + parseInt(base) + 'px';
      });
  }

  updateRectPosition(rectDom, data) {
    const { util } = this.props.projectState;
    if (rectDom && rectDom.node()) {
      const x = rectDom.attr('x');
      if (x !== undefined) {
        const y = rectDom.attr('y');
        const width = rectDom.attr('width');
        const height = rectDom.attr('height');
        if (x === data.position.minX + '' && y === data.position.minY + '' && width === data.position.maxX - data.position.minX + '' && height === data.position.maxY - data.position.minY + '') {
          // no change
          return;
        }
      }
      rectDom
        .attr('x', d => {
          if (!isNaN(d.position.minX)) {
            return util.getValueFromObject(d, 'position.minX', 0.1);
          }
        })
        .attr('y', d => {
          if (!isNaN(d.position.minY)) {
            return util.getValueFromObject(d, 'position.minY', 0.1);
          }
        })
        .attr('width', d => {
          if (!isNaN(d.position.maxX) && !isNaN(d.position.minX)) {
            return util.checkNumber(d.position.maxX - d.position.minX, 0);
          }
        })
        .attr('height', d => {
          if (!isNaN(d.position.maxY) && !isNaN(d.position.minX)) {
            return util.checkNumber(d.position.maxY - d.position.minY, 0);
          }
        });
    }
  }

  getVisibility(data, groupNodeData) {
    let visibility;
    const innerGroupDeep = get(data, 'innerGroupDeep', 0);
    if (innerGroupDeep !== 0) {
      // multi layer group
      const memberNodes = get(groupNodeData, 'memberNodes', []);
      const memberAllInVisible = memberNodes.findIndex(node => node.visible !== false) === -1;
      visibility = memberAllInVisible ? 'hidden' : get(groupNodeData, 'isExpand') ? 'visible' : 'hidden';
    } else {
      // single layer group
      visibility = get(groupNodeData, 'isExpand') ? 'visible' : 'hidden';
    }
    return visibility;
  }
}
