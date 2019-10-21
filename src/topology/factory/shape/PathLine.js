/**
 * 資料格式
 * data: {
 *  id, from, to, status, zIndex, name
 * }
 */

import Shape2D from './Shape2D';
import get from 'lodash/get';
const d3 = Object.assign({}, require('d3-selection'));
export default class PathLine extends Shape2D {
  strokeWidth = 3;
  stroke = '#2D2D2D';
  fontSize = '20px';
  arrowInfo = { id: 'pathLineEndArrow', position: 'marker-end', width: 15, height: 15, refX: 6, refY: 0, stroke: '#2D2D2D', d: 'M0,-5L10,0L0,5 Z', viewBox: '0 -5 10 10' };
  dataPreprocessing() {
    const { arrowInfo } = this;
    const { identifier, enableLineArrow } = this.props;
    if (enableLineArrow && !d3.select(`marker#${arrowInfo.id}`).node()) {
      // append svg defs
      const svg = d3.select(`svg#${identifier}`);
      let defsDom = svg.select(`defs`);
      if (!defsDom.node()) {
        defsDom = svg.append(`svg:defs`);
      }
      if (!defsDom.select(`#${arrowInfo.id}`).node()) {
        defsDom
          .append('svg:marker')
          .attr('id', arrowInfo.id)
          .attr('viewBox', arrowInfo.viewBox)
          .attr('refX', arrowInfo.refX)
          .attr('refY', arrowInfo.refY)
          .attr('markerWidth', arrowInfo.width)
          .attr('markerHeight', arrowInfo.height)
          .attr('markerUnits', 'userSpaceOnUse')
          .attr('orient', 'auto')
          .append('path')
          .attr('d', arrowInfo.d)
          .attr('fill', arrowInfo.stroke);
      }
    }
  }
  create(dom, data) {
    this.appendLine(dom, data);
  }
  update(dom, data) {
    this.updateLine(dom, data);
  }
  appendLine(linkDom, data) {
    const { strokeWidth, stroke, arrowInfo } = this;
    const { enableLinkLabel, enableEdgeActions, onNodeEdgeClick = () => {} } = this.props;
    const { spec } = this.props.projectState;
    const showLineArrow = get(data, 'arrow', false);
    // add link
    const pathDom = linkDom
      .append('path') // 'line'
      .attr('class', 'link')
      .attr(arrowInfo.position, showLineArrow ? `url(#${arrowInfo.id})` : undefined)
      .attr('id', function(d) {
        return `linkId_${d.id}`;
      })
      .attr('d', this.getLinkPathPosition({ data, lineType: get(data, 'lineType', 'linear') }))
      .style('fill', 'rgba(0,0,0,0)')
      .style('stroke', stroke)
      .style('stroke-width', strokeWidth)
      .style('cursor', enableEdgeActions ? 'pointer' : 'default')
      .style('stroke-dasharray', function(d) {
        const targetDataStyle = spec.findDataStyle(d.target, 'node');
        const sourceDataStyle = spec.findDataStyle(d.source, 'node');
        return d['dash'] === true || targetDataStyle['dash'] === true || sourceDataStyle['dash'] ? '5,5' : null;
      });

    // add event
    pathDom.on('click', function(d) {
      // eslint-disable-next-line no-invalid-this
      onNodeEdgeClick.call(this, d, this.getBoundingClientRect());
    });

    // add link label
    if (enableLinkLabel) {
      this.appendLineLabel(linkDom, data);
    }
  }

  getLinkPathPosition({ data }) {
    const showLineArrow = get(data, 'arrow', false);
    const { spec, util } = this.props.projectState;
    // const bias = merge({ source: { x: 0, y: 0 }, target: { x: 0, y: 0 } }, get(data, 'bias', {}));
    const nodeStyle = spec.findTypeStyle(data.target, 'node');
    const nodeWidth = showLineArrow ? get(nodeStyle, 'width', 0) + 10 : 0;
    const nodeHeight = showLineArrow ? get(nodeStyle, 'height', 0) + 10 : 0;
    const bias = { source: { x: 0, y: 0 }, target: { x: -nodeWidth, y: -nodeHeight } };
    return util.getLinkPathPosition({ data, lineType: get(data, 'lineType', 'linear'), bias });
  }

