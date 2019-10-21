/**
 * 資料格式
 * data: {
 *  id, from, to, status, zIndex, name,
 *  names:[{id, nameFirst, nameColor, nameFontSize, prefix, prefixColor,
 *  icons:[{icon, iconType, iconSize}], fromTag: {name}, toTag: {name}, tagFontSize, tagColor}]
 * }
 */

import PathLine from './PathLine';
import get from 'lodash/get';
export default class NamesPathLine extends PathLine {
  prefixSize = '25px';
  nameFontSize = '14px';
  nameColor = '#2D2D2D';
  iconColor = '#4c4c4c';
  iconSizeInt = 30;
  lineLabelColor = '#2D2D2D';
  nameLabelFontSize = '12px';
  tagFontSize = '14px';
  tagColor = '#666666';
  appendLineLabel(gDom, data /* , dataStyle*/) {
    super.appendLineLabel(gDom, data);
    const { lineLabelColor } = this;
    const { nodeLabelSize, nodeLabelWeight } = this.props;
    const { shapeGenerator } = this.state;
    // add line label
    const lineDom = shapeGenerator.newText(gDom, {
      attributes: {
        class: 'line-label',
        dy: -5
      },
      styles: {
        fill: lineLabelColor,
        'font-size': nodeLabelSize,
        'font-weight': nodeLabelWeight
      }
    });

    const startOffsetFunc = () => {
      return data.names ? '25%' : '40%';
    };

    const textPathDom = shapeGenerator.newTextPath(lineDom, {
      attributes: {
        startOffset: startOffsetFunc,
        class: 'textPath',
        'xlink:href': function(d) {
          const prefix = d.xlinkHrefPrefix || 'linkId_';
          return `#${prefix}${d.id}`;
        }
      },
      text: function(d) {
        return get(d, 'name', '');
      }
    });
    this.appendPathLineNames(textPathDom, data);
    return gDom;
  }

  appendPathLineName(dom, nameObj) {
    const { nameColor, nameFontSize } = this;
    const { shapeGenerator } = this.state;
    const { util } = this.props.projectState;
    // name
    shapeGenerator.newTextSpan(dom, {
      attributes: {
        id: 'names-value-' + nameObj.id,
        dy: !nameObj.nameFirst ? -5 : undefined
        // dx: -30
      },
      styles: {
        fill: function() {
          return nameObj.nameColor || nameColor;
        },
        'font-size': function() {
          const fontSize = nameObj.nameFontSize || nameFontSize;
          const textLength = get(nameObj.name, 'length', 0);
          nameObj.textLength += textLength * util.getSizeInt(fontSize, 10);
          return fontSize;
        }
      },
      text: function() {
        return nameObj.name || '';
      }
    });
  }

  appendPathLineIcons(dom, nameObj) {
    const { iconColor, iconSizeInt: defaultIconSizeInt, fontAwesomeClass } = this;
    const { shapeGenerator } = this.state;
    const { util } = this.props.projectState;
    const { direction } = nameObj;
    // icons
    const icons = (nameObj.icons = nameObj.icons || []);
    if (direction) {
      if (direction === 'forward') {
        icons.unshift({ icon: '\uf178' });
      } else {
        // backward
        icons.unshift({ icon: '\uf177' });
      }
    }
    icons.forEach((iconObj, index) => {
      const iconType = iconObj.iconType || 'text';
      if (iconType === 'text') {
        const iconSizeInt = util.getSizeInt(iconObj.iconSize, defaultIconSizeInt);
        shapeGenerator.newTextSpan(dom, {
          attributes: {
            id: `names-icon-${nameObj.id}_${index}`,
            dy: index === 0 ? 5 : 0
            // dx: -30
          },
          styles: {
            fill: function() {
              return iconObj.iconColor || iconColor;
            },
            font: function() {
              let fontSize;
              if (iconType === 'text') {
                fontSize = `${iconSizeInt}px "${fontAwesomeClass}"`;
              } else {
                fontSize = `${iconSizeInt}px`;
              }
              const textLength = iconObj.icon ? 1 : 0;
              nameObj.textLength += textLength * iconSizeInt;
              return fontSize;
            }
          },
          text: function() {
            return iconObj.icon + ' ' || ' ';
          }
        });
      }
    });
  }

  appendPathLineNames(textPathDom, data) {
    const { nameLabelFontSize, prefixSize, tagFontSize, tagColor } = this;
    const { shapeGenerator } = this.state;
    const { util } = this.props.projectState;
    if (data && data.names) {
      data.names.forEach((nameObj, index) => {
        let previousNameObj;
        if (index > 0) {
          previousNameObj = data.names[index - 1];
        }
        // name
        const textSpanDom = shapeGenerator.newTextSpan(textPathDom, {
          attributes: {
            id: 'names-decoration-' + nameObj.id,
            class: 'line-names-decoration',
            dy: index < 1 ? 0 : 20,
            dx: index < 1 ? 0 : -get(previousNameObj, 'textLength', 100) + 77
          },
          styles: {
            'font-size': function() {
              if (nameObj.fontSize) {
                return nameObj.fontSize;
              } else {
                return nameLabelFontSize;
              }
            }
          }
        });

        // fromTag
        nameObj.textLength = 0;
        if (nameObj.fromTag) {
          shapeGenerator.newTextSpan(textSpanDom, {
            attributes: {
              id: 'names-fromTag-' + nameObj.id
            },
            styles: {
              fill: function() {
                return nameObj.tagColor || tagColor;
              },
              'fill-opacity': '0.8',
              'font-size': function() {
                const fontSize = nameObj.tagFontSize || tagFontSize;
                const textLength = get(nameObj.fromTag.name, 'length', 0);
                nameObj.textLength += textLength * util.getSizeInt(fontSize, 10);
                return fontSize;
              }
            },
            text: function() {
              return nameObj.fromTag.name + ' ' || ' ';
            }
          });
        }

        // prefix
        shapeGenerator.newTextSpan(textSpanDom, {
          attributes: {
            id: 'names-prefix-' + nameObj.id
          },
          styles: {
            fill: function() {
              if (nameObj.prefixColor) {
                return nameObj.prefixColor;
              } else {
                return 'red';
              }
            },
            'font-size': function() {
              const fontSize = nameObj.prefixSize || prefixSize;
              const textLength = get(nameObj.prefix, 'length', 0);
              nameObj.textLength += textLength * util.getSizeInt(fontSize, 0);
              return fontSize;
            }
          },
          text: function() {
            return nameObj.prefix || '';
          }
        });

        if (nameObj.nameFirst) {
          this.appendPathLineName(textSpanDom, nameObj);
          this.appendPathLineIcons(textSpanDom, nameObj);
        } else {
          this.appendPathLineIcons(textSpanDom, nameObj);
          this.appendPathLineName(textSpanDom, nameObj);
        }

        // toTag
        if (nameObj.toTag) {
          shapeGenerator.newTextSpan(textSpanDom, {
            attributes: {
              id: 'names-toTag-' + nameObj.id,
              dy: nameObj.nameFirst ? -5 : 0,
              dx: 5
            },
            styles: {
              fill: function() {
                return nameObj.tagColor || tagColor;
              },
              'fill-opacity': '0.8',
              'font-size': function() {
                const fontSize = nameObj.tagFontSize || tagFontSize;
                const textLength = get(nameObj.toTag.name, 'length', 0);
                nameObj.textLength += textLength * util.getSizeInt(fontSize, 10);
                return fontSize;
              }
            },
            text: function() {
              return nameObj.toTag.name + ' ' || ' ';
            }
          });
        }
      });
    }
  }
}
