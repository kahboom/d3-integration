/**
 * @description
 *
 * @class DefaultDataProcessor
 * @param {object} props - ex. {identifier, projectName, project, mainGroup, selector...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import DefaultDataProcessor from '&/@chttl/topology/src/topology/dataProcessor/DefaultDataProcessor';
 *
 * class CustomDataProcessor extends DefaultDataProcessor {
 *  //do something
 * }
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  init() {
 *   super.init();
 *   const customShape = new CustomShape({ ...props, projectState });
 *   // setting state
 *   const { factory } = state;
 *   state.factory = { ...factory, customShape };
 *  }
 *  getDataProcessor(props) {
 *   // do not store data processor instance in project
 *   return new CustomDataProcessor(props);
 *  }
 * }
 *
 *
 */
import GroupNode from '../factory/data/GroupNode';
import get from 'lodash/get';
import set from 'lodash/set';
import invoke from 'lodash/invoke';
const d3 = Object.assign({}, require('d3-selection'));
export default class DefaultDataProcessor {
  props;
  state;
  constructor(props) {
    console.log('initializing data processor...');
    this.props = props || {};
    // default value
    this.defaultProps(props);
    // init state
    this.state = {
      defaultNodeZIndex: 7,
      defaultLinkZIndex: 5,
      defaultGroupZIndex: 3
    };
    this.init();
  }
  defaultProps(props) {
    const setting = (key, defaultValue) => {
      set(this.props, key, props[key] || defaultValue);
    };
    setting('enableGroup', true);
  }
  init() {}
  process(nodes, links) {
    const { enableGroup } = this.props;
    this.dataPreprocessing(nodes, links);
    this.processNodes(nodes, links);
    this.processLinks(nodes, links);
    if (enableGroup) {
      // 基於nodes的isGroup, isExpand, expandable, groupIds, groupable來生成Group範圍底圖
      this.processGroups(nodes, links);
    }
    this.dataProcessed(nodes, links);
  }

  dataPreprocessing(nodes, links) {
    const { project } = this.props;
    invoke(project, 'dataPreprocessing', nodes, links);
  }

  dataProcessed(nodes, links) {
    const { project } = this.props;
    invoke(project, 'dataProcessed', nodes, links);
  }

  processNodes(nodes, links) {
    const { project, mainGroup, selector } = this.props;
    const { defaultNodeZIndex } = this.state;
    const { layout } = project.state;
    // before process
    invoke(project, 'beforeProcessNodes', nodes);
    // layout nodes
    const nodeList = invoke(layout, 'nodes', nodes, links);
    // nodes
    if (!nodeList) {
      return;
    }
    invoke(project, 'startProcessNodes', nodeList);
    const gNodes = mainGroup.selectAll('g.node').data(nodeList, function(d, index) {
      // NOTE : when uuid as id the dom cannot be selected
      const id = d.id || index;
      d.d3Id = 'gnode-' + id;
      return d.d3Id;
    });
    // update nodes
    gNodes.each(function(data) {
      // eslint-disable-next-line no-invalid-this
      const thisDom = d3.select(this);
      if (thisDom.node()) {
        // update g
        thisDom
          .style('visibility', d => {
            return d.visible === false ? 'hidden' : 'visible';
          })
          .attr('id', d => {
            return d.d3Id;
          });
        // update node content
        invoke(project, 'updateNodeContent', thisDom, data);
      }
    });
    // create nodes
    gNodes
      .enter()
      .insert('g', function(d) {
        let zIndex = defaultNodeZIndex;
        if (d.zIndex !== undefined) {
          zIndex = d.zIndex;
        }
        return mainGroup.select(`desc.zIndex-${zIndex}-stratum`).node();
      })
      .each(function(data) {
        // eslint-disable-next-line no-invalid-this
        const thisDom = d3.select(this);
        thisDom
          .attr('id', d => {
            return d.d3Id;
          })
          .attr('class', 'node')
          .style('visibility', d => {
            return d.visible === false ? 'hidden' : 'visible';
          })
          .attr('transform', d => {
            return `translate(${get(d, 'x', 0)},${get(d, 'y', 0)}) scale(${layout.getScale()})`;
          });
        // put drag behind selector event
        thisDom.call(layout.dragNode(thisDom));
        // add node content
        invoke(project, 'addNodeContent', thisDom, data);
        // binding selecting event
        invoke(project, 'bindingNodeSelectEvent', thisDom, selector);
      });
    // remove node
    gNodes
      .exit()
      .each(function(data) {
        // Animate.stopAnimation(d3.select(this));
        // eslint-disable-next-line no-invalid-this
        invoke(project, 'removeNode', d3.select(this), data);
      })
      .remove();
  }

