import uuid from 'uuid';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  getVirtualRelationsByVertex: function({ vertex, currentVirtualNodes }) {
    const me = this;
    const result = { vertexSet: [], edgeSet: [] };
    const relationsLinkCounter = vertex.relationsLinkCounter;
    const serviceTemplate = vertex.serviceTemplate;
    if (relationsLinkCounter && serviceTemplate && vertex.status === 'running') {
      const relations = serviceTemplate.relations;
      if (relations) {
        const keys = Object.keys(relations);
        keys.forEach(index => {
          const relation = relations[index];
          const linkToCategory = relation.linkTo;
          const linkToServiceTemplate = relation.linkToServiceTemplate;
          if (linkToServiceTemplate) {
            const max = relation.max || linkToServiceTemplate.max;
            if (max > relationsLinkCounter[linkToCategory]) {
              let isExist = false;
              if (currentVirtualNodes) {
                currentVirtualNodes.some(function(vn) {
                  if (vn.category === linkToCategory) {
                    isExist = true;
                    return true;
                  }
                });
              }
              if (!isExist) {
                const virtualNode = me.vertex({
                  category: linkToCategory,
                  projectId: vertex.projectId,
                  serviceId: vertex.propertyMap.serviceId,
                  status: 'extend',
                  depth: linkToServiceTemplate.depth,
                  serviceTemplate: linkToServiceTemplate
                });
                if (virtualNode) {
                  result.vertexSet.push(virtualNode);
                  const virtualLink = me.edge(vertex, virtualNode);
                  if (virtualLink) {
                    result.edgeSet.push(virtualLink);
                  }
                }
              }
            }
          }
        });
      }
    }
    return result;
  },
  vertex: function(options) {
    if (!options) {
      return undefined;
    }
    const node = {
      location: undefined,
      // "type": options.type, // || "networkFunction",
      label: undefined,
      category: options.category, // || "privateSubnet",
      oid: uuid.v4(),
      projectId: options.projectId,
      name: options.name || options.category, // || "privateSubnet",
      createTime: undefined,
      updateTime: undefined,
      status: options.status,
      depth: options.depth || 1,
      visible: options.visible,
      views: options.views,
      relationsLinkCounter: {},
      isNative: false, // for delete button
      metaDataMap: undefined
    };
    return defaultsDeep(node, options);
  },
  edge: function(sourceVertex, destVertex) {
    if (!sourceVertex || !destVertex) {
      return null;
    }
    return {
      id: uuid.v4(),
      from: sourceVertex,
      to: destVertex
    };
  }
};
