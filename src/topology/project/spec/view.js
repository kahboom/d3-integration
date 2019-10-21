export const view = {
  default: {
    node: {},
    link: {}
  },
  VDC: {
    node: {
      outline: {
        outlineEnabled: true,
        outlinePropertyMap: {
          relativePosition: {
            x: 0,
            y: 0
          }
        }
      },
      linkLabel: {
        linkLabelEnabled: true,
        linkLabelPropertyMap: {
          relativePosition: {
            x: 0,
            y: 0
          }
        }
      }
    }
  },
  VPC: {
    node: {
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
      signing: {
        signingEnabled: true,
        signingPropertyMap: {
          color: '#0A0',
          text: '\uf044',
          relativePosition: {
            x: -8,
            y: -5
          }
        }
      },
      rejection: {
        rejectionEnabled: true,
        rejectionPropertyMap: {
          color: '#f13232',
          text: '\uf044',
          relativePosition: {
            x: -8,
            y: -5
          }
        }
      },
      number: {
        numberEnabled: true,
        numberPropertyMap: {}
      },
      outline: {
        outlineEnabled: true,
        outlinePropertyMap: {
          relativePosition: {
            x: 0,
            y: 0
          }
        }
      },
      linkLabel: {
        linkLabelEnabled: true,
        linkLabelPropertyMap: {
          relativePosition: {
            x: 0,
            y: 0
          }
        }
      }
    },
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
  },
  Weathermap: {
    node: {
      number: {
        numberEnabled: true,
        numberPropertyMap: {}
      },
      colorTag: {
        colorTagEnabled: true,
        colorTagPropertyMap: {
          colors: ['#425ff4', '#cd41f4']
        }
      }
    },
    link: {}
  }
};
