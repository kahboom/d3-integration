/**
 * 資料格式
 * data: {
 *  imageType, imageUrl, imageWidth, imageHeight, imageScale, icon, iconFontSize
 * }
 */

import Shape2D from './Shape2D';
import get from 'lodash/get';
export default class Image extends Shape2D {
  create(dom, data) {
    this.appendImage(dom, data);
    this.appendLabel(dom, data);
    this.addAnimation(dom, data);
  }

  update(dom, data) {
    this.updateImage(dom, data);
    this.updateLabel(dom, data);
  }

  delete(dom) {
    const { animation } = this.props.projectState;
    animation.stopAnimation(dom);
  }

  appendImage(dom, data) {
    const drawType = 'node';
    const { fontAwesomeClass } = this;
    const { spec, util } = this.props.projectState;
    const { shapeGenerator } = this.state;
    const nodeStyle = spec.findTypeStyle(data, drawType);
    const {
      imageType = get(nodeStyle, 'imageType', 'image'),
      imageUrl = get(nodeStyle, 'imageUrl'),
      imageWidth = get(nodeStyle, 'imageWidth', 30),
      imageHeight = get(nodeStyle, 'imageHeight', 30),
      imageScale = get(nodeStyle, 'imageScale', 1),
      iconFontSize = get(nodeStyle, 'iconFontSize', '30px'),
      icon = get(nodeStyle, 'icon')
    } = data;
    if (imageType) {
      // select circle
      const attributes = { class: 'highlight-area', r: imageHeight + 2, cx: 0, cy: 0 };
      const styles = {
        fill: 'rgba(255,255,255,0)',
        'stroke-width': '4px'
      };
      shapeGenerator.newCircle(dom, { attributes, styles });

      if (imageType === 'text') {
        // var font = me.getFontBySpec(data, nodeStyle);
        const iconDom = shapeGenerator.newText(dom, {
          attributes: {
            class: 'main-content',
            'text-anchor': 'middle',
            transform: function() {
              return 'scale(' + imageScale + ')';
            }
          },
          styles: {
            fill: 'black',
            font: `${iconFontSize} "${fontAwesomeClass}"`,
            'font-weight': 900,
            'dominant-baseline': 'central',
            'alignment-baseline': 'central'
          },
          text: icon
        });
        // let userAgent = window.navigator.userAgent;
        if (util.isIEAgent()) {
          iconDom.attr('dy', '.4em'); // ie bug
        }
      } else if (imageType === 'image') {
        // console.debug('append base64icon', data.icon);
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image
        shapeGenerator.newImage(dom, {
          attributes: {
            class: 'main-content highlight-area',
            href: imageUrl, // SVG 2
            id: data.id,
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
            transform: function() {
              return 'scale(' + imageScale + ')';
            }
          }
        });
      }
    }
  }

  appendLabel(gDom) {
    const { imageHeight = 30 } = this;
    const { nodeLabelSize, nodeLabelWeight, nodeLabelFontFamily } = this.props;
    const { shapeGenerator } = this.state;
    shapeGenerator.newText(gDom, {
      attributes: {
        class: 'label',
        'text-anchor': 'middle',
        'dominant-baseline': 'text-before-edge',
        dy: imageHeight,
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

  updateImage() {}

  updateLabel(gDom, data) {
    const { enableNodeLabel } = this.props;
    const labels = gDom.select('.label');
    if (enableNodeLabel) {
      if (!labels.node()) {
        this.appendLabel(gDom, data);
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
    } else if (!enableNodeLabel && labels.node() !== null) {
      labels.remove();
    }
  }
}
