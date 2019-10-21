/** ***
 * iconType :
 *  - image
 *  - text
 ***/
// const smIcon = 0.5;
const mdIcon = 1;
// const lgIcon = 1.5;
// const smSize = 10;
const mdSize = 30;
// const lgSize = 50;
export const nodeType = {
  default: {
    default: {
      type: 'default',
      iconType: 'text',
      icon: '\uf013',
      iconScale: mdIcon,
      fontSize: '30px',
      width: mdSize,
      height: mdSize
    }
  },
  VDC: {
    default: {
      type: 'default',
      iconType: 'text',
      icon: '\uf013',
      iconScale: mdIcon,
      fontSize: '30px',
      width: mdSize,
      height: mdSize
    },
    vpc: {
      type: 'vpc',
      iconType: 'text',
      icon: '\uf1b3', // cubes
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    intranetGateway: {
      type: 'intranetGateway',
      iconType: 'text',
      icon: '\uf047', // cross
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    }
  },
  VPC: {
    default: {
      type: 'default',
      iconType: 'text',
      icon: '\uf013',
      iconScale: mdIcon,
      fontSize: '30px',
      width: mdSize,
      height: mdSize
    },
    instances: {
      type: 'instances',
      iconType: 'text',
      icon: '\uf108', // computer
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    firewall: {
      type: 'firewall',
      iconType: 'text',
      icon: '\uf06d', // fire
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize,
      extensions: {
        createDummyGroupNodeIfNecessary: true,
        dummyGgroupCategory: 'vnfGroup',
        dummyGroupName: 'VNF',
        dummyGroupStatus: 'running'
      }
    },
    vnfGroup: {
      type: 'vnfGroup',
      iconType: 'text',
      icon: '\uf1b3', // cubes
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    }
  },
  SiteNetwork: {
    default: {
      type: 'default',
      iconType: 'text',
      icon: '\uf013',
      iconScale: mdIcon,
      fontSize: '30px',
      width: mdSize,
      height: mdSize
    },
    instances: {
      type: 'instances',
      iconType: 'text',
      icon: '\uf108', // computer
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    firewall: {
      type: 'firewall',
      iconType: 'text',
      icon: '\uf06d', // fire
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    vnfGroup: {
      type: 'vnfGroup',
      iconType: 'text',
      icon: '\uf1b3', // cubes
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    }
  },
  Weathermap: {
    default: {
      type: 'default',
      iconType: 'text',
      icon: '\uf013',
      iconScale: mdIcon,
      fontSize: '30px',
      width: mdSize,
      height: mdSize
    },
    pnf: {
      type: 'pnf',
      imageType: 'text',
      icon: '\uf047',
      imageScale: 2,
      imageHeight: 30
    },
    aggregate: {
      type: 'aggregate',
      iconType: 'text',
      icon: '\uf0f7',
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    host: {
      type: 'host',
      iconType: 'text',
      icon: '\uf0f7',
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    vnfGroup: {
      type: 'vnfGroup',
      iconType: 'text',
      icon: '\uf1b3', // cubes
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    firewall: {
      type: 'firewall',
      iconType: 'text',
      icon: '\uf06d', // fire
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    slb: {
      type: 'slb',
      iconType: 'text',
      icon: '\uf07e',
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    virtualSwitch: {
      type: 'virtualSwitch',
      iconType: 'text',
      icon: '\uf2db', // cubes
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    }
  }
};
