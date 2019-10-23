import uuid from 'uuid';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  vertex: function(options) {
    if (!options) {
      return undefined;
    }
    const node = {
      location: undefined,
      label: undefined,
      category: options.category,
      oid: uuid.v4(),
      projectId: options.projectId,
      name: options.name || options.category,
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
  }
};
