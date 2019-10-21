/**
 * 資料格式
 * data: {
 *  id, type,
 *  interfaces:[{id, parentId, interfaceIndex, role: 'interface',
 *  connectedCategory,connectedRole,connectedId, connectedFaceId}]
 * }
 */
import NodeShape from './NodeShape';
import get from 'lodash/get';
export default class Device extends NodeShape {
  deviceConfig = { width: 100, height: 25, cornerRadius: 5 };
  create(dom, data) {
    const { enableNodeLabel } = this.props;
    this.appendOutline(dom, data);
    this.appendInterface(dom, data);
    if (enableNodeLabel) {
      this.appendNodeLabel(dom, data);
    }
  }
  update(dom, data) {
    this.updateInterface(dom, data);
  }

  appendOutline(newNodeDom, data) {
    const { deviceConfig } = this;
    const { shapeGenerator } = this.state;
    let attributes = { class: 'highlight-area', r: deviceConfig.width / 3, cx: 0, cy: 0 };
    const styles = {
      fill: 'rgba(255,255,255,0)',
      'stroke-width': '4px'
    };
    shapeGenerator.newCircle(newNodeDom, { attributes, styles });
    attributes = {
      fill: '#333',
      'stroke-width': 3,
      stroke: '#555',
      width: deviceConfig.width,
      height: deviceConfig.height,
      x: -deviceConfig.width / 2,
      y: -deviceConfig.height / 2,
      rx: deviceConfig.cornerRadius,
      ry: deviceConfig.cornerRadius
    };
    shapeGenerator.newRect(newNodeDom, { attributes });

    // ---- append view icon ----//
    this.appendViews(newNodeDom, data);

    // ---- append toolbar icon ----//
    this.appendToolbar(newNodeDom, data);
  }

  appendInterface(newNodeDom, data) {
    const { deviceConfig } = this;
    const { nodeLabelWeight, nodeLabelFontFamily } = this.props;
    const { shapeGenerator } = this.state;
    const { util } = this.props.projectState;
    const rowNumber = 3;
    const centerX = deviceConfig.width / 2;
    const centerY = deviceConfig.height / 2;
    let interfaceNumber = 0;
    const interfaceKeys = Object.keys(data.interfaces);
    interfaceKeys.forEach(index => {
      const interfacesObj = data.interfaces[index];
      const interfaceStatus = get(interfacesObj, 'status');
      interfaceNumber++;
      interfacesObj.d3Id = 'interface-' + interfacesObj.id;
      // update visible
      interfacesObj.visible = data.visible;
      const size = 8;
      const dom = shapeGenerator.newCircle(newNodeDom, {
        attributes: {
          id: interfacesObj.d3Id,
          class: 'objInterface',
          fill: this.getStatusColor(interfaceStatus),
          cx: function() {
            const indexInRow = (interfaceNumber - 1) % rowNumber;
            return 22 + indexInRow * 24 - centerX;
          },
          cy: function() {
            const rowIndex = Math.ceil(interfaceNumber / rowNumber) - 1;
            return 20 + ((rowIndex - 1) * 15 + (rowIndex - 1) * 5) + 3 - centerY;
          },
          r: size
          // width: size,
          // height: size,
          // rx: 2,
          // ry: 2
        }
      });
      shapeGenerator.newText(newNodeDom, {
        attributes: {
          class: 'interface-label',
          'text-anchor': 'middle',
          'dominant-baseline': 'text-before-edge',
          dx: function() {
            const indexInRow = (interfaceNumber - 1) % rowNumber;
            return 22 + indexInRow * 24 - centerX;
          },
          dy: function() {
            const rowIndex = Math.ceil(interfaceNumber / rowNumber) - 1;
            if (!util.isIEAgent()) {
              return 20 + ((rowIndex - 1) * 15 + (rowIndex - 1) * 5) - 4 - centerY;
            } else {
              return 20 + ((rowIndex - 1) * 15 + (rowIndex - 1) * 5) + 11 - centerY;
            }
          },
          fill: '#eee'
        },
        styles: {
          'z-index': '1',
          'font-size': '12px',
          'font-weight': nodeLabelWeight,
          'font-family': nodeLabelFontFamily
        },
        text: get(interfacesObj, 'interfaceIndex', '')
      });
      const centerposition = util.getComponentCenterPosition(dom, newNodeDom);
      interfacesObj.x = centerposition.x;
      interfacesObj.y = centerposition.y;
    });
  }
  appendNodeLabel(gDom /* , data*/) {
    const { deviceConfig } = this;
    const { nodeLabelSize, nodeLabelWeight, nodeLabelFontFamily } = this.props;
    const { util } = this.props.projectState;
    gDom
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('dx', function() {
        return 0;
      })
      .attr('dy', function() {
        if (!util.isIEAgent()) {
          return deviceConfig.height / 2 + 5;
        } else {
          return deviceConfig.height / 2 + 15;
        }
      })
      .style('z-index', '1')
      .style('font-size', nodeLabelSize)
      .attr('fill', '#555')
      .style('font-weight', nodeLabelWeight)
      .style('font-family', nodeLabelFontFamily)
      .text(function(d) {
        if (d['name']) {
          return d['name'];
        } else {
          console.warn("[Topology] Label cannot be shown : need to define 'name'");
          return '';
        }
      });
  }
  updateInterface(dom, data) {
    // update interface status
    const { shapeGenerator } = this.state;
    const { projectState } = this.props;
    const { mainGroup } = projectState;
    const deviceDom = mainGroup.select(`#${data.d3Id}`);
    if (data.interfaces) {
      const updateInterfaceDom = (dom, interfaceData) => {
        shapeGenerator.circle(dom, {
          attributes: {
            fill: this.getStatusColor(get(interfaceData, 'status'))
          }
        });
      };
      data.interfaces.forEach(interfaceData => {
        // update visible
        interfaceData.visible = data.visible;
        const dom = deviceDom.select(`#${interfaceData.d3Id}`);
        updateInterfaceDom(dom, interfaceData);
      });
    }
  }
  getStatusColor(status) {
    const drawType = 'node';
    const { spec } = this.props.projectState;
    const nodeStyle = spec.findStatusStyle({ status }, drawType);
    return get(nodeStyle, 'color', 'grey');
  }
}
