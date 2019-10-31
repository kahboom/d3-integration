// import _ from 'lodash';
// import uuid from 'uuid';
import get from 'lodash/get';

const fontAwesomeClass = 'FontAwesome';

const allViewProperties = {
  lock: {
    value: 'lock'
  },
  setting: {
    value: 'setting'
  },
  signing: {
    value: 'signing'
  },
  rejection: {
    value: 'rejection'
  },
  number: {
    value: 'number'
  },
  outline: {
    value: 'outline'
  },
  linkLabel: {
    value: 'linkLabel'
  },
  colorTag: {
    value: 'colorTag'
  },
  disconnection: {
    value: 'disconnection'
  }
};

export const ViewGenerator = {};

ViewGenerator.getAllViewDefaultProperties = function() {
  const result = [];
  const keys = Object.keys(allViewProperties);
  keys.forEach(key => {
    result.push(allViewProperties[key].value);
  });
  return result;
};

ViewGenerator.new = function(reference, parentDom, { data, topoSpec, viewType, viewProps }) {
  this.dispatcher('new', reference, parentDom, { data, topoSpec, viewType, viewProps });
  return parentDom;
};

ViewGenerator.update = function(reference, parentDom, { data, topoSpec, viewType, viewProps }) {
  this.dispatcher('update', reference, parentDom, { data, topoSpec, viewType, viewProps });
  return parentDom;
};

ViewGenerator.dispatcher = function(action, reference, dom, { data, topoSpec, viewType, viewProps }) {
  let viewMainType = viewType;
  if (viewType) {
    viewMainType = viewType.split('-')[0];
  }
  if (action === 'new') {
    switch (viewMainType) {
      case allViewProperties.number.value:
        dom = this.newNumberView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      case allViewProperties.outline.value:
        dom = this.newOutlineView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      case allViewProperties.linkLabel.value:
        dom = this.newLinkLabelView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      case allViewProperties.colorTag.value:
        dom = this.newColorTagView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      default:
    }
  } else if (action === 'update') {
    switch (viewMainType) {
      case allViewProperties.number.value:
        dom = this.updateNumberView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      case allViewProperties.outline.value:
        dom = this.updateOutlineView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      case allViewProperties.linkLabel.value:
        dom = this.updateLinkLabelView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      case allViewProperties.colorTag.value:
        dom = this.updateColorTagView(reference, dom, { data, topoSpec, viewType, viewProps });
        break;
      default:
    }
  }

  return dom;
};

ViewGenerator.newColorTagView = function(reference, parentDom, { data, topoSpec, viewType, viewProps }) {
  const drawType = 'node';
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle[viewType + 'Enabled'];
  viewProps = viewProps || { colors: ['black', 'black'] };
  // ---- add color tags ----//
  if (enable === true) {
    const colorTags = data.views.filter(view => {
      return view.indexOf('colorTag') !== -1;
    });
    colorTags.forEach(colorTag => {
      let colorIndex = parseInt(colorTag.split('-')[1]) - 1;
      colorIndex = colorIndex || 0; // avoid NaN
      const tag = parentDom.select('.node-' + viewType + '-view.' + colorTag);
      if (!tag.node()) {
        // let nodeStyle = topoSpec.findTypeStyle(data, drawType);
        const yDistance = colorIndex > 0 ? colorIndex * 15 - 5 : -5;
        parentDom
          .insert('circle', 'circle')
          .attr('class', 'node-' + viewType + '-view ' + colorTag)
          .attr('r', '5')
          .attr('cx', '40')
          .attr('cy', yDistance)
          .style('stroke', 'rgb(45,45,45)')
          .style('stroke-width', 3)
          .style('stroke', viewProps.colors[colorIndex])
          .style('fill', viewProps.colors[colorIndex]);
      }
    });
  }
  return parentDom;
};

