export const view = {
  default: {
    node: {},
    link: {}
  },
  SiteNetwork: {
    node: {
      lock: {
        lockEnabled: true,
        lockPropertyMap: {
          color: '#333',
          text: '\uf023',
          relativePosition: {
            x: -8,
            y: -50
          }
        }
      },
      setting: {
        settingEnabled: true,
        settingPropertyMap: {
          color: '#FF930D',
          text: '\uf021',
          relativePosition: {
            x: -13,
            y: -5
          }
        },
        animate: {
          rotate: true,
          rotateTargetClass: 'node-setting-view'
        }
      },
      number: {
        numberEnabled: true,
        numberPropertyMap: {}
      },
      colorTag: {
        colorTagEnabled: true,
        colorTagPropertyMap: {
          colors: ['#425ff4', '#cd41f4']
        }
      },
      disconnection: {
        disconnectionEnabled: true,
        disconnectionPropertyMap: {
          color: 'red',
          fontSize: 30,
          // fontWeight: 'bold',
          textType: 'icon',
          text: '\uf00d',
          relativePosition: {
            x: 8,
            y: -5
          }
        }
      }
    },
    link: {}
  }
};
