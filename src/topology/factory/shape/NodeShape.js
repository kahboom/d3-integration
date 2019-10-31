import Shape2D from './Shape2D';
import get from 'lodash/get';
import { event as d3Event } from 'd3-selection';
const d3 = Object.assign({}, require('d3-selection'));
export default class NodeShape extends Shape2D {
  appendIcon(parentDom, data) {
    const drawType = 'node';
    const { spec, util } = this.props.projectState;
    const { shapeGenerator } = this.state;
    const nodeStyle = spec.findTypeStyle(data, drawType);

    if (nodeStyle.iconType) {
      let iconDom;
      // ---- add node main icon ----//
      if (nodeStyle.iconType === 'text') {
        // var font = me.getFontBySpec(data, nodeStyle);
        iconDom = shapeGenerator.newText(parentDom, {
          attributes: {
            class: 'node-icon',
            'text-anchor': 'middle',
            transform: function() {
              return 'scale(' + nodeStyle.iconScale + ')';
            }
          },
          styles: {
            fill: 'black',
            font: this.getFontBySpec(data, nodeStyle),
            'font-weight': 900,
            'dominant-baseline': 'central',
            'alignment-baseline': 'central'
          },
          text: nodeStyle.icon
        });
        // let userAgent = window.navigator.userAgent;
        if (util.isIEAgent()) {
          iconDom.attr('dy', '.4em'); // ie bug
        }
      } else if (nodeStyle.iconType === 'image') {
        // console.debug('append base64icon', data.icon);
        iconDom = shapeGenerator.newImage(parentDom, {
          attributes: {
            class: 'node-icon',
            'xlink:href': this.getIconContent(data, nodeStyle),
            id: data.id,
            x: nodeStyle.positionX === undefined ? (nodeStyle.iconWidth ? '-' + parseInt(nodeStyle.iconWidth.replace('px', '')) / 2 + 'px' : '-31px') : nodeStyle.positionX + 'px',
            y: nodeStyle.positionY === undefined ? (nodeStyle.iconHeight ? '-' + parseInt(nodeStyle.iconHeight.replace('px', '')) / 2 + 'px' : '-31px') : nodeStyle.positionY + 'px',
            width: nodeStyle.iconWidth ? nodeStyle.iconWidth : '64px',
            height: nodeStyle.iconHeight ? nodeStyle.iconHeight : '64px',
            transform: function() {
              return 'scale(' + nodeStyle.iconScale + ')';
            }
          }
        });
      }
    }
  }
  appendViews(gDom, data, viewProperties) {
    const drawType = 'node';
    const { fontAwesomeClass } = this;
    const { nodeLabelFontFamily, getIntlMessage } = this.props;
    const { spec } = this.props.projectState;
    const { viewGenerator } = this.state;
    const dataStyle = spec.findDataStyle(data, drawType);

    viewProperties = viewProperties || viewGenerator.getAllViewDefaultProperties();

    // ---- add view ----//
    viewProperties.forEach(viewType => {
      const enable = dataStyle[viewType + 'Enabled'];
      const viewProps = dataStyle[viewType + 'PropertyMap'];
      if (viewProps !== undefined) {
        if (['number', 'outline', 'linkLabel', 'colorTag'].indexOf(viewType) !== -1) {
          viewGenerator.new(this, gDom, { data, viewType, topoSpec: spec, viewProps });
        } else if (enable === true && viewProps) {
          // text icon view
          const nodeStyle = spec.findTypeStyle(data, drawType);
          const baseX = get(nodeStyle, 'width', 0);
          const baseY = get(nodeStyle, 'height', 0);
          gDom
            .append('text')
            .attr('class', drawType + '-' + viewType + '-view')
            .attr('text-anchor', 'middle')
            .style('fill', viewProps['color'])
            .style('font-family', () => {
              if (viewProps['textType'] === 'text') {
                return nodeLabelFontFamily;
              } else if (viewProps['textType'] === 'icon') {
                return `"${fontAwesomeClass}"`;
              } else {
                return `"${fontAwesomeClass}"`;
              }
            })
            .style('font-size', viewProps['fontSize'])
            .style('font-weight', viewProps['fontWeight'] || 900)
            .style('dominant-baseline', 'central')
            .style('alignment-baseline', 'central')
            .text(function() {
              if (viewProps['textType'] === 'text' && viewProps.text && viewProps.text.indexOf('i18n.') !== -1) {
                const textKey = viewProps.text.replace('i18n.', '');
                return getIntlMessage(textKey);
              }
              return viewProps.text;
            })
            .attr('x', baseX + viewProps['relativePosition'].x + 'px')
            .attr('y', baseY + viewProps['relativePosition'].y + 'px')
            .attr('width', viewProps['fontSize'] ? viewProps['fontSize'] + 'px' : '16px')
            .attr('height', viewProps['fontSize'] ? viewProps['fontSize'] + 'px' : '16px');
        }
      }
    });
  }
  appendToolbar(gDom, data) {
    if (!data.toolbar || data.toolbar.length === 0) {
      return;
    }
    const me = this;
    const drawType = 'node';
    const { spec } = this.props.projectState;
    const toolbarStyle = spec.findToolbarStyle(data, drawType);
    const tools = data.toolbar;
    const isSelect = gDom.attr('class').indexOf('selected') === -1;
    // ---- add toolbar ----//
    tools.forEach(function(tool) {
      if (!tool.visibleBySelect || (tool.visibleBySelect && !isSelect)) {
        const toolName = tool.name;
        const toolStyle = toolbarStyle[toolName];
        if (toolStyle) {
          const toolProps = toolStyle[toolName + 'PropertyMap'];
          const toolbarDom = gDom
            .append('g')
            .attr('class', drawType + '-toolbar')
            .style('pointer-events', 'all');
          me.appendTool(data, toolbarDom, tool, toolProps);
        }
      }
    });
  }
  appendTool(data, toolbarDom, tool, toolProps) {
    const drawType = 'node';
    const { fontAwesomeClass } = this;
    const { spec } = this.props.projectState;
    const { shapeGenerator } = this.state;
    const nodeStyle = spec.findTypeStyle(data, drawType);
    const toolName = tool.name;
    const clickEvent = tool.onClick || function() {};
    // ---- add tool ----//
    shapeGenerator.newText(toolbarDom, {
      attributes: {
        class: drawType + '-tool-' + toolName + ' tool',
        'text-anchor': 'middle',
        x: get(nodeStyle, 'width', 0) + toolProps['relativePosition'].x + 'px',
        y: get(nodeStyle, 'height', 0) + toolProps['relativePosition'].y + 'px',
        width: '16px',
        height: '16px'
      },
      styles: {
        'pointer-events': 'all',
        fill: toolProps['color'],
        font: `bold 16px "${fontAwesomeClass}"`,
        'dominant-baseline': 'central',
        'alignment-baseline': 'central',
        cursor: data.visible !== false ? 'pointer' : 'default'
      },
      text: toolProps.text,
      events: {
        click: function(d) {
          if (d.visible !== false) {
            clickEvent.call(this, d);
            d3Event.stopPropagation();
          }
        }
      }
    });
  }
  appendNodeLabel(gDom, data) {
    const drawType = 'node';
    const { nodeLabelSize, nodeLabelWeight, nodeLabelFontFamily } = this.props;
    const { spec, util } = this.props.projectState;
    const { shapeGenerator } = this.state;
    const nodeStyle = spec.findTypeStyle(data, drawType);
    shapeGenerator.newText(gDom, {
      attributes: {
        class: 'node-label',
        'text-anchor': 'middle',
        'dominant-baseline': 'text-before-edge',
        dy: function() {
          const height = get(nodeStyle, 'height', 0);
          if (!util.isIEAgent()) {
            return height;
          } else {
            return height + 15;
          }
        },
        fill: '#555'
      },
      styles: {
        'z-index': '1',
        'font-size': nodeLabelSize,
        'font-weight': nodeLabelWeight,
        'font-family': nodeLabelFontFamily
      },
      text: function(d) {
        if (d['name']) {
          return d['name'];
        }
      }
    });
  }

