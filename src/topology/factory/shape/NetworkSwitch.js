/**
 * 資料格式
 * data: {
 *  id, category, role,
 *  ports:[{id, parentId, interfaceIndex, role: 'port',
 *  connectedCategory,connectedRole,connectedId, connectedFaceId}]
 * }
 */
import Device from './Device';
import get from 'lodash/get';
export default class NetworkSwitch extends Device {
  deviceConfig = { width: 220, height: 50 };
  spineSwitchConfig = { cornerRadius: 20 };
  leafSwitchConfig = { cornerRadius: 10, subPortRowNumber: 30 };
  leafSwitchPorts = [];
  create(dom, data) {
    const { enableNodeLabel } = this.props;
    const switchRole = get(data, 'role');
    if (switchRole === 'Spine') {
      this.appendSpineSwitchOutline(dom, data);
      this.appendSpineSwitchPort(dom, data);
      if (enableNodeLabel) {
        this.appendSpineSwitchLabel(dom, data);
      }
    } else if (switchRole === 'Leaf') {
      this.appendLeafSwitchOutline(dom, data);
      this.appendLeafSwitchPort(dom, data);
      if (enableNodeLabel) {
        this.appendLeafSwitchLabel(dom, data);
      }
    }
  }
  update(dom, data) {
    this.updatePortContent(dom, data);
  }

  appendSpineSwitchOutline(newNodeDom, data) {
    const { deviceConfig, spineSwitchConfig } = this;
    const { shapeGenerator } = this.state;
    let attributes = { class: 'highlight-area', r: deviceConfig.width / 3, cx: 0, cy: 0 };
    const styles = {
      fill: 'rgba(255,255,255,0)',
      'stroke-width': '4px'
    };
    shapeGenerator.newCircle(newNodeDom, { attributes, styles });
    attributes = {
      fill: '#333',
      width: deviceConfig.width,
      height: deviceConfig.height,
      x: -deviceConfig.width / 2,
      y: -deviceConfig.height / 2,
      rx: spineSwitchConfig.cornerRadius,
      ry: spineSwitchConfig.cornerRadius
    };
    shapeGenerator.newRect(newNodeDom, { attributes });

    // ---- append view icon ----//
    this.appendViews(data, newNodeDom);
  }

