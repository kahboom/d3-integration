import NetworkTemplate1 from './NetworkTemplate1';
import NestedGroupLayout from '../layout/NestedGroupLayout';
import NamesPathLine from '../factory/shape/NamesPathLine';
import get from 'lodash/get';

const d3 = Object.assign({}, require('d3-selection'));

export default class VPC extends NetworkTemplate1 {
  init() {
    super.init();
    const { state, props } = this;
    const namesPathLine = new NamesPathLine({ ...props, projectState: state });
    const { factory } = state;

    state.factory = { ...factory, namesPathLine};
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
  }

  addNodeContent(newNodeDom, data) {
    if (data.category) {
      super.addNodeContent(newNodeDom, data);
    }
  }

  bindingNodeSelectEvent(nodeDom, selector) {
    super.bindingNodeSelectEvent(nodeDom, selector);
    // Bind additional node select
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

  /**
   * Calculate Node positions based on their respective Category
   * @param existedPositions
   * @param node
   * @return {{x: *, y: *}}
   */
  initNodePosition(existedPositions, node) {
    let position;

    if (node && node.category && (node.x === undefined || node.y === undefined)) {
      switch (node.category) {
        case 'container':
          position = this.getAvailablePosition(existedPositions, { x: 200, y: 75 }, { direction: 'hRight' });
          break;
        case 'example':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
          break;
        case 'fields':
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
          break;
        default:
          position = this.getAvailablePosition(existedPositions, { x: 0, y: -50 }, { direction: 'hRight' });
      }
    }
    return position;
  }

  tick(...args) {
    super.tick(...args);
  }
}