  updateIcon(thisDom, data) {
    const me = this;
    const drawType = 'node';
    const { spec, util } = this.props.projectState;
    const nodeStyle = spec.findTypeStyle(data, drawType);

    if (nodeStyle.iconType) {
      let iconDom = thisDom.select('.node-icon');
      const font = me.getFontBySpec(data, nodeStyle);
      const dom = iconDom.node();
      if (nodeStyle.iconType === 'text') {
        if (dom && dom.tagName === 'text') {
          if (iconDom.text() !== nodeStyle.icon) {
            iconDom.text(nodeStyle.icon).attr('transform', function() {
              return 'scale(' + nodeStyle.iconScale + ')';
            });
          }
        } else {
          iconDom.remove();
          iconDom = thisDom
            .append('text')
            .attr('class', 'node-icon')
            .attr('text-anchor', 'middle')
            .style('fill', 'black')
            .style('font', font)
            .style('font-weight', 900)
            .style('dominant-baseline', 'central')
            .style('alignment-baseline', 'central')
            .text(nodeStyle.icon)
            .attr('transform', function() {
              return 'scale(' + nodeStyle.iconScale + ')';
            });
        }
        if (util.isIEAgent()) {
          iconDom.attr('dy', '.4em'); // ie bug
        }
      } else if (nodeStyle.iconType === 'image') {
        if (dom && dom.tagName === 'image') {
          if (dom.href.baseVal !== nodeStyle.icon) {
            iconDom
              .attr('xlink:href', me.getIconContent(data, nodeStyle))
              .attr('id', data.id)
              .attr('x', nodeStyle.iconWidth ? '-' + parseInt(nodeStyle.iconWidth.replace('px', '')) / 2 + 'px' : '-31px')
              .attr('y', nodeStyle.iconHeight ? '-' + parseInt(nodeStyle.iconHeight.replace('px', '')) / 2 + 'px' : '-31px')
              .attr('width', nodeStyle.iconWidth ? nodeStyle.iconWidth : '64px')
              .attr('height', nodeStyle.iconHeight ? nodeStyle.iconHeight : '64px')
              .attr('transform', function() {
                return 'scale(' + nodeStyle.iconScale + ')';
              });
          }
        } else {
          iconDom.remove();
          iconDom = thisDom
            .append('image')
            .attr('class', 'node-icon')
            .attr('xlink:href', function(d) {
              // icon image priority NodeType.icon >> node.propertyMap.icon
              if (nodeStyle.icon && nodeStyle.icon !== '') {
                return nodeStyle.icon;
              } else {
                return d.icon;
              }
            })
            .attr('id', data.id)
            .attr('x', nodeStyle.iconWidth ? '-' + parseInt(nodeStyle.iconWidth.replace('px', '')) / 2 + 'px' : '-31px')
            .attr('y', nodeStyle.iconHeight ? '-' + parseInt(nodeStyle.iconHeight.replace('px', '')) / 2 + 'px' : '-31px')
            .attr('width', nodeStyle.iconWidth ? nodeStyle.iconWidth : '64px')
            .attr('height', nodeStyle.iconHeight ? nodeStyle.iconHeight : '64px')
            .attr('transform', function() {
              return 'scale(' + nodeStyle.iconScale + ')';
            });
        }
      }
    }
  }

