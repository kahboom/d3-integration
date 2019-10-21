import NodeShape from './NodeShape';
import get from 'lodash/get';
export default class Rect extends NodeShape {
  create(dom, data) {
    this.appendRect(dom, data);
    this.addAnimation(dom, data);
  }
  update(dom, data) {
    this.updateRect(dom, data);
    this.updateIcon(dom, data, false);
    this.updateNodeLabel(dom, data, this.props.enableNodeLabel);
    this.updateViews(dom, data);
    this.updateToolbar(dom, data);
    this.transAnimation(dom, data);
  }
  delete(dom) {
    const { animation } = this.props.projectState;
    animation.stopAnimation(dom);
  }
  appendRect(newNodeDom, data) {
    const drawType = 'node';
    const { enableNodeLabel } = this.props;
    const { spec } = this.props.projectState;
    const { shapeGenerator } = this.state;
    // find status and node style
    const dataStyle = spec.findDataStyle(data, drawType);
    const nodeStyle = spec.findTypeStyle(data, drawType);
    const width = get(nodeStyle, 'width', 0);
    const height = get(nodeStyle, 'height', 0);

    shapeGenerator.newRect(newNodeDom, {
      attributes: {
        class: 'main-content highlight-area',
        rx: 5,
        ry: 5,
        x: 0,
        y: 0,
        width,
        height
      },
      styles: {
        visibility: data.visible === false ? 'hidden' : 'visible',
        fill: 'white',
        stroke: dataStyle['color'] || 'black',
        'stroke-dasharray': dataStyle['dash'] ? '5,5' : null,
        'stroke-width': '4px'
      }
    });
    this.appendIcon(newNodeDom, data);
    // ---- append view icon ----//
    this.appendViews(newNodeDom, data);
    // ---- append toolbar icon ----//
    this.appendToolbar(newNodeDom, data);
    // ---- add node label ----//
    if (enableNodeLabel) {
      this.appendNodeLabel(newNodeDom, data);
    }
  }

  appendIcon(parentDom, data) {
    super.appendIcon(parentDom, data);
    const drawType = 'node';
    const { spec } = this.props.projectState;
    const nodeStyle = spec.findTypeStyle(data, drawType);

    const iconDom = parentDom.select('text.node-icon');
    const width = get(nodeStyle, 'width', 0);
    const height = get(nodeStyle, 'height', 0);

    iconDom.attr('dx', width / 2);
    iconDom.attr('dy', height / 2);
  }

  updateRect(nodeDom, data) {
    const drawType = 'node';
    const { spec } = this.props.projectState;
    const { shapeGenerator } = this.state;
    // find status and node style
    const dataStyle = spec.findDataStyle(data, drawType);
    const nodeStyle = spec.findTypeStyle(data, drawType);
    const width = get(nodeStyle, 'width', 0);
    const height = get(nodeStyle, 'height', 0);

    shapeGenerator.rect(nodeDom.select('rect.main-content'), {
      attributes: {
        x: 0,
        y: 0,
        width,
        height
      },
      styles: {
        visibility: data.visible === false ? 'hidden' : 'visible',
        fill: 'white',
        stroke: dataStyle['color'] || 'black',
        'stroke-dasharray': dataStyle['dash'] ? '5,5' : null,
        'stroke-width': '4px'
      }
    });
  }
}
