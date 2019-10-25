/** ***
 * iconType :
 *  - image
 *  - text
 ***/
const mdIcon = 1;
const mdSize = 30;

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
  Integration: {
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
  }
};