  updateNodeLabel(gDom, data, enable) {
    const labels = gDom.select('.node-label');
    if (enable) {
      if (!labels.node()) {
        this.appendNodeLabel(gDom, data);
      } else {
        // update text
        labels.text(function(d) {
          if (d['name']) {
            return d['name'];
          } else {
            return '';
          }
        });
      }
    } else if (!enable && labels.node() !== null) {
      labels.remove();
    }
  }

  updateViews(gDom, data) {
    const me = this;
    const drawType = 'node';
    const { spec } = this.props.projectState;
    const { viewGenerator } = this.state;
    const dataStyle = spec.findDataStyle(data, drawType);
    const allViewProperties = viewGenerator.getAllViewDefaultProperties();

    allViewProperties.forEach(function(viewType) {
      const enable = dataStyle[viewType + 'Enabled'];
      const viewProps = dataStyle[viewType + 'PropertyMap'];
      if (['number', 'outline', 'linkLabel', 'colorTag'].indexOf(viewType) !== -1) {
        viewGenerator.update(me, gDom, { data, viewType, topoSpec: spec, viewProps });
      } else {
        if (enable !== undefined) {
          // ---- update view ----//
          const labels = gDom.select('.' + drawType + '-' + viewType + '-view');
          if (enable && !labels.node()) {
            me.appendViews(data, gDom, [viewType]);
          } else if (!enable && labels.node()) {
            labels.remove();
          }
        } else {
          // for performance concerning, using native operation to delete dom
          const gNativeDom = gDom.node();
          if (gNativeDom.childNodes && gNativeDom.childNodes.length > 0) {
            const childNodes = gNativeDom.childNodes;
            const length = childNodes.length;
            for (let i = length - 1; i >= 0; i--) {
              const childDom = childNodes[i];
              if (childDom && String.prototype.indexOf.call(childDom.className.baseVal, drawType + '-' + viewType + '-view') !== -1) {
                gNativeDom.removeChild(childDom);
                break;
              }
            }
          }
        }
      }
    });
  }

  updateToolbar(gDom, data) {
    const me = this;
    const drawType = 'node';
    const { spec } = this.props.projectState;
    let toolbar;
    if (!data.toolbar || data.toolbar.length === 0) {
      toolbar = gDom.select('.' + drawType + '-toolbar');
      // remove
      if (toolbar && toolbar.node()) {
        toolbar.remove();
      }
    } else {
      toolbar = gDom.select('.' + drawType + '-toolbar');
      if (toolbar && !toolbar.node()) {
        // add
        this.appendToolbar(gDom, data);
      } else {
        // update
        const tools = data.toolbar;
        // update new
        tools.forEach(function(tool) {
          const toolName = tool.name;
          const toolDom = toolbar.select('.' + drawType + '-tool-' + toolName);
          if (toolDom && !toolDom.node()) {
            const toolbarStyle = spec.findToolbarStyle(data, drawType);
            const toolStyle = toolbarStyle[toolName];
            const toolProps = toolStyle[toolName + 'PropertyMap'];
            me.appendTool(data, toolbar, tool, toolProps);
          }
        });
        // update old
        toolbar.select('.tool').each(function() {
          // eslint-disable-next-line no-invalid-this
          const thisDom = d3.select(this);
          const classNames = thisDom.attr('class');
          const exist = tools.some(tool => {
            return classNames.indexOf(tool.name) !== -1;
          });
          if (!exist) {
            thisDom.remove();
          } else {
            // update
            thisDom.style('cursor', data.visible !== false ? 'pointer' : 'default');
          }
        });
      }
    }
  }
}