ViewGenerator.updateColorTagView = function(reference, parentDom, { data, topoSpec, viewType }) {
  const me = this;
  const drawType = 'node';
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle[viewType + 'Enabled'];
  if (enable !== undefined) {
    if (enable) {
      const colorTags = data.views.filter(view => {
        return view.indexOf('colorTag') !== -1;
      });

      colorTags.forEach(colorTag => {
        const tag = parentDom.select('.node-' + viewType + '-view.' + colorTag);
        if (!tag.node()) {
          // add
          me.new(reference, parentDom, { data: data, viewType: viewType, topoSpec: topoSpec });
        }
        // else{
        // update
        // }
      });
      // remove tag
      const tags = parentDom.selectAll('.node-' + viewType + '-view');
      if (tags && tags[0]) {
        tags[0].forEach(tag => {
          const element = tag;
          if (element !== null) {
            const exist = colorTags.some(colorTag => {
              return element.classList.contains(colorTag);
            });
            if (!exist) {
              // remove tag
              tag.remove();
            }
          }
        });
      }
    } else {
      // remove all
      parentDom.select('.node-' + viewType + '-view').remove();
    }
  } else {
    // for performance concerning, using native operation to delete dom
    const gNativeDom = parentDom.node();
    if (gNativeDom.childNodes && gNativeDom.childNodes.length > 0) {
      const childNodes = gNativeDom.childNodes;
      const length = childNodes.length;
      for (let i = length - 1; i >= 0; i--) {
        const childDom = childNodes[i];
        // console.log('test node class name: ' + String.prototype.indexOf.call(className.baseVal, 'node-setting-view'));
        if (childDom && String.prototype.indexOf.call(childDom.className.baseVal, 'node-' + viewType + '-view') !== -1) {
          gNativeDom.removeChild(childDom);
        }
      }
    }
  }
  return parentDom;
};

ViewGenerator.newNumberView = function(reference, parentDom, { data, topoSpec, viewType }) {
  const drawType = 'node';
  const { util } = reference.props.projectState;
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const objNumber = data.objNumber || 0;
  const enable = dataStyle[viewType + 'Enabled'];
  // ---- add number icon ----//
  if (enable === true) {
    const nodeStyle = topoSpec.findTypeStyle(data, drawType);
    parentDom
      .append('text')
      .attr('class', 'node-number-circle-view')
      .attr('text-anchor', 'middle')
      .style('stroke', '#FFCC8C')
      .style('fill', '#FF930D')
      .style('font', `30px "${fontAwesomeClass}"`)
      .style('font-weight', 900)
      .style('dominant-baseline', 'central')
      .style('alignment-baseline', 'central')
      .text('\uf111')
      .attr('x', -get(nodeStyle, 'width', 0) + 5 + 'px')
      .attr('y', function() {
        if (!util.isIEAgent()) {
          return -get(nodeStyle, 'height', 0) + 5 + 'px';
        } else {
          return -get(nodeStyle, 'height', 0) + 12 + 'px';
        }
      })
      .attr('width', '30px')
      .attr('height', '30px');
    parentDom
      .append('text')
      .attr('class', 'node-number-view')
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font', '10px Arial')
      .style('dominant-baseline', 'central')
      .style('alignment-baseline', 'central')
      .text(objNumber)
      .attr('x', -get(nodeStyle, 'width', 0) + 5 + 'px')
      .attr('y', -get(nodeStyle, 'height', 0) + 5 + 'px')
      .attr('width', '16px')
      .attr('height', '16px');
  }
  return parentDom;
};

ViewGenerator.updateNumberView = function(reference, parentDom, { data, topoSpec, viewType }) {
  const me = this;
  const drawType = 'node';
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle[viewType + 'Enabled'];
  if (enable !== undefined) {
    const labels = parentDom.select('.node-number-view');
    const objNumber = data.objNumber || 0;
    if (enable) {
      if (!labels.node()) {
        // add
        me.new(reference, parentDom, { data: data, viewType: viewType, topoSpec: topoSpec });
      } else {
        // update
        labels.text(objNumber);
      }
    } else if (!enable && labels.node() !== null) {
      // delete
      labels.remove();
      parentDom.select('.node-number-circle-view').remove();
    }
  } else {
    // for performance concerning, using native operation to delete dom
    const gNativeDom = parentDom.node();
    if (gNativeDom.childNodes && gNativeDom.childNodes.length > 0) {
      const childNodes = gNativeDom.childNodes;
      const length = childNodes.length;
      for (let i = length - 1; i >= 0; i--) {
        const childDom = childNodes[i];
        // console.log('test node class name: ' + String.prototype.indexOf.call(className.baseVal, 'node-setting-view'));
        if (childDom && String.prototype.indexOf.call(childDom.className.baseVal, 'node-number-view') !== -1) {
          gNativeDom.removeChild(childDom);
          parentDom.select('.node-number-circle-view').remove();
        }
      }
    }
  }
  return parentDom;
};

