export const status = {
  default: {
    node: {
      warning: {
        icon: '\uf071',
        color: 'rgb(240, 173, 78)'
      },
      error: {
        icon: '\uf057',
        color: 'rgb(231, 96, 73)'
      },
      normal: {
        icon: '\uf058',
        color: 'rgb(26, 187, 156)'
      }
    },
    link: {
      up: {
        color: 'rgb(240, 173, 78)'
      },
      down: {
        icon: '\uf057',
        color: 'rgb(231, 96, 73)'
      },
      warning: {
        icon: '\uf071',
        color: 'rgb(240, 173, 78)'
      }
    }
  },
  VDC: {
    node: {}
  },
  VPC: {
    node: {
      none: {
        visibility: false
      },
      unknown: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      error: {
        // icon: '\uf00d',
        color: 'rgb(231, 96, 73)'
      },
      delete: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
        },
        // color: 'rgb(231, 96, 73)',
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      disable: {
        visibility: false
      },
      extend: {
        visibility: false,
        dash: true
      },
      preview: {
        color: 'rgb(102, 102, 102)',
        backgroundColor: 'rgb(229, 229, 229)',
        dash: true
      },
      container: {
        color: '#0A0'
      },
      $status: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      stopped: {
        color: 'grey',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      empty: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      provision: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
        },
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      update: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      signing: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)',
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
        }
      },
      rejection: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      provision_fail: {
        color: 'rgb(231, 96, 73)',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      update_fail: {
        color: 'rgb(231, 96, 73)',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      delete_fail: {
        color: 'rgb(231, 96, 73)',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      running: {
        color: '#0A0'
      }
    },
    link: {}
  },
  SiteNetwork: {
    node: {
      running: {
        // color: 'rgb(9, 205, 76)'
        color: '#0A0'
      },
      provision: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon',
          liquidFillGauge: true,
          liquidFillGaugeUseMainCircle: false,
          liquidFillGaugeTextXPosition: 0.5,
          liquidFillGaugeTextYPosition: 0.5,
          liquidFillGaugeCircleXPosition: -40,
          liquidFillGaugeCircleYPosition: 25,
          liquidFillGaugeCircleColor: '#cee8ff',
          liquidFillGaugeWaveTextColor: '#000',
          liquidFillGaugeTextFontWeight: 900,
          liquidFillGaugeTextFontSize: 1
        },
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      active: {
        // color: 'rgb(9, 205, 76)'
        color: '#0A0'
      },
      inactive: {
        color: 'grey'
      },
      building: {
        color: 'grey'
      },
      empty: {
        color: 'grey',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      stopped: {
        color: 'grey',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      up: {
        color: '#0A0'
      },
      down: {
        color: 'grey'
      },
      broken: {
        color: '#e76049'
      },
      deleting: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
        },
        color: 'rgb(231, 96, 73)',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      update: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      enable: {
        color: '#0A0'
      },
      disable: {
        color: 'grey'
      }
    },
    link: {
      enable: {
        color: '#0A0'
      },
      disable: {
        color: '#e76049'
      }
    }
  },
  Weathermap: {
    node: {
      running: {
        // color: 'rgb(9, 205, 76)'
        color: '#0A0'
      },
      provision: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
          // liquidFillGauge: true,
          // liquidFillGaugeUseMainCircle: false,
          // liquidFillGaugeTextXPosition: 0.5,
          // liquidFillGaugeTextYPosition: 0.5,
          // liquidFillGaugeCircleXPosition: 42,
          // liquidFillGaugeCircleYPosition: 20,
          // liquidFillGaugeCircleColor: '#cee8ff',
          // liquidFillGaugeWaveTextColor: '#000',
          // liquidFillGaugeTextFontWeight: 900,
          // liquidFillGaugeTextFontSize: 1
        },
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      provision_fail: {
        color: 'grey'
      },
      active: {
        color: '#0A0'
      },
      inactive: {
        color: 'grey'
      },
      building: {
        color: 'grey'
      },
      up: {
        color: '#0A0'
      },
      down: {
        color: 'grey'
      },
      deleting: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
        },
        color: 'rgb(231, 96, 73)',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      delete_fail: {
        color: 'rgb(231, 96, 73)',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      update: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      repair: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      repair_fail: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      enable: {
        color: '#0A0'
      },
      disable: {
        color: 'grey'
      }
    },
    link: {}
  }
};