  appendLineLabel(targetDom, data) {
    const { fontSize } = this.props;
    const { spec } = this.props.projectState;
    const dataStyle = spec.findDataStyle(data, 'line');
    // add line label
    if (data.name) {
      this.appendTextPath(targetDom, data, { text: get(data, 'name', ''), fontSize, fillColor: dataStyle['color'], startOffset: '35%' });
    }
    if (data.label) {
      // append text path for label position
      this.appendTextPath(targetDom, data, { text: get(data, 'name', 'p'), visible: false, textClass: 'text-position', startOffset: '50%' });
      // append label gdom
      this.appendTextLabel(targetDom, data);
    }
  }
  appendTextPath(gDom, data, { text = '', textClass = 'text', visible = true, fontSize = '14px', fillColor = '', startOffset = '35%' }) {
    const dom = gDom
      .append('text')
      .attr('class', textClass)
      .style('font', `${fontSize}px FontAwesome`)
      .style('fill', fillColor)
      .append('textPath')
      .attr('startOffset', startOffset)
      .attr('class', 'textPath')
      .attr('xlink:href', function(d) {
        return '#linkId_' + data.id;
      })
      .text(text);
    if (!visible) {
      dom.style('visibility', 'hidden');
    }
  }
  appendTextLabel(gDom, data) {
    const { nodeLabelSize, nodeLabelWeight } = this.props;
    const { shapeGenerator } = this.state;
    const gClass = `glabel`;
    const labelGdom = gDom.append('g');
    labelGdom.attr('class', gClass);
    const textAttr = {
      attributes: {
        class: 'line-label',
        dy: '0.35em'
      },
      styles: {
        fill: '#555',
        'font-size': nodeLabelSize,
        'font-weight': nodeLabelWeight
      },
      text: data.label === '---' ? 'NaN' : data.label
    };
    const rectAttr = {
      attributes: {
        class: 'line-rect',
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

    this.refreshLineLabelPosition(gDom, data);

    return labelGdom;
  }

  refreshLineLabelPosition(gDom, data) {
    if (data.label) {
      const textNode = gDom.select('text.text-position').node();
      if (!textNode) {
        return;
      }
      const pathBBox = textNode.getBBox();
      const rectDom = gDom
        .select('rect.line-rect')
        .attr('x', function() {
          // eslint-disable-next-line no-invalid-this
          const width = Number(d3.select(this).attr('width'));
          return pathBBox.x + pathBBox.width / 2 - width / 2;
        })
        .attr('y', function() {
          // eslint-disable-next-line no-invalid-this
          const height = Number(d3.select(this).attr('height'));
          return pathBBox.y + pathBBox.height / 2 - height / 2;
        });
      gDom
        .select('text.line-label')
        .attr('x', function() {
          const width = Number(rectDom.attr('width'));
          return pathBBox.x + pathBBox.width / 2 - width / 2;
        })
        .attr('y', () => {
          return pathBBox.y + pathBBox.height / 2;
        });
    }
  }

  updateLine(linkDom /* , data*/) {
    // update link
    const { enableLinkLabel } = this.props;
    const { spec } = this.props.projectState;
    linkDom.select('path').style('stroke-dasharray', function(d) {
      const targetDataStyle = spec.findDataStyle(d.target, 'node');
      const sourceDataStyle = spec.findDataStyle(d.source, 'node');
      return d['status'] === 'empty' || targetDataStyle['dash'] === true || sourceDataStyle['dash'] ? '5,5' : null;
    });
    // update link label
    if (enableLinkLabel) {
      linkDom.select('text.text > textPath').text(function(d) {
        return get(d, 'name', '');
      });
    } else {
      linkDom.select('text.text').remove();
    }
  }
}
