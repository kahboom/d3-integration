export const toolbar = {
  default: {
    node: {},
    group: {},
    link: {}
  },
  VPC: {
    node: {
      delete: {
        visible: true,
        deletePropertyMap: {
          color: '#FF1A1A',
          text: '\uf1f8',
          relativePosition: {
            x: -60,
            y: -60
          }
        }
      },
      expand: {
        visible: true,
        expandPropertyMap: {
          color: '#FF930D',
          text: '\uf196',
          relativePosition: {
            x: 5,
            y: -55
          }
        }
      }
    },
    group: {
      collapse: {
        visible: true,
        collapsePropertyMap: {
          color: '#ffa83d',
          text: '\uf147',
          relativePosition: {
            x: 12,
            y: 12
          }
        }
      }
    },
    link: {}
  },
  SiteNetwork: {
    node: {
      expand: {
        visible: true,
        expandPropertyMap: {
          color: '#FF930D',
          text: '\uf196',
          relativePosition: {
            x: 5,
            y: -55
          }
        }
      }
    },
    group: {
      collapse: {
        visible: true,
        collapsePropertyMap: {
          color: '#ffa83d',
          text: '\uf147',
          relativePosition: {
            x: 12,
            y: 12
          }
        }
      }
    },
    link: {}
  },
  Weathermap: {
    node: {
      expand: {
        visible: true,
        expandPropertyMap: {
          color: '#FF930D',
          text: '\uf196',
          relativePosition: {
            x: 5,
            y: -55
          }
        }
      }
    },
    group: {
      collapse: {
        visible: true,
        collapsePropertyMap: {
          color: '#ffa83d',
          text: '\uf147',
          relativePosition: {
            x: 12,
            y: 12
          }
        }
      }
    },
    link: {}
  }
};
