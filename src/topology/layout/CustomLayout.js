/**
 * @class CustomLayout
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import CustomLayout from '&/@chttl/topology/src/topology/layout/CustomLayout';
 *
 * class TestLayout extends CustomLayout {
 *  //override functions
 *  initNodePosition(existedPositions, node) {
 *   returnthis.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
 *  }
 *  tick({type}){
 *   // do something
 *  }
 * }
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Based {
 *  // override layout
 *  layout(props) {
 *    return new TestLayout({ ...props, util: this.state.util, spec: this.state.spec, project: this });
 *  }
 * }
 *
 *
 */

import DefaultLayout from './DefaultLayout';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import { event as d3Event } from 'd3-selection';
const d3 = Object.assign({}, require('d3-selection'), require('d3-drag'));
export default class CustomLayout extends DefaultLayout {
  init() {
    super.init();
  }
  dragNode(dom) {
    const { scale } = this.state;
    const me = this;
    const onStart = () => {
      super.dragStart();
      const { sourceEvent, x, y } = d3Event;
      // 當點擊的對象是toolbar的按鈕時，不視為是進行拖曳的動作
      if (super.skipPointerDownEvent(sourceEvent)) {
        sourceEvent.stopPropagation();
      } else {
        // raise是把dom的堆疊提到最高
        // dom.raise().classed('dragging', true);
        dom.classed('dragging', true);
      }
      const dragPosition = { dragX: x, dragY: y };
      me.tempDragPosition = dragPosition;
    };
    const onDrag = data => {
      super.dragging();
      const draggable = get(data, 'draggable', true);
      if (draggable) {
        const { x, y } = d3Event;
        const dragPosition = { dragX: x, dragY: y };
        const moveDelta = this.getDragPositionDelta(dragPosition, me.tempDragPosition);
        // update data position
        data.x = x;
        data.y = y;
        dom.attr('transform', `translate(${x}, ${y}) scale(${scale})`);

        invoke(me, 'tick', { type: 'link', data, moveDelta });
        // 如果拖曳的點是群組點或子成員點，則觸發group tick
        if (data.isGroup || data.groupable) {
          invoke(me, 'tick', { type: 'group', data, moveDelta });
        }
        // 更新移動點
        me.tempDragPosition = dragPosition;
      }
    };
    const onEnd = () => {
      super.dragEnd();
      dom.classed('dragging', false);
      delete me.tempDragPosition;
    };
    return d3
      .drag()
      .on('start', onStart)
      .on('drag', onDrag)
      .on('end', onEnd);
  }
  dragGroup(dom) {
    const me = this;
    const onStart = data => {
      super.dragStart(dom, data);
      const { sourceEvent, x, y } = d3Event;
      // 當點擊的對象是toolbar的按鈕時，不視為是進行拖曳的動作
      if (super.skipPointerDownEvent(sourceEvent)) {
        sourceEvent.stopPropagation();
      } else {
        dom.classed('dragging', true);
      }
      const dragPosition = { dragX: x, dragY: y };
      me.tempDragPosition = dragPosition;
    };
    const onDrag = data => {
      super.dragging(dom, data);
      const { x, y } = d3Event;
      const dragPosition = { dragX: x, dragY: y };
      const moveDelta = this.getDragPositionDelta(dragPosition, me.tempDragPosition);
      // 根據移動量更新灰底以及子點的位置
      this.moveGroupRectandMemberPosition(data, moveDelta);
      // 更新移動點
      me.tempDragPosition = dragPosition;
    };
    const onEnd = data => {
      super.dragEnd(dom, data);
      dom.classed('dragging', false);
      delete me.tempDragPosition;
    };
    return d3
      .drag()
      .on('start', onStart)
      .on('drag', onDrag)
      .on('end', onEnd);
  }
  initNodePosition(existedPositions, node) {
    let position;
    if (node && node.category && (node.x === undefined || node.y === undefined)) {
      switch (node.category) {
        default:
          position = this.getAvailablePosition(existedPositions, { x: 0, y: 0 }, { direction: 'hRight' });
      }
    }
    return position;
  }
  nodes(nodes) {
    if (!nodes) {
      return;
    }
    // existed positions
    const positions = [];
    const { spec, util, initNodeAdditionalDistance } = this.props;
    const configs = spec.getConfigs();
    const groupNodes = [];
    const nodesByGroupId = {};
    const nodesById = {};
    nodes.forEach(n => {
      nodesById[n.id] = n;
      if (n.groupIds) {
        n.groupIds.forEach(groupId => {
          const array = (nodesByGroupId[groupId] = nodesByGroupId[groupId] || []);
          array.push(n);
        });
      }
    });
    const storedPosition = n => {
      // 不考慮已經指定位置的點
      if (n.x !== undefined && n.y !== undefined) {
        // if (n.isExpand === false) {
        //   //考慮收合的群組點
        //   positions.push({ x: n.x, y: n.y });
        // } else if (n.groupIds) {
        //   //考慮展開的子點
        //   let expanded = n.groupIds.findIndex(id => {
        //     return get(nodesById, ['id', 'isExpand']) === true;
        //   });
        //   if (expanded) {
        //     positions.push({ x: n.x, y: n.y });
        //   }
        // }
        positions.push({ x: n.x, y: n.y });
      }
    };
    // 先初始化positions
    nodes.forEach(n => {
      storedPosition(n);
    });
    const settingPosition = (n, newPosition) => {
      n.x = newPosition.x;
      n.y = newPosition.y;
      storedPosition(n);
    };
    // 給每一個點定一個排列位置
    nodes.forEach(n => {
      // class by category
      const position = this.initNodePosition(positions, n, { nodesByGroupId });
      if (position) {
        settingPosition(n, position);
      }
      if (n.isGroup) {
        groupNodes.push(n);
      }
      // 若initNodeAdditionalDistance有值，代表要拉長 線的距離
      // 不針對群組子點擴展，因為群組子點會於下方程式根據群組點進行修正
      if (initNodeAdditionalDistance !== undefined && !n.groupIds) {
        util.distanceNodePosition({ node: n, additionalDistance: initNodeAdditionalDistance, isExpand: true });
      }
    });
    // 移動group node的子點的位置根據群組點的中心點
    groupNodes.forEach(groupNode => {
      const members = nodesByGroupId[groupNode.id];
      if (members) {
        // 透過群組點以及rect中心點的差距來位移
        const rectPosition = this.getRectPositionByMembers(null, members, configs);
        const rectCenter = { x: (rectPosition.minX + rectPosition.maxX) / 2, y: (rectPosition.minY + rectPosition.maxY) / 2 };
        const moveDelta = { x: groupNode.x - rectCenter.x, y: groupNode.y - rectCenter.y };
        members.forEach(member => {
          member.x += moveDelta.x;
          member.y += moveDelta.y;
        });
      }
    });
    return nodes;
  }
  links(links) {
    return links;
  }
  tick({ type, data = {}, moveDelta = { dx: 0, dy: 0 } }) {
    const { project } = this.props;
    const { mainGroup, factory } = project.state;
    if (type === 'link') {
      mainGroup.selectAll('g.link').each(function(d) {
        // eslint-disable-next-line no-invalid-this
        const gDom = d3.select(this);
        // update link position
        gDom.select('path.link').attr('d', () => {
          return invoke(factory['pathLine'], 'getLinkPathPosition', { data: d });
        });
        // update link label position
        if (d.label) {
          invoke(project, 'refreshLineLabelPosition', gDom, d);
        }
      });
    } else if (type === 'group') {
      const isMember = data.groupable;
      if (isMember) {
        // 移動子成員點
        this.updateRectPositionByMemberPosition(data, moveDelta);
      } else {
        // 移動群組點
        this.updateMemberAndRectPositionByGroupNodeAndMoveDelta(data, moveDelta);
      }
    }
  }

