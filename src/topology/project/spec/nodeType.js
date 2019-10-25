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
    container: {
      type: 'container',
      iconType: 'text',
      icon: '\uf108', // computer
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    split: {
      type: 'split',
      iconType: 'text',
      icon: '\uf0e8',
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    mapper: {
      type: 'mapper',
      iconType: 'text',
      icon: '\uf044',
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    log: {
      type: 'log',
      iconType: 'text',
      icon: '\uf15b',
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    },
    endpoint: {
      type: 'endpoint',
      iconType: 'text',
      icon: '\uf1c0', // database
      iconScale: mdIcon,
      fontSize: '25px',
      width: mdSize,
      height: mdSize
    }
  }
};
