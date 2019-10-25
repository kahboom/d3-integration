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
  Integration: {
    node: {
      published: {
        color: '#0088ce'
      },
      pending: {
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
        color: '#0A0'
      },
      unpublished: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      error: {
        color: '#e76049'
      },
      deleting: {
        animate: {
          flicker: true,
          flickerTargetClass: 'node-icon'
        },
        color: '#0088ce',
        backgroundColor: 'rgb(239, 239, 239)'
      },
      update: {
        color: '#ccc',
        backgroundColor: 'rgb(239, 239, 239)'
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
  }
};
