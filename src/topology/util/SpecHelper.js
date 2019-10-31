import d3TopoUtil from './d3TopoUtil';
import defaultsDeep from 'lodash/defaultsDeep';
import isEmpty from 'lodash/isEmpty';

const d3 = Object.assign({}, require('d3-scale'), require('d3-scale-chromatic'), require('d3-shape'));
const configurations = {};

export function setup({ identifier, projectName, configs, nodeTypeSpec, linkTypeSpec, statusSpec, viewSpec, toolbarSpec }) {
  if (!identifier) {
    identifier = 'unknown';
  }

  const configuration = (configurations[identifier] = {});
  d3TopoUtil.replaceIconByBrowser(nodeTypeSpec);
  const nodeTypeKeys = nodeTypeSpec ? Object.keys(nodeTypeSpec) : [];

  configuration['projectName'] = projectName;
  configuration['configs'] = configs;
  configuration['nodeType'] = nodeTypeSpec;
  configuration['nodeTypeKeys'] = nodeTypeKeys;
  configuration['linkType'] = linkTypeSpec;

  configuration['status'] = statusSpec;
  configuration['nodeStatus'] = statusSpec['node'];
  configuration['linkStatus'] = statusSpec['link'];
  configuration['defaultStatus'] = {
    color: 'black'
  };

  configuration['view'] = viewSpec;
  configuration['nodeView'] = viewSpec['node'];
  configuration['linkView'] = viewSpec['link'];

  configuration['toolbar'] = toolbarSpec;
  configuration['nodeToolbar'] = toolbarSpec['node'];
  configuration['groupToolbar'] = toolbarSpec['group'];
  configuration['linkToolbar'] = toolbarSpec['link'];

  return new Helper(configuration);
}

class Helper {
  configuration;
  utils;

  constructor(configuration) {
    this.configuration = configuration;
    this.initD3Utils();
  }

  initD3Utils() {
    this.utils = {};
    this.utils.colors = d3.scaleOrdinal(d3.schemeCategory10);

    this.utils.curve = d3
      .line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .curve(d3.curveLinear);
  }

  getProjectName() {
    return this.configuration['projectName'];
  }

  getConfigs() {
    return this.configuration['configs'];
  }

  getNodeType() {
    return this.configuration['nodeType'];
  }

  getNodeTypeKeys() {
    return this.configuration['nodeTypeKeys'];
  }

  getNodeStatus() {
    return this.configuration['nodeStatus'];
  }

  getLinkStatus() {
    return this.configuration['linkStatus'];
  }

  // drawType : node or  link
  // mapping by 'category'
  findTypeStyle(data, drawType) {
    const category = data.category;
    const NodeType = this.configuration['nodeType'];
    const LinkType = this.configuration['linkType'];
    let typeStyle = {};
    const typeObj = drawType === 'node' ? NodeType : LinkType;

    if (category && typeObj[category]) {
      typeStyle = typeObj[category];
    } else {
      typeStyle = typeObj['default'];
    }
    return typeStyle;
  }

  // drawType : node or link
  // mapping by 'status' and 'views'
  findDataStyle(data, drawType) {
    // console.debug('find status style !');
    let dataStyle;
    const statusStyle = this.findStatusStyle(data, drawType);
    const views = data.views;

    if (views && views.length > 0) {
      const viewsStyle = this.findViewsStyle(data, drawType);
      dataStyle = defaultsDeep({}, statusStyle, ...viewsStyle);
    } else {
      dataStyle = statusStyle;
    }
    return dataStyle;
  }

  // drawType : node or link
  // mapping by 'views'
  findViewsStyle(data, drawType) {
    // console.debug('find views style !');
    let viewsStyle;
    const views = data.views;

    if (views && views.length > 0) {
      if (drawType === 'node') {
        viewsStyle = views.map(view => this.findViewStyle(view, drawType));
      } else {
        viewsStyle = views.map(view => this.findViewStyle(view, drawType));
      }
    }

    if (!viewsStyle) {
      viewsStyle = [];
    }
    return viewsStyle;
  }

  // drawType : node or link
  // mapping by 'views'
  findViewStyle(view, drawType) {
    // console.debug('find views style !');
    let viewStyle = {};
    const NodeView = this.configuration['nodeView'];
    const LinkView = this.configuration['linkView'];

    if (view) {
      const mainView = view.split('-')[0];
      if (drawType === 'node') {
        viewStyle = NodeView[mainView];
      } else {
        viewStyle = LinkView[mainView];
      }
    }

    if (!viewStyle) {
      viewStyle = {};
    }

    return viewStyle;
  }

  // drawType : node or link
  // mapping by 'toolbar'
  findToolbarStyle(data, drawType) {
    // console.debug('find views style !');
    let toolbarStyle;
    const toolbar = data.toolbar;
    const NodeToolbar = this.configuration['nodeToolbar'];
    const GroupToolbar = this.configuration['groupToolbar'];
    const LinkToolbar = this.configuration['linkToolbar'];

    if (toolbar && toolbar.length > 0) {
      if (drawType === 'node') {
        toolbarStyle = NodeToolbar;
      } else if (drawType === 'group') {
        toolbarStyle = GroupToolbar;
      } else {
        toolbarStyle = LinkToolbar;
      }
    }

    if (!toolbarStyle) {
      toolbarStyle = {};
    }
    return toolbarStyle;
  }

  // drawType : node or link
  // mapping by 'status'
  findStatusStyle(data, drawType) {
    // console.debug('find status style !');
    let statusStyle = {};
    const status = data.status;
    const NodeStatus = this.configuration['nodeStatus'];
    const LinkStatus = this.configuration['linkStatus'];
    const DefaultStatus = this.configuration['defaultStatus'];

    if (status) {
      if (drawType === 'node') {
        statusStyle = NodeStatus[status];
        if (isEmpty(statusStyle)) {
          statusStyle = DefaultStatus;
          // console.warn("[Topology] Status not defined in category : '", data.category, "', status : '", status, "'", data.id);
        }

        statusStyle = this.hiddenPolicy(data, statusStyle);
      } else {
        statusStyle = LinkStatus[status];
      }
    } else {
      if (NodeStatus['none']) {
        statusStyle = NodeStatus['none'];
        statusStyle = this.hiddenPolicy(data, statusStyle);
      }
      // console.warn('[Topology] You need \'status\' in your data!', drawType, data.id, data.category);
    }

    return statusStyle;
  }

  hiddenPolicy(data, statusStyle) {
    // console.debug('hiddenPolicy', data, statusStyle);
    if (data.type === 'Service') {
      // console.debug('hiddenPolicy --> Service', data, statusStyle);
      statusStyle.visibility = false;
    }

    return statusStyle;
  }
}