  appendSpineSwitchPort(newNodeDom, data) {
    const { deviceConfig } = this;
    const { nodeLabelWeight, nodeLabelFontFamily } = this.props;
    const { shapeGenerator } = this.state;
    const { util } = this.props.projectState;
    const portRowNumber = 8;
    const centerX = deviceConfig.width / 2;
    const centerY = deviceConfig.height / 2;
    let upPortNumber = 0;
    const portKeys = Object.keys(data.ports);
    portKeys.forEach(index => {
      const spineSwitchPort = data.ports[index];
      const portStatus = get(spineSwitchPort, 'status');
      // update visible
      spineSwitchPort.visible = data.visible;
      if (portStatus === 'up') {
        upPortNumber++;
        spineSwitchPort.d3Id = 'spineSwitchPort-' + spineSwitchPort.id;
        const dom = shapeGenerator.newRect(newNodeDom, {
          attributes: {
            id: spineSwitchPort.d3Id,
            fill: this.getStatusColor(portStatus),
            width: 15,
            height: 15,
            x: function() {
              // let rowIndex = Math.floor(index / portRowNumber);
              const indexInRow = (upPortNumber - 1) % portRowNumber;
              return 15 + indexInRow * 24 - centerX;
            },
            y: function() {
              const rowIndex = Math.ceil(upPortNumber / portRowNumber) - 1;
              return 20 + ((rowIndex - 1) * 15 + (rowIndex - 1) * 5) + 5 - centerY;
            }
          }
        });
        shapeGenerator.newText(newNodeDom, {
          attributes: {
            class: 'port-label',
            'text-anchor': 'middle',
            'dominant-baseline': 'text-before-edge',
            dx: function() {
              const indexInRow = (upPortNumber - 1) % portRowNumber;
              return 22 + indexInRow * 24 - centerX;
            },
            dy: function() {
              const rowIndex = Math.ceil(upPortNumber / portRowNumber) - 1;
              if (!util.isIEAgent()) {
                return 20 + ((rowIndex - 1) * 15 + (rowIndex - 1) * 5) + 5 - centerY;
              } else {
                return 20 + ((rowIndex - 1) * 15 + (rowIndex - 1) * 5) + 17 - centerY;
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
          text: get(spineSwitchPort, 'portIndex', '')
        });
        const centerposition = util.getComponentCenterPosition(dom, newNodeDom);
        spineSwitchPort.x = centerposition.x;
        spineSwitchPort.y = centerposition.y;
      }
    });
  }
  appendSpineSwitchLabel(gDom /* , data*/) {
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
  appendLeafSwitchOutline(newNodeDom /* , data*/) {
    const { deviceConfig, leafSwitchConfig } = this;
    const { shapeGenerator } = this.state;
    let attributes = { class: 'highlight-area', r: deviceConfig.width / 3, cx: 0, cy: 0 };
    const centerX = deviceConfig.width / 2;
    const centerY = deviceConfig.height / 2;
    const styles = {
      fill: 'rgba(255,255,255,0)',
      'stroke-width': '4px'
    };
    shapeGenerator.newCircle(newNodeDom, { attributes, styles });
    attributes = {
      fill: '#666',
      width: deviceConfig.width,
      height: deviceConfig.height - 20,
      x: -deviceConfig.width / 2,
      y: -deviceConfig.height / 2,
      rx: leafSwitchConfig.cornerRadius,
      ry: leafSwitchConfig.cornerRadius
    };
    shapeGenerator.newRect(newNodeDom, { attributes });
    newNodeDom
      .append('rect')
      .style('fill', function() {
        const color = '#333';
        return color;
      })
      .attr('width', function() {
        return 190;
      })
      .attr('height', function() {
        return 20;
      })
      .attr('rx', function() {
        return 5;
      })
      .attr('ry', function() {
        return 5;
      })
      .attr('x', function() {
        return 15 - centerX;
      })
      .attr('y', function() {
        return 28 - centerY;
      });
  }
  appendLeafSwitchPort(newNodeDom, data) {
    const { deviceConfig, leafSwitchConfig, leafSwitchPorts } = this;
    const { nodeLabelWeight, nodeLabelFontFamily } = this.props;
    const { shapeGenerator } = this.state;
    const { util } = this.props.projectState;
    let portIndex = 0;
    let subPortIndex = 0;
    const subPortRowNumber = leafSwitchConfig.subPortRowNumber;
    const centerX = deviceConfig.width / 2;
    const centerY = deviceConfig.height / 2;
    const portKeys = Object.keys(data.ports);
    portKeys.forEach(index => {
      const leafSwitchPort = data.ports[index];
      if (leafSwitchPort) {
        // update visible
        leafSwitchPort.visible = data.visible;
        const portStatus = get(leafSwitchPort, 'status');
        const connectedRole = get(leafSwitchPort, 'connectedRole');
        leafSwitchPort.d3Id = 'leafSwitchPort-' + leafSwitchPort.id;
        if (portStatus === 'up' && (connectedRole === 'Spine' || connectedRole === 'Leaf')) {
          const dom = shapeGenerator.newRect(newNodeDom, {
            attributes: {
              id: leafSwitchPort.d3Id + '-big',
              fill: this.getStatusColor(portStatus),
              width: 15,
              height: 15,
              x: function() {
                return 15 + portIndex * 20 - centerX;
              },
              y: 8 - centerY
            }
          });
          shapeGenerator.newRect(newNodeDom, {
            attributes: {
              id: leafSwitchPort.d3Id + '-small',
              fill: this.getStatusColor(portStatus),
              width: 5,
              height: 5,
              x: function() {
                return 20 + (subPortIndex % subPortRowNumber) * 6 - centerX;
              },
              y: function() {
                return 32 + 6 * Math.floor(subPortIndex / subPortRowNumber) - centerY;
              }
            }
          });
          subPortIndex = subPortIndex + 1;
          shapeGenerator.newText(newNodeDom, {
            attributes: {
              class: 'port-label',
              'text-anchor': 'middle',
              'dominant-baseline': 'text-before-edge',
              dx: function() {
                return 22 + portIndex * 20 - centerX;
              },
              dy: function() {
                if (!util.isIEAgent()) {
                  return 8 - centerY;
                } else {
                  return 20 - centerY;
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
            text: get(leafSwitchPort, 'portIndex', '')
          });
          const centerposition = util.getComponentCenterPosition(dom, newNodeDom);
          leafSwitchPort.x = centerposition.x;
          leafSwitchPort.y = centerposition.y;
          leafSwitchPorts.push(leafSwitchPort);
          portIndex = portIndex + 1;
        } else {
          const dom = shapeGenerator.newRect(newNodeDom, {
            attributes: {
              id: leafSwitchPort.d3Id + '-small',
              fill: this.getStatusColor(portStatus),
              width: 5,
              height: 5,
              x: function() {
                return 20 + (subPortIndex % subPortRowNumber) * 6 - centerX;
              },
              y: function() {
                return 32 + 6 * Math.floor(subPortIndex / subPortRowNumber) - centerY;
              }
            }
          });
          const centerposition = util.getComponentCenterPosition(dom, newNodeDom);
          leafSwitchPort.x = centerposition.x;
          leafSwitchPort.y = centerposition.y;
          subPortIndex = subPortIndex + 1;
        }
      }
    });
  }
  appendLeafSwitchLabel(gDom /* , data*/) {
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
  updatePortContent(dom, data) {
    // update switch port status
    const { shapeGenerator } = this.state;
    const { projectState } = this.props;
    const { mainGroup } = projectState;
    const switchDom = mainGroup.select(`#${data.d3Id}`);
    if (data.ports) {
      const updatePortDom = (portDom, portData) => {
        shapeGenerator.rect(portDom, {
          attributes: {
            fill: this.getStatusColor(get(portData, 'status'))
          }
        });
      };
      data.ports.forEach(portData => {
        // update visible
        portData.visible = data.visible;
        if (get(data, 'role') === 'Spine') {
          const portDom = switchDom.select(`#${portData.d3Id}`);
          updatePortDom(portDom, portData);
        } else {
          const bigPortDom = switchDom.select(`#${portData.d3Id}-big`);
          const portDom = switchDom.select(`#${portData.d3Id}-small`);
          updatePortDom(bigPortDom, portData);
          updatePortDom(portDom, portData);
        }
      });
    }
  }
}