ViewGenerator.newOutlineView = function(reference, parentDom, { data, topoSpec, viewType, viewProps }) {
  const drawType = 'node';
  const { nodeLabelSize = '14px', nodeLabelWeight = 'normal', nodeLabelFontFamily = '' } = reference.props;
  const { util } = reference.props.projectState;
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle['outlineEnabled'];
  const viewsProperties = data.viewsProperties || {};
  // ---- add outline view ----//
  if (enable === true) {
    const nodeStyle = topoSpec.findTypeStyle(data, drawType);
    const space = 60;
    parentDom
      .append('rect')
      .attr('x', -get(nodeStyle, 'width', 0) + viewProps['relativePosition'].x - space / 2)
      .attr('y', -get(nodeStyle, 'height', 0) + viewProps['relativePosition'].y - (space / 2 - 5))
      .attr('class', drawType + '-' + viewType + 'rect-view')
      .attr('width', get(nodeStyle, 'width', 0) * 2 + space + 'px')
      .attr('height', get(nodeStyle, 'height', 0) * 2 + space + 'px')
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke-width', '3')
      .attr('stroke', '#a6a6a6');
    parentDom
      .append('text')
      .attr('x', viewProps['relativePosition'].x)
      .attr('y', get(nodeStyle, 'height', 0) + viewProps['relativePosition'].y + 5)
      .attr('class', drawType + '-' + viewType + '-view')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('dy', function() {
        const height = get(nodeStyle, 'height', 0);
        if (!util.isIEAgent()) {
          return height;
        } else {
          return height + 5;
        }
      })
      .style('z-index', '1')
      .style('font-size', nodeLabelSize)
      .attr('fill', '#111')
      .style('font-weight', nodeLabelWeight)
      .style('font-family', nodeLabelFontFamily)
      .text(viewsProperties.outlineTitle);
  }
  return parentDom;
};

ViewGenerator.updateOutlineView = function(reference, parentDom, { data, topoSpec, viewType, viewProps }) {
  const me = this;
  const drawType = 'node';
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle[viewType + 'Enabled'];
  const viewsProperties = data.viewsProperties || {};
  if (enable !== undefined) {
    const labels = parentDom.select('.node-outline-view');
    if (enable) {
      if (!labels.node()) {
        // add
        me.new(reference, parentDom, { data: data, viewType: viewType, topoSpec: topoSpec, viewProps: viewProps });
      } else {
        // update
        labels.text(viewsProperties.outlineTitle);
      }
    } else if (!enable && labels.node()) {
      // delete
      labels.remove();
      parentDom.select('.node-number-rect-view').remove();
    }
  } else {
    // for performance concerning, using native operation to delete dom
    const gNativeDom = parentDom.node();
    if (gNativeDom.childNodes && gNativeDom.childNodes.length > 0) {
      const childNodes = gNativeDom.childNodes;
      const length = childNodes.length;
      for (let i = length - 1; i >= 0; i--) {
        const childDom = childNodes[i];
        // console.log('test node class name: ' + String.prototype.indexOf.call(className.baseVal, 'node-setting-view'));
        if (childDom && String.prototype.indexOf.call(childDom.className.baseVal, 'node-outline-view') !== -1) {
          gNativeDom.removeChild(childDom);
          parentDom.select('.node-number-rect-view').remove();
        }
      }
    }
  }
  return parentDom;
};

