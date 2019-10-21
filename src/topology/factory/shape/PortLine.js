import SubLine from './SubLine';
const d3 = Object.assign({}, require('d3-selection'));
export default class PortLine extends SubLine {
  appendLine(linkDom, data) {
    super.appendLine(linkDom, data);
    linkDom.select('path').classed('portLine', true);
  }
  findDom(d3Id) {
    if (d3Id) {
      let dom = d3.select(`#${d3Id}`);
      if (!dom.node()) {
        // for network switch port dom
        dom = d3.select(`#${d3Id}-big`);
        if (!dom.node()) {
          dom = d3.select(`#${d3Id}-small`);
        }
      }
      return dom;
    }
  }
}