  processLinks(nodes, links) {
    const { project, mainGroup, selector } = this.props;
    const { defaultLinkZIndex } = this.state;
    const { layout } = project.state;
    // before process
    invoke(project, 'beforeProcessLinks', links);
    // layout links
    const linkList = invoke(layout, 'links', links, nodes);
    // links
    if (!linkList) {
      return;
    }
    invoke(project, 'startProcessLinks', linkList);
    const gLinks = mainGroup.selectAll('g.link').data(linkList, (d, index) => {
      const id = d.id || index;
      d.d3Id = 'glink-' + id;
      return d.d3Id;
    });
    // update link
    gLinks.each(function(data) {
      // eslint-disable-next-line no-invalid-this
      const thisDom = d3.select(this);
      if (thisDom.node()) {
        thisDom
          .style('fill', () => {
            return '#333';
          })
          .style('visibility', d => {
            if (d.visible !== undefined) {
              return d.visible ? 'visible' : 'hidden';
            } else {
              return get(d, 'source.visible') === false || get(d, 'target.visible') === false ? 'hidden' : 'visible';
            }
          });
        invoke(project, 'updateLinkContent', thisDom, data);
      }
    });
    // add link with basic style
    // creating the elements without using .enter()
    linkList.forEach(data => {
      if (data) {
        const linkDom = mainGroup.select('#' + data.d3Id);
        if (!linkDom.node()) {
          let zIndex = defaultLinkZIndex;
          if (data.zIndex !== undefined) {
            zIndex = data.zIndex;
          }
          // using data preprocessing to set zIndex properties
          const stratumClass = `zIndex-${zIndex}-stratum`;
          // add link
          mainGroup
            .insert('g', 'desc.' + stratumClass)
            .datum(data)
            .each(function(data) {
              // eslint-disable-next-line no-invalid-this
              const thisDom = d3.select(this);
              thisDom
                .attr('id', () => {
                  // NOTE : when uuid as id the dom cannot be selected
                  return data.d3Id;
                })
                .attr('class', () => {
                  return 'link';
                })
                .style('visibility', d => {
                  if (d.visible !== undefined) {
                    return d.visible ? 'visible' : 'hidden';
                  } else {
                    return get(d, 'source.visible') === false || get(d, 'target.visible') === false ? 'hidden' : 'visible';
                  }
                });
              // .on('click', () => {
              //   thisDom.classed('selected', true);
              // });
              invoke(project, 'addLinkContent', thisDom, data);
              // binding selecting event
              invoke(project, 'bindingLinkSelectEvent', thisDom, selector);
            });
        }
      }
    });
    // remove link
    gLinks
      .exit()
      .each(function(data) {
        // eslint-disable-next-line no-invalid-this
        invoke(project, 'removeLink', d3.select(this), data);
      })
      .remove();
  }

  processGroups(nodes) {
    const { project, mainGroup } = this.props;
    const { defaultGroupZIndex } = this.state;
    const { spec, util, layout } = project.state;
    // before process
    invoke(project, 'beforeProcessGroups', nodes);
    /** RECT GROUP **/
    const groupList = GroupNode.generateGroupData(nodes, { spec, util });
    if (!groupList) {
      return;
    }
    invoke(project, 'startProcessGroups', groupList);
    const rectGroups = mainGroup.selectAll('g.group').data(groupList, function(d, index) {
      const id = d.id || index;
      d.d3Id = 'ggroup-' + id;
      return d3.d3Id;
    });
    // update rectGroup
    rectGroups.each(function(group) {
      // eslint-disable-next-line no-invalid-this
      const gDom = d3.select(this);
      if (gDom.node()) {
        // update group
        invoke(project, 'updateGroupContent', gDom, group);
      }
    });
    // create group
    rectGroups
      .enter()
      .insert('g', function(d) {
        let zIndex = defaultGroupZIndex;
        if (d.zIndex !== undefined) {
          zIndex = d.zIndex;
        }
        return mainGroup.select(` desc.zIndex-${zIndex}-stratum`).node();
      })
      .each(function(data) {
        // eslint-disable-next-line no-invalid-this
        const thisDom = d3.select(this);
        thisDom
          .attr('id', d => {
            return d.d3Id;
          })
          .attr('transform', d => {
            return `scale(${layout.getScale()})`;
          });
        /** Group Pointer EVENT DEFINED **/
        thisDom
          .on('pointerover', function() {})
          .on('mouseover', function() {})
          .on('pointerout', function() {})
          .on('mouseout', function() {})
          .on('pointermove', function() {})
          .on('mousemove', function() {})
          .on('pointerdown', function() {})
          .on('mousedown', function() {})
          .on('pointerup', function() {})
          .on('mouseup', function() {});
        // put drag behind selector event
        thisDom.call(layout.dragGroup(thisDom));
        // add content
        invoke(project, 'addGroupContent', thisDom, data);
      });
    // remove rectGroup
    rectGroups
      .exit()
      .each(function(data) {
        // eslint-disable-next-line no-invalid-this
        invoke(project, 'removeGroup', d3.select(this), data);
      })
      .remove();
  }
}
