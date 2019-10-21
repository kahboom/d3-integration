import NodeShape from './NodeShape';
export default class Circle extends NodeShape {
  create(dom, data) {
    this.appendCircle(dom, data);
    this.addAnimation(dom, data);
  }
  update(dom, data) {
    this.updateCircle(dom, data);
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
  appendCircle(newNodeDom, data) {
    const drawType = 'node';
    const { enableNodeLabel } = this.props;
    const { spec } = this.props.projectState;
    const { shapeGenerator } = this.state;
    // find status and node style
    const dataStyle = spec.findDataStyle(data, drawType);
    const nodeStyle = spec.findTypeStyle(data, drawType);

    shapeGenerator.newCircle(newNodeDom, {
      attributes: {
        class: 'main-content highlight-area',
        cx: 0,
        cy: 0,
        r: nodeStyle['width']
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

  updateCircle(nodeDom, data) {
    const drawType = 'node';
    const { spec } = this.props.projectState;
    const { shapeGenerator } = this.state;
    // find status and node style
    const dataStyle = spec.findDataStyle(data, drawType);
    const nodeStyle = spec.findTypeStyle(data, drawType);

    shapeGenerator.circle(nodeDom.select('circle.main-content'), {
      attributes: {
        cx: 0,
        cy: 0,
        r: nodeStyle['width']
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
