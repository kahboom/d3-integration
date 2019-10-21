/**
 * @description
 *
 * @class NestedGroupLayout
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/23
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/Topology.react';
 * import NetworkTemplate1 from '&/@chttl/topology/src/topology/project/NetworkTemplate1';
 * import NestedGroupLayout from '&/@chttl/topology/src/topology/layout/NestedGroupLayout';
 *
 * class TestLayout extends NestedGroupLayout {
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

import CustomLayout from './CustomLayout';
import get from 'lodash/get';
export default class NestedGroupLayout extends CustomLayout {
  updateRectPositionByMemberPosition(memberNodeData, moveDelta) {
    const { project } = this.props;
    const { mainGroup } = project.state;

    memberNodeData.groupIds.forEach(groupId => {
      this.updateRectPositionByGroupId(groupId);

      const parentGroupData = get(mainGroup.select(`#gnode-${groupId}`).data(), [0]);
      if (parentGroupData.groupIds !== undefined) {
        parentGroupData.groupIds.forEach(parentGroupId => {
          this.updateRectPositionByGroupId(parentGroupId);
        });
      }
    });
    if (memberNodeData.isGroup && moveDelta) {
      this.updateMemberAndRectPositionByGroupNodeAndMoveDelta(memberNodeData, moveDelta);
    }
  }

  updateMemberNodesPosition(groupData, moveDelta) {
    const { project } = this.props;
    const { mainGroup } = project.state;
    const { scale } = this.state;

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
          this.positionGroupNodeByRectPosition(groupData);

          if (member.isGroup) {
            const subGroupData = get(mainGroup.select(`#ggroup-${member.id}`).data(), [0]);
            if (subGroupData) {
              this.moveGroupRectandMemberPosition(subGroupData, moveDelta);
            }
          }

          const groupNodeData = get(mainGroup.select(`#gnode-${groupData.nodeId}`).data(), [0]);
          if (groupNodeData && groupNodeData.groupIds !== undefined) {
            groupNodeData.groupIds.forEach(groupId => {
              this.updateRectPositionByGroupId(groupId);
            });
          }
        }
      });
    }
  }
}
