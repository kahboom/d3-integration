/**
 * @class topology/topology/project/Topology2D
 * @param {object} props - ex. {identifier, projectName, width, height...}
 * @author Samuel Hsin
 * @since 2019/04/17
 *
 * @example <caption> Example </caption>s
 * import Topology from '&/@chttl/topology/src/topology/D3Component';
 * import Topology2D from '&/@chttl/topology/src/topology/project/Topology2D';
 *
 * // ./customTopology/projectFolder/TestProject.js
 * export default class TestProject extends Topology2D {
 *  // override function
 *  // available overrided stubs
 *  beforeProcessNodes() {}
 *  startProcessNodes() {}
 *  addNodeContent() {}
 *  bindingNodeSelectEvent() {}
 *  updateNodeContent() {}
 *  removeNode() {}
 *  beforeProcessLinks() {}
 *  startProcessLinks() {}
 *  addLinkContent() {}
 *  bindingLinkSelectEvent() {}
 *  updateLinkContent() {}
 *  removeLink() {}
 *  beforeProcessGroups() {}
 *  startProcessGroups() {}
 *  addGroupContent() {}
 *  updateGroupContent() {}
 *  removeGroup() {}
 * }
 *
 * <Topology identifier="topology" mode="2d" projectPath={'./customTopology/projectFolder'} projectName={'TestProject'}
 *  data={{nodes: [], links: []}} width={300} height={300} enableGroup />
 *
 */

import Based from './Based';
import d3TopoUtil from '../util/d3TopoUtil';
import { setup as setupSpec } from '../util/SpecHelper';
import DefaultAnimation from '../util/animation/DefaultAnimation';
import DefaultLayout from '../layout/DefaultLayout';
import { configs as configsPrototype } from './spec/configs';
import { nodeType as nodeTypePrototype } from './spec/nodeType';
import { linkType as linkTypePrototype } from './spec/linkType';
import { status as statusPrototype } from './spec/status';
import { view as viewPrototype } from './spec/view';
import { toolbar as toolbarPrototype } from './spec/toolbar';
import get from 'lodash/get';
import defaultsDeep from 'lodash/defaultsDeep';
const d3 = Object.assign({}, require('d3-selection'));
export default class Topology2D extends Based {
  init() {
    super.init();
    const { identifier, projectName, configs, nodeType, linkType, status, view, toolbar } = this.props;

    // merge spec
    const configsSpec = this.initSpec(this.getSpecByProject({ configs }).configs, this.getSpecByProject({ configs: configsPrototype }).configs);
    const nodeTypeSpec = this.initSpec(this.getSpecByProject({ nodeType }).nodeType, this.getSpecByProject({ nodeType: nodeTypePrototype }).nodeType);
    const linkTypeSpec = this.initSpec(this.getSpecByProject({ linkType }).linkType, this.getSpecByProject({ linkType: linkTypePrototype }).linkType);
    const statusSpec = this.initSpec(this.getSpecByProject({ status }).status, this.getSpecByProject({ status: statusPrototype }).status);
    const viewSpec = this.initSpec(this.getSpecByProject({ view }).view, this.getSpecByProject({ view: viewPrototype }).view);
    const toolbarSpec = this.initSpec(this.getSpecByProject({ toolbar }).toolbar, this.getSpecByProject({ toolbar: toolbarPrototype }).toolbar);
    const animation = new DefaultAnimation(this.props);
    const helper = setupSpec({ identifier, projectName, configs: configsSpec, nodeTypeSpec, linkTypeSpec, statusSpec, viewSpec, toolbarSpec });
    // setting state
    this.state.spec = helper;
    this.state.util = d3TopoUtil;
    this.state.animation = animation;
    this.state.layout = this.layout(this.props);
    this.state.factory = {};
  }
  initSpec(spec, prototypeSpec) {
    return spec ? defaultsDeep({}, spec, prototypeSpec) : prototypeSpec;
  }
  layout(props) {
    return new DefaultLayout({ ...props, util: this.state.util, spec: this.state.spec, project: this });
  }
  getSpecByProject({ configs, nodeType, linkType, status, view, toolbar }) {
    const spec = {};
    const { projectName } = this.props;
    const getProjectData = (obj, projectName) => {
      let data = get(obj, projectName);
      if (!data) {
        data = get(obj, 'default');
      }
      return data;
    };
    spec.configs = getProjectData(configs, projectName);
    spec.nodeType = getProjectData(nodeType, projectName);
    spec.linkType = getProjectData(linkType, projectName);
    spec.status = getProjectData(status, projectName);
    spec.view = getProjectData(view, projectName);
    spec.toolbar = getProjectData(toolbar, projectName);
    return spec;
  }
  initiated() {
    const { mainGroupStyleClass } = this.props;
    this.state.mainGroup = d3.select(`g.${mainGroupStyleClass}`);
  }
  /**
    basic functions
  */
  getFactoryKeyByType(type) {
    const { factory } = this.state;
    return type ? Object.keys(factory).find(k => k.toLowerCase() === type.toLowerCase()) : undefined;
  }

  /* stubs */
  beforeProcessNodes() {}
  startProcessNodes() {}
  addNodeContent() {}
  bindingNodeSelectEvent() {}
  updateNodeContent() {}
  removeNode() {}

  beforeProcessLinks() {}
  startProcessLinks() {}
  addLinkContent() {}
  bindingLinkSelectEvent() {}
  updateLinkContent() {}
  removeLink() {}

  beforeProcessGroups() {}
  startProcessGroups() {}
  addGroupContent() {}
  updateGroupContent() {}
  removeGroup() {}
}
