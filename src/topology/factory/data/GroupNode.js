import VirtualNode from './VirtualNode';
import d3TopoUtil from '../../util/d3TopoUtil';
import uuid from 'uuid';
import get from 'lodash/get';
import intersection from 'lodash/intersection';
import extend from 'lodash/extend';
import { event as d3Event } from 'd3-selection';

export default {
  /**
   * cacheData{spec, dummyGroupNodes, dummyGroupLinks}
   */
  dealWithGroupData(nodes, links, cacheData) {
    const me = this;
    // cache data value
    const { spec } = cacheData;
    const nodeType = spec.getNodeType();

    nodes.forEach(function(node) {
      if (node) {
        if (node.groupIds && node.groupIds.length > 0) {
          me.dealWithGroupNodeInterator(cacheData, nodeType, nodes, links, node);
        }
        // add node link connecting related node
        me.addVirtualLinkFromNode(cacheData, links, node.relatedNodes, node, false);
      }
    });
  },

  findDataFromObject(obj, id) {
    let result;

    if (obj && id) {
      if (Array.isArray(obj)) {
        obj.some(temp => {
          if (id && temp.id === id) {
            result = temp;
            return true;
          }
        });
      } else {
        const keys = Object.keys(obj);

        keys.some(key => {
          const temp = obj[key];

          if (id && temp.id === id) {
            result = temp;
            return true;
          }
        });
      }
    }
    return result;
  },

  dealWithGroupNodeInterator(cacheData, nodeType, nodes, links, node) {
    const me = this;
    const category = node.category;
    // passing data
    const { dummyGroupNodes, groupNodeExpanding } = cacheData;
    // node config
    // Collapsed
    const nodeExt = nodeType[category] ? nodeType[category].extensions || {} : {};
    const { createDummyGroupNodeIfNecessary, dummyGroupCategory, dummyGroupName, dummyGroupStatus } = nodeExt;
    const groupable = node.groupable;

    if (groupable) {
      if (node.groupIds) {
        let groupNode;
        dummyGroupNodes.some(temp => {
          if (node.groupIds.indexOf(temp.id) !== -1) {
            groupNode = temp;
            return true;
          }
        });
        // recollect group node in nodes
        if (!groupNode) {
          nodes.some(temp => {
            if (node.groupIds.indexOf(temp.id) !== -1) {
              groupNode = temp;
              dummyGroupNodes.push(groupNode);
              return true;
            }
          });
        }
        if (!groupNode) {
          if (createDummyGroupNodeIfNecessary) {
            groupNode = me.generateDummyGroupData(nodeExt, dummyGroupCategory, dummyGroupName, dummyGroupStatus);
            if (groupNode) {
              dummyGroupNodes.push(groupNode);
              nodes.push(groupNode);
            }
          }
        }
        if (groupNode) {

          if (groupNode.expandable) {
            if (!groupNode.toolbar) {
              groupNode.toolbar = [];
            }
            const hasExpandFunction = groupNode.toolbar.some(func => {
              if (func.name === 'expand') {
                return true;
              }
            });
            if (!hasExpandFunction) {

              groupNode.toolbar.push({
                name: 'expand',
                visibleBySelect: false,
                onClick(d) {
                  d.isExpand = !d.isExpand;
                  if (groupNodeExpanding) {
                    groupNodeExpanding(d3Event);
                  }
                }
              });
            }
          }

          // let x = groupNode.x;
          // let y = groupNode.y;
          // let nodeX = node.x;
          // let nodeY = node.y;

          // extend group info
          if (node.groupIds.indexOf(groupNode.id) === -1) {
            node.groupIds.push(groupNode.id);
          }
          node.groupCategory = groupNode.category;

          if (groupNode.groupIds !== undefined) {
            // multi-layer groups
            const parentVisible = this.getParentNodeVisibility(dummyGroupNodes, groupNode.groupIds);
            if (!parentVisible) {
              groupNode.visible = !groupNode.isExpand;
              node.visible = !groupNode.visible;
            } else {
              groupNode.visible = node.visible = false;
            }
          } else {
            // single-layer groups
            groupNode.visible = !groupNode.isExpand;
            node.visible = !groupNode.visible;
          }

          // setting group status
          me.settingGroupNodeStatusIterator(nodeType, groupNode, node);

          if (!groupNode.memberNodes) {
            groupNode.memberNodes = [];
          }

          // if (groupNode.memberNodes[0] === node) {
          //   //reset groupNode position
          //   groupNode.x = x = 0;
          //   groupNode.y = y = 0;
          // }

          // add member node into group node
          if (d3TopoUtil.findObjectInArray(groupNode.memberNodes, node) === -1) {
            groupNode.memberNodes.push(node);
            if (!node.status) {
              groupNode.status = 'empty';
            }
            if (groupNode.objNumber === undefined) {
              groupNode.objNumber = 0;
            }
            groupNode.objNumber = groupNode.objNumber + 1;
          }

          // adusting group node position when new member comes in.
          // move to layout
          // const position = (groupNode.position = groupNode.position || {});
          // position.minX = x >= 1 || x <= -1 ? (position.minX !== undefined && nodeX < position.minX ? nodeX : position.minX) : nodeX;
          // position.maxX = x >= 1 || x <= -1 ? (position.minX !== undefined && nodeX > position.maxX ? nodeX : position.maxX) : nodeX;
          // position.minY = y >= 1 || y <= -1 ? (position.minY !== undefined && nodeY < position.minY ? nodeY : position.minY) : nodeY;
          // position.maxY = y >= 1 || y <= -1 ? (position.maxY !== undefined && nodeY > position.maxY ? nodeY : position.maxY) : nodeY;
          // groupNode.x = (position.minX + position.maxX) / 2.0;
          // groupNode.y = (position.minY + position.maxY) / 2.0;

          // add group node link connecting related node and related group node
          me.addVirtualLinkFromNode(cacheData, links, node.relatedNodes, groupNode, true);

          // add member label into group node
          const views = node.views;
          if (views && views.length > 0) {
            const groupNodeViews = (groupNode.views = groupNode.views || []);
            for (let i = 0; i < views.length; i++) {
              const view = views[i];
              if (view.indexOf('colorTag') !== -1 && groupNodeViews.indexOf(view) === -1) {
                groupNodeViews.push(view);
              }
            }
          }
        }
      }
    } else {
      // remove nodes from group
      if (dummyGroupNodes.length > 0) {
        const groupNode = this.findDataFromObject(dummyGroupNodes, node.groupId);
        if (groupNode && groupNode.memberNodes) {
          const nodesInGroup = groupNode.memberNodes;
          for (let i = nodesInGroup.length - 1; i >= 0; i--) {
            if (nodesInGroup[i].id === node.id) {
              nodesInGroup.splice(0, 1);
              groupNode.objNumber--;
            }
          }
        }
      }
    }
  },

  getParentNodeVisibility(groupNodes, groupIds) {
    let visible = false;
    // multi-layer groups
    if (groupIds) {
      groupIds.forEach(groupId => {
        const parentGroupNode = this.findDataFromObject(groupNodes, groupId);
        if (parentGroupNode) {
          if (parentGroupNode.isExpand) {
            if (parentGroupNode.groupIds !== undefined) {
              // go up layer group
              visible = this.getParentNodeVisibility(groupNodes, parentGroupNode.groupIds);
            } else {
              visible = !parentGroupNode.isExpand;
            }
          } else {
            visible = true;
          }
        }
      });
    }
    return visible;
  },

  getGroupDeep(groupNodes, groupIds) {
    let deep = 0;
    // multi-layer groups
    if (groupIds) {
      deep++;
      groupIds.forEach(groupId => {
        const parentGroupNode = this.findDataFromObject(groupNodes, groupId);
        if (parentGroupNode) {
          if (parentGroupNode.groupIds !== undefined) {
            // go up layer group
            deep += this.getGroupDeep(groupNodes, parentGroupNode.groupIds);
          }
        }
      });
    }
    return deep;
  },

  addVirtualLinkFromNode(cacheData, links, relatedNodes, node, isGroupLink) {
    if (relatedNodes) {
      const { dummyGroupNodes } = cacheData;
      relatedNodes.forEach(relatedNode => {
        this.addVirtualLink(cacheData, links, relatedNode, node, 'running', isGroupLink);
        // add group virtual link connecting to related group node
        const doubleRelatedNodes = relatedNode.relatedNodes;
        if (doubleRelatedNodes) {
          let relatedGroupNodes;
          const doubleRelatedIds = doubleRelatedNodes.map(node => node.id);
          dummyGroupNodes.some(temp => {
            const tempIds = get(temp, 'relatedNodes', []).map(node => node.id);
            if (intersection(doubleRelatedIds, tempIds).length > 0) {
              relatedGroupNodes = temp;
              return true;
            }
          });
          if (relatedGroupNodes) {
            this.addVirtualLink(cacheData, links, relatedGroupNodes, node, 'running', true);
          }
        }
      });
    }
  },

  addVirtualLink(cacheData, links, sourceNode, targetNode, status, isGroupLink) {
    if (!sourceNode || !targetNode) {
      return;
    }
    const { dummyGroupLinks } = cacheData;
    const exist = links.some(function(temp) {
      return temp.source && temp.target && temp.source.id === sourceNode.id && temp.target.id === targetNode.id;
    });
    if (!exist) {
      const groupLinkOid = uuid.v4();
      const virtualLink = {
        oid: groupLinkOid,
        id: groupLinkOid,
        source: sourceNode,
        // from: sourceNode,
        target: targetNode,
        // to: targetNode,
        status: status,
        category: 'nodirect',
        name: undefined
      };
      if (isGroupLink) {
        dummyGroupLinks.push(virtualLink);
      }
      links.push(virtualLink);
    }
  },

  generateDummyGroupData(nodeExt, groupCategory, groupName, groupStatus) {
    const defaultCollapsed = nodeExt.defaultCollapsed === false ? false : true;
    // newGroupNode = true;
    const groupNodeOid = 'node_' + uuid.v4();
    const groupNode = VirtualNode.vertex({
      oid: groupNodeOid,
      id: groupNodeOid,
      category: groupCategory,
      name: groupName,
      status: groupStatus,
      visible: defaultCollapsed,
      memberNodes: [],
      objNumber: 0,
      views: ['number'],
      toolbar: []
    });
    return groupNode;
  },

  settingGroupNodeStatusIterator(nodeType, groupNode, node) {
    const nodeCat = node.category;
    switch (nodeCat) {
      default:
    }
  },

  generateGroupData(nodes, { spec }) {
    if (!nodes) {
      return;
    }
    const configs = spec.getConfigs();
    // init
    const styles = {
      ...configs['groupStyles']
    };

    return this.convexRectGroup(nodes, styles);
  },

  // Calculate the rect that surround nodes
  convexRectGroup(nodes, styles) {
    const rects = {};
    const nodeGroups = {};
    const nodesById = {};
    const rectGroups = [];
    nodes.forEach(n => {
      nodesById[n.id] = n;
    });
    const groupColor = styles.groupColor;
    const groupColorOpacity = styles.groupColorOpacity;
    const groupBorderColor = styles.groupBorderColor;

    const bias = styles.bias;
    const offset = styles.offset;
    const updateHiddenGroupPositionWhenDragging = styles.updateHiddenGroupPositionWhenDragging;

    let k = 0;
    while (k < nodes.length) {
      const n = nodes[k];
      if (n && n.groupIds) {
        n.groupIds.forEach(groupId => {
          let groupMemberIds = nodeGroups[groupId];
          if (!groupMemberIds) {
            groupMemberIds = nodeGroups[groupId] = [];
          }
          // avoid NaN
          if (isNaN(n.x)) {
            n.x = 0;
          }
          if (isNaN(n.y)) {
            n.y = 0;
          }
          groupMemberIds.push(n.id);
          if (n) {
            let _r = rects[groupId];
            const x = n.x + bias.x;
            const y = n.y + bias.y;
            if (!_r) {
              // group rects
              _r = rects[groupId] = {};
              _r.minX = x - offset;
              _r.minY = y - offset;
              _r.maxX = x + offset;
              _r.maxY = y + offset;
            } else {
              // group rects
              let temp = x - offset;
              if (temp < _r.minX) {
                _r.minX = temp;
              }
              temp = y - offset;
              if (temp < _r.minY) {
                _r.minY = temp;
              }
              temp = x + offset;
              if (temp > _r.maxX) {
                _r.maxX = temp;
              }
              temp = y + offset;
              if (temp > _r.maxY) {
                _r.maxY = temp;
              }
              // update group node position
              if (updateHiddenGroupPositionWhenDragging) {
                const groupNode = nodesById[n.groupId];
                if (groupNode) {
                  groupNode.x = (_r.minX + _r.maxX) / 2;
                  groupNode.y = (_r.minY + _r.maxY) / 2;
                }
              }
            }
          }
        });
      }
      ++k;
    }

    // i is groupId
    for (const i in rects) {
      if ({}.hasOwnProperty.call(rects, i)) {
        const groupNode = nodesById[i];
        const groupMembers = nodeGroups[i];
        const views = [];
        const toolbar = [];
        if (groupMembers.length > 0 && groupNode.collapsible) {
          // button
          toolbar.push('collapse');
        }
        // group rect
        const position = rects[i];
        // const x = (position.minX + position.maxX) / 2;
        // const y = (position.minY + position.maxY) / 2;

        // inner group deep
        const innerGroupDeep = this.getGroupDeep(nodesById, get(groupNode, 'groupIds'));

        // group opacity
        let groupOpacity = 1;
        if (innerGroupDeep !== 0) {
          const catalyst = 6;
          const factor = 1 - innerGroupDeep / catalyst;
          groupOpacity = groupColorOpacity * (factor > 0.1 ? factor : 0.1);
        } else {
          groupOpacity = groupColorOpacity;
        }

        // group data
        const rect = extend(
          {},
          {
            id: i,
            name: get(groupNode, 'name'),
            category: get(groupNode, 'category'),
            nodeIds: nodeGroups[i], // groupMember ids
            nodeId: i, // group Id
            innerGroupDeep,
            position,
            views,
            toolbar,
            statusStyle: {
              color: groupColor,
              opacity: groupOpacity,
              borderColor: groupBorderColor,
              cornerRadius: 15
            }
          }
        );
        rectGroups.push(rect);
      }
    }
    return rectGroups;
  }
};
