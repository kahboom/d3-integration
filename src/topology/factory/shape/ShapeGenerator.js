// import _ from 'lodash';
// import uuid from 'uuid';

export const ShapeGenerator = {};

ShapeGenerator.newCircle = function(parentDom, { attributes, styles, events }) {
  const dom = parentDom.append('circle');
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.circle = function(dom, { attributes, styles, events }) {
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.newRect = function(parentDom, { attributes, styles, events }) {
  const dom = parentDom.append('rect');
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.rect = function(dom, { attributes, styles, events }) {
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.newText = function(parentDom, { attributes, styles, events, text }) {
  const dom = parentDom.append('text');
  this.settingCommonConfig(dom, { attributes, styles, events, text });
  return dom;
};

ShapeGenerator.text = function(dom, { attributes, styles, events }) {
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.newPath = function(parentDom, { attributes, styles, events }) {
  const dom = parentDom.append('path');
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.path = function(dom, { attributes, styles, events }) {
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.newTextPath = function(parentDom, { attributes, styles, events, text }) {
  const dom = parentDom.append('textPath');
  this.settingCommonConfig(dom, { attributes, styles, events, text });
  return dom;
};

ShapeGenerator.newMarker = function(parentDom, { attributes, styles, events, text }) {
  const dom = parentDom.append('marker');
  this.settingCommonConfig(dom, { attributes, styles, events, text });
  return dom;
};

ShapeGenerator.newTextSpan = function(parentDom, { attributes, styles, events, text }) {
  const dom = parentDom.append('tspan');
  this.settingCommonConfig(dom, { attributes, styles, events, text });
  return dom;
};

ShapeGenerator.textSpan = function(dom, { attributes, styles, events, text }) {
  this.settingCommonConfig(dom, { attributes, styles, events, text });
  return dom;
};

ShapeGenerator.newImage = function(parentDom, { attributes, styles, events }) {
  const dom = parentDom.append('image');
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.newG = function(parentDom, { attributes, styles, events }) {
  const dom = parentDom.append('g');
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.g = function(dom, { attributes, styles, events }) {
  this.settingCommonConfig(dom, { attributes, styles, events });
  return dom;
};

ShapeGenerator.settingAttrs = function(dom, attributes) {
  const attributeKeys = Object.keys(attributes);
  attributeKeys.forEach(key => {
    dom.attr(key, attributes[key]);
  });
  return dom;
};

ShapeGenerator.settingCommonConfig = function(dom, { attributes, styles, events, text }) {
  if (attributes) {
    this.settingAttrs(dom, attributes);
  }
  if (styles) {
    this.settingStyles(dom, styles);
  }
  if (events) {
    this.settingEvents(dom, events);
  }
  if (text) {
    this.settingText(dom, text);
  }
  return dom;
};

ShapeGenerator.settingStyles = function(dom, styles) {
  const keys = Object.keys(styles);
  keys.forEach(key => {
    dom.style(key, styles[key]);
  });
  return dom;
};

ShapeGenerator.settingText = function(dom, text) {
  dom.text(text);
  return dom;
};

ShapeGenerator.settingEvents = function(dom, events) {
  const keys = Object.keys(events);
  keys.forEach(key => {
    dom.on(key, events[key]);
  });
  return dom;
};