  updateMemberAndRectPositionByGroupNodeAndMoveDelta(groupNodeData, moveDelta) {
    const { project } = this.props;
    const { mainGroup } = project.state;
    // 根據群組點移動量更新灰底以及子點的位置
    const groupData = get(mainGroup.select(`#ggroup-${groupNodeData.id}`).data(), [0]);
    if (groupData) {
      this.moveGroupRectandMemberPosition(groupData, moveDelta);
    }
  }

  updateRectPositionByMemberPosition(memberNodeData) {
    // 由子點找到群組點，更新此群組點展開之灰底位置
    memberNodeData.groupIds.forEach(groupId => {
      this.updateRectPositionByGroupId(groupId);
    });
  }

  updateRectPositionByGroupId(groupId) {
    // 由一個群組點的角度去尋找所展開的灰底，對整個灰底內的子點做一次position計算更新灰底
    // member positions => rect scope position
    const me = this;
    const { project, spec } = this.props;
    const { mainGroup } = project.state;
    const configs = spec.getConfigs();
    const groupDom = mainGroup.select(`#ggroup-${groupId}`);
    if (groupDom.nodes()) {
      const groupData = get(groupDom.data(), [0]);
      if (groupData) {
        const groupMemberIds = groupData.nodeIds || [];
        let rectPosition = groupData.position;
        groupMemberIds.forEach((memberId, index) => {
          const member = get(mainGroup.select(`#gnode-${memberId}`).data(), [0]);
          if (member) {
            rectPosition = me.getRectPositionByMember(rectPosition, member, index, configs);
            // 更新群組點基於移動Group Rect範圍
            me.positionGroupNodeByRectPosition(groupData);
          }
        });
        // 修正group rect以及collapse button的位置
        project.updateGroupContent(groupDom, groupData);
      }
    }
  }

