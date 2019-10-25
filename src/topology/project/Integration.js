import NetworkTemplate1 from './NetworkTemplate1';
import NestedGroupLayout from '../layout/NestedGroupLayout';
import Device from '../factory/shape/Device';
import NamesPathLine from '../factory/shape/NamesPathLine';
import PortLine from '../factory/shape/PortLine';
import SubLine from '../factory/shape/SubLine';
import get from 'lodash/get';
import invoke from 'lodash/invoke';

const d3 = Object.assign({}, require('d3-selection'));

export default class VPC extends NetworkTemplate1 {
  init() {
    super.init();
    const { state, props } = this;
    const projectState = state;
    const device = new Device({ ...props, projectState });
    const namesPathLine = new NamesPathLine({ ...props, projectState });
    const portLine = new PortLine({ ...props, projectState });
    const subLine = new SubLine({ ...props, projectState });

    //setting state
    const { factory } = state;
    state.factory = { ...factory, device, namesPathLine, portLine, subLine };
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
        setting(n.interfaces);
        nodesById[n.id] = n;
      });
    }

    //link port target and source
    if (links) {
      links.forEach(link => {
        if (['portLine', 'subLine'].indexOf(link.type) !== -1) {
          link.source = subData[link.from] || nodesById[link.from] || {};
          link.target = subData[link.to] || nodesById[link.to] || {};
        }
      });
    }
  }

  addNodeContent(newNodeDom, data) {
    if (data.category) {
      super.addNodeContent(newNodeDom, data);
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
    if (data.category) {
      super.updateNodeContent(nodeDom, data);
    }
  }

  addLinkContent(linkDom, data) {
    const { factory } = this.state;
    get(factory, 'namesPathLine').create(linkDom, data);
  }
}

class IntegrationLayout extends NestedGroupLayout {

  initNodePosition(existedPositions, node) {
    let position;

    if (node && node.category && (node.x === undefined || node.y === undefined)) {
      switch (node.category) {
        case 'aggregate':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: -50 }, { direction: 'hRight' });
          break;
        case 'app':
          position = this.getAvailablePosition(existedPositions, { x: 100, y: -160 }, { direction: 'hRight' });
          break;
        case 'instances':
          position = this.getAvailablePosition(existedPositions, { x: 200, y: 50 }, { direction: 'hRight' });
          break;
        case 'step':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
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

        let dom;
        dom = parentDom.select(`#${subData.d3Id}`);
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