ViewGenerator.newLinkLabelView = function(reference, parentDom, { data, topoSpec, viewType }) {
  const drawType = 'node';
  const { nodeLabelWeight, nodeLabelFontFamily } = reference.props;
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle[viewType + 'Enabled'];
  const viewsProperties = data.viewsProperties || {};
  // ---- add number icon ----//
  if (enable === true) {
    const nodeStyle = topoSpec.findTypeStyle(data, drawType);
    const width = viewsProperties.linkLabelWidth;
    parentDom
      .append('defs')
      .append('marker')
      .attr('class', 'node-' + viewType + '-defs-view')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', 'node-' + viewType + '-arrowHead-view')
      .attr('fill', 'rgb(45,45,45)');
    const x1 = 0;
    let x2 = 0;
    const y1 = 0;
    let y2 = 0;
    const distance = viewsProperties.linkLabelDistance;
    if (viewsProperties.linkLabelTextPosition === 'top') {
      y2 = get(nodeStyle, 'height', 0) - distance;
    } else if (viewsProperties.linkLabelTextPosition === 'bottom') {
      y2 = get(nodeStyle, 'height', 0) + distance;
    } else if (viewsProperties.linkLabelTextPosition === 'left') {
      x2 = get(nodeStyle, 'width', 0) - distance;
    } else if (viewsProperties.linkLabelTextPosition === 'right') {
      x2 = get(nodeStyle, 'width', 0) + distance;
    }
    parentDom
      .insert('line', 'circle')
      .attr('class', 'node-' + viewType + '-line-view')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('marker-end', 'url(#arrow)')
      .style('stroke', 'rgb(45,45,45)')
      .attr('stroke-width', 3)
      .style('stroke-dasharray', function() {
        return viewsProperties.linkLabelLineStyle === 'dash' ? '5,5' : null;
      });
    parentDom
      .append('rect')
      .attr('x', get(nodeStyle, 'width', 0) + distance + 7)
      .attr('y', -get(nodeStyle, 'height', 0) + 10)
      .attr('class', drawType + '-' + viewType + 'rect-view')
      .attr('width', width + 'px')
      .attr('height', 40 + 'px')
      .attr('fill', '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke', '#555');
    parentDom
      .append('text')
      .attr('class', 'node-' + viewType + '-text-view')
      .attr('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('alignment-baseline', 'central')
      .text(viewsProperties.linkLabelText)
      .attr('x', get(nodeStyle, 'width', 0) + distance + width / 2)
      .attr('y', 0)
      .attr('fill', '#111')
      .style('font-weight', nodeLabelWeight)
      .style('font-family', nodeLabelFontFamily);
  }
  return parentDom;
};

ViewGenerator.updateLinkLabelView = function(reference, parentDom, { data, topoSpec, viewType, viewProps }) {
  const me = this;
  const drawType = 'node';
  const dataStyle = topoSpec.findDataStyle(data, drawType);
  const enable = dataStyle[viewType + 'Enabled'];
  const viewsProperties = data.viewsProperties || {};
  if (enable !== undefined) {
    const labels = parentDom.select('.node-' + viewType + '-line-view');
    if (enable) {
      if (!labels.node()) {
        // add
        me.new(reference, parentDom, { data: data, viewType: viewType, topoSpec: topoSpec, viewProps: viewProps });
      } else {
        // update
        labels.text(viewsProperties.outlineTitle);
        const link = parentDom.select('.node-' + viewType + '-line-view');
        link.style('stroke-dasharray', function() {
          return viewsProperties.linkLabelLineStyle === 'dash' ? '5,5' : null;
        });
      }
    } else if (!enable && labels.node() !== null) {
      // delete
      labels.remove();
      parentDom.select('.node-' + viewType + '-defs-view').remove();
      parentDom.select('.node-' + viewType + '-arrowHead-view').remove();
      parentDom.select('.node-' + viewType + '-line-view').remove();
      parentDom.select('.node-' + viewType + '-text-view').remove();
    }
  } else {
    // for performance concerning, using native operation to delete dom
    const gNativeDom = parentDom.node();
    if (gNativeDom.childNodes && gNativeDom.childNodes.length > 0) {
      const childNodes = gNativeDom.childNodes;
      const length = childNodes.length;
      for (let i = length - 1; i >= 0; i--) {
        const childDom = childNodes[i];
        // console.log('test node class name: ' + String.prototype.indexOf.call(className.baseVal, 'node-setting-view'));
        if (childDom && String.prototype.indexOf.call(childDom.className.baseVal, 'node-' + viewType + '-view') !== -1) {
          gNativeDom.removeChild(childDom);
          parentDom.select('.node-' + viewType + '-defs-view').remove();
          parentDom.select('.node-' + viewType + '-arrowHead-view').remove();
          parentDom.select('.node-' + viewType + '-line-view').remove();
          parentDom.select('.node-' + viewType + '-text-view').remove();
        }
      }
    }
  }
  return parentDom;
};