  // 根據單一member的位置來判斷rect position
  getRectPositionByMember(rectPosition, member, index, configs) {
    rectPosition = rectPosition || { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    index = index || 0;
    const bias = configs.groupStyles.bias;
    const offset = configs.groupStyles.offset;
    if (member) {
      const x = member.x + bias.x;
      const y = member.y + bias.y;
      const tempMinX = x - offset;
      const tempMaxX = x + offset;
      const tempMinY = y - offset;
      const tempMaxY = y + offset;
      if (index === 0) {
        // reset group position
        rectPosition.minX = tempMinX;
        rectPosition.minY = tempMinY;
        rectPosition.maxX = tempMaxX;
        rectPosition.maxY = tempMaxY;
      }
      if (tempMinX < rectPosition.minX) {
        rectPosition.minX = tempMinX;
      }
      if (tempMinY < rectPosition.minY) {
        rectPosition.minY = tempMinY;
      }
      if (tempMaxX > rectPosition.maxX) {
        rectPosition.maxX = tempMaxX;
      }
      if (tempMaxY > rectPosition.maxY) {
        rectPosition.maxY = tempMaxY;
      }
    }
    return rectPosition;
  }
  // 根據多個member的位置來判斷rect position
  getRectPositionByMembers(rectPosition, members, configs) {
    rectPosition = rectPosition || { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    if (members) {
      members.forEach((member, index) => {
        rectPosition = this.getRectPositionByMember(rectPosition, member, index, configs);
      });
    }
    return rectPosition;
  }
  getDragPositionDelta(newPosition, originalPosition) {
    const result = { dx: 0, dy: 0 };
    if (originalPosition && originalPosition) {
      result.dx = newPosition.dragX - originalPosition.dragX;
      result.dy = newPosition.dragY - originalPosition.dragY;
    }
    return result;
  }
  moveGroupRectandMemberPosition(groupData, moveDelta) {
    // 依據移動量，同步移動灰框及框內的子點位置，並修正線的位置
    if (!groupData || !moveDelta) {
      return;
    }
    const { project } = this.props;
    const { mainGroup } = project.state;
    const groupRectDom = mainGroup.select(`#${groupData.d3Id}`);
    if (groupRectDom.node()) {
      const rectPosition = groupData.position;
      // 將移動量修正到d.position
      rectPosition.minX += moveDelta.dx;
      rectPosition.maxX += moveDelta.dx;
      rectPosition.minY += moveDelta.dy;
      rectPosition.maxY += moveDelta.dy;

      // 修正group rect以及collapse button的位置
      project.updateGroupContent(groupRectDom, groupData);

      // 修改子點位置
      this.updateMemberNodesPosition(groupData, moveDelta);

      // 修正線的位置
      this.tick({ type: 'link' });
    }
  }

  updateMemberNodesPosition(groupData, moveDelta) {
    const { project } = this.props;
    const { mainGroup } = project.state;
    const { scale } = this.state;
    // 同步修改所有子點的位置
    const groupMemberIds = groupData.nodeIds || [];
    if (groupMemberIds && groupMemberIds.length > 0) {
      groupMemberIds.forEach(nodeId => {
        const memberDom = mainGroup.select(`#gnode-${nodeId}`);
        const member = get(memberDom.data(), [0]);
        if (member && member.x !== undefined && member.y !== undefined) {
          member.x += moveDelta.dx;
          member.y += moveDelta.dy;
          memberDom.attr('transform', `translate(${member.x}, ${member.y}) scale(${scale})`);
        }
        if (groupData.nodeId) {
          // 修改群組點的位置
          this.positionGroupNodeByRectPosition(groupData);
        }
      });
    }
  }

  positionGroupNodeByRectPosition(groupData) {
    const { scale } = this.state;
    const { project } = this.props;
    const { mainGroup } = project.state;
    const groupDom = mainGroup.select(`#gnode-${groupData.nodeId}`);
    const rectPosition = groupData.position;
    const group = get(groupDom.data(), [0]);
    group.x = (rectPosition.minX + rectPosition.maxX) / 2;
    group.y = (rectPosition.minY + rectPosition.maxY) / 2;
    groupDom.attr('transform', `translate(${group.x}, ${group.y}) scale(${scale})`);
  }
}
