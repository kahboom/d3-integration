import NetworkTemplate1 from './NetworkTemplate1';
import NestedGroupLayout from '../layout/NestedGroupLayout';
import Device from '../factory/shape/Device';
import NetworkSwitch from '../factory/shape/NetworkSwitch';
import NamesPathLine from '../factory/shape/NamesPathLine';
import PortLine from '../factory/shape/PortLine';
import SubLine from '../factory/shape/SubLine';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
var d3 = Object.assign({}, require('d3-selection'));
export default class VPC extends NetworkTemplate1 {
  init() {
    super.init();
    const { state, props } = this;
    const projectState = state;
    const device = new Device({ ...props, projectState });
    const networkSwitch = new NetworkSwitch({ ...props, projectState });
    const namesPathLine = new NamesPathLine({ ...props, projectState });
    const portLine = new PortLine({ ...props, projectState });
    const subLine = new SubLine({ ...props, projectState });
    //setting state
    const { factory } = state;
    state.factory = { ...factory, device, networkSwitch, namesPathLine, portLine, subLine };
  }
  layout(props) {
    return new IntegrationLayout({ ...props, type: 'custom', spec: this.state.spec, util: this.state.util, project: this });
  }

  dataPreprocessing(nodes, links) {
    super.dataPreprocessing(nodes, links);
    let nodesById = {},
      subData = {};
    if (nodes) {
      const setting = objs => {
        if (objs) {
          objs.forEach(o => {
            subData[o.id] = o;
          });
        }
      };
      nodes.forEach(n => {
        // port
        if (n.role === 'Spine' || n.role === 'Leaf') {
          setting(n.ports);
        }
        // interface
        setting(n.interfaces);
        nodesById[n.id] = n;
      });
    }
    // link port target and source
    if (links) {
      links.forEach(link => {
        if (['portLine', 'subLine'].indexOf(link.type) !== -1) {
          link.source = subData[link.from] || nodesById[link.from] || {};
          link.target = subData[link.to] || nodesById[link.to] || {};
        }
      });
    }
  }

  beforProcessLinks(links) {}

  addNodeContent(newNodeDom, data) {
    const { factory } = this.state;
    if (data.category) {
      switch (data.category) {
        case 'physicalSwitch':
          get(factory, 'networkSwitch').create(newNodeDom, data);
          break;
        default:
          if (data.type === 'device') {
            get(factory, 'device').create(newNodeDom, data);
          } else {
            super.addNodeContent(newNodeDom, data);
          }
      }
    }
  }
  bindingNodeSelectEvent(nodeDom, selector) {
    super.bindingNodeSelectEvent(nodeDom, selector);
    //bind additional node select
    nodeDom.selectAll('g.node > circle.objInterface').each(function() {
      selector.bindEvent('objInterface', d3.select(this), {
        selected: () => {
          console.log('objInterface was selected...');
        },
        unselected: () => {
          console.log('objInterface was unselected...');
        }
      });
    });
  }
  updateNodeContent(nodeDom, data) {
    const { factory } = this.state;
    if (data.category) {
      switch (data.category) {
        case 'physicalSwitch':
          get(factory, 'networkSwitch').update(nodeDom, data);
          break;
        default:
          if (data.type === 'device') {
            get(factory, 'device').update(nodeDom, data);
          } else {
            super.updateNodeContent(nodeDom, data);
          }
      }
    }
  }
  removeNode(nodeDom, data) {
    const { factory } = this.state;
    if (data.category) {
      switch (data.category) {
        case 'physicalSwitch':
          get(factory, 'networkSwitch').delete(nodeDom);
          break;
        default:
          if (data.type === 'device') {
            get(factory, 'device').delete(nodeDom);
          } else {
            super.removeNode(nodeDom, data);
          }
      }
    }
  }
  addLinkContent(linkDom, data) {
    const { factory } = this.state;
    if (data.type === 'portLine') {
      get(factory, 'portLine').create(linkDom, data);
    } else if (data.type === 'subLine') {
      get(factory, 'subLine').create(linkDom, data);
    } else {
      get(factory, 'namesPathLine').create(linkDom, data);
    }
  }
  updateLinkContent(linkDom, data) {
    const { factory } = this.state;
    if (data.type === 'portLine') {
      get(factory, 'portLine').update(linkDom, data);
    } else if (data.type === 'subLine') {
      get(factory, 'subLine').update(linkDom, data);
    } else {
      get(factory, 'namesPathLine').update(linkDom, data);
    }
  }
}
class IntegrationLayout extends NestedGroupLayout {
  initNodePosition(existedPositions, node) {
    let position;
    if (node && node.category && (node.x === undefined || node.y === undefined)) {
      switch (node.category) {
        case 'physicalSwitch':
          if (node.role === 'Spine') {
            position = this.getAvailablePosition(existedPositions, { x: 0, y: -300 }, { direction: 'hRight' });
          } else {
            //Leaf
            position = this.getAvailablePosition(existedPositions, { x: 0, y: -160 }, { direction: 'hRight' });
          }
          break;
        case 'aggregate':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
          break;
        case 'firewall':
        case 'slb':
        case 'vnfGroup':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 160 }, { direction: 'hRight' });
          break;
        case 'instances':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 300 }, { direction: 'hRight' });
          break;
        default:
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
      }
    }
    return position;
  }
  tick(...args) {
    super.tick(...args);
    const type = get(args, [0, 'type']);
    if (type === 'link') {
      const { util, project } = this.props;
      const { mainGroup, factory } = project.state;
      //update sub dom position
      const updateSubDomPosition = subData => {
        const parentDom = mainGroup.select(`#gnode-${subData.parentId}`);
        const parentData = get(parentDom.data(), 0);
        let dom;
        //for network switch
        if (get(parentData, 'role') === 'Leaf') {
          if (['Spine', 'Leaf'].indexOf(subData.connectedRole) !== -1) {
            dom = parentDom.select(`#${subData.d3Id}-big`);
          } else {
            dom = parentDom.select(`#${subData.d3Id}-small`);
          }
        } else {
          dom = parentDom.select(`#${subData.d3Id}`);
        }
        let centerposition = util.getComponentCenterPosition(dom, parentDom);
        subData.x = centerposition.x;
        subData.y = centerposition.y;
      };
      mainGroup.selectAll('path.subLine').attr('d', d => {
        //update interface or port dom data position
        const updatePositionFunc = data => {
          const temp = [get(data, 'role')];
          if (temp.indexOf('interface') !== -1 || temp.indexOf('commonPort') !== -1) {
            updateSubDomPosition(data);
          }
        };
        const temp = [get(d, 'source.role'), get(d, 'target.role')];
        if (temp.indexOf('interface') !== -1 || temp.indexOf('commonPort') !== -1) {
          updatePositionFunc(d.source);
          updatePositionFunc(d.target);
          return invoke(get(factory, 'portLine'), 'getLinkPathPosition', { data: d });
        }
      });
    }
  }
}
