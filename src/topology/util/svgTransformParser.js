// https://github.com/nidu/svg-transform-parser
/* eslint-disable no-control-regex */
const parseSvgTransform = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

function peg$subclass(child, parent) {
  function Ctor() {
    // eslint-disable-next-line no-invalid-this
    this.constructor = child;
  }
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
}

function SyntaxError(message, expected, found, offset, line, column) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.offset = offset;
  this.line = line;
  this.column = column;

  this.name = 'SyntaxError';
}

peg$subclass(SyntaxError, Error);

function parse(...args) {
  const input = args[0];
  const options = arguments.length > 1 ? args[1] : {};
  const utils = {};
  const peg$FAILED = {};

  const peg$startRuleFunctions = { transformList: peg$parsetransformList };
  let peg$startRuleFunction = peg$parsetransformList;

  const peg$c0 = peg$FAILED;
  // const peg$c1 = [];
  const peg$c2 = null;
  const peg$c3 = function(ts) {
    return ts;
  };
  const peg$c4 = function(t, ts) {
    const keys = Object.keys(t);
    keys.forEach((key)=>{
      ts[key] = t[key];
    });
    return ts;
  };
  const peg$c5 = 'matrix';
  const peg$c6 = { type: 'literal', value: 'matrix', description: '"matrix"' };
  const peg$c7 = '(';
  const peg$c8 = { type: 'literal', value: '(', description: '"("' };
  const peg$c9 = ')';
  const peg$c10 = { type: 'literal', value: ')', description: '")"' };
  const peg$c11 = function(a, b, c, d, e, f) {
    return { matrix: { a: a, b: b, c: c, d: d, e: e, f: f } };
  };
  const peg$c12 = 'translate';
  const peg$c13 = { type: 'literal', value: 'translate', description: '"translate"' };
  const peg$c14 = function(tx, ty) {
    const t = { tx: tx };
    if (ty) t.ty = ty;
    return { translate: t };
  };
  const peg$c15 = 'scale';
  const peg$c16 = { type: 'literal', value: 'scale', description: '"scale"' };
  const peg$c17 = function(sx, sy) {
    const s = { sx: sx };
    if (sy) s.sy = sy;
    return { scale: s };
  };
  const peg$c18 = 'rotate';
  const peg$c19 = { type: 'literal', value: 'rotate', description: '"rotate"' };
  const peg$c20 = function(angle, c) {
    const r = { angle: angle };
    if (c) {
      r.cx = c[0];
      r.cy = c[1];
    }
    return { rotate: r };
  };
  const peg$c21 = 'skewX';
  const peg$c22 = { type: 'literal', value: 'skewX', description: '"skewX"' };
  const peg$c23 = function(angle) {
    return { skewX: { angle: angle } };
  };
  const peg$c24 = 'skewY';
  const peg$c25 = { type: 'literal', value: 'skewY', description: '"skewY"' };
  const peg$c26 = function(angle) {
    return { skewY: { angle: angle } };
  };
  const peg$c27 = function(f) {
    return parseFloat(f.join(''));
  };
  const peg$c28 = function(i) {
    return parseInt(i.join(''));
  };
  const peg$c29 = function(n) {
    return n;
  };
  const peg$c30 = function(n1, n2) {
    return [n1, n2];
  };
  const peg$c31 = ',';
  const peg$c32 = { type: 'literal', value: ',', description: '","' };
  const peg$c33 = function(ds) {
    return ds.join('');
  };
  const peg$c34 = { type: 'other', description: 'fractionalConstant' };
  const peg$c35 = '.';
  const peg$c36 = { type: 'literal', value: '.', description: '"."' };
  const peg$c37 = function(d1, d2) {
    return [d1 ? d1.join('') : null, '.', d2.join('')].join('');
  };
  const peg$c38 = function(d) {
    return d.join('');
  };
  const peg$c39 = /^[eE]/;
  const peg$c40 = { type: 'class', value: '[eE]', description: '[eE]' };
  const peg$c41 = /^[+\\-]/;
  const peg$c42 = { type: 'class', value: '[+\\-]', description: '[+\\-]' };
  const peg$c43 = /^[0-9]/;
  const peg$c44 = { type: 'class', value: '[0-9]', description: '[0-9]' };
  const peg$c45 = /^[ \t\r\n]/;
  const peg$c46 = { type: 'class', value: '[ \\t\\r\\n]', description: '[ \\t\\r\\n]' };

  let peg$currPos = 0;
  let peg$reportedPos = 0;
  let peg$cachedPos = 0;
  let peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
  let peg$maxFailPos = 0;
  let peg$maxFailExpected = [];
  let peg$silentFails = 0;

  if ('startRule' in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error('Can\'t start parsing from rule "' + options.startRule + '".');
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$reportedPos, peg$currPos);
  }

  function offset() {
    return peg$reportedPos;
  }

  function line() {
    return peg$computePosDetails(peg$reportedPos).line;
  }

  function column() {
    return peg$computePosDetails(peg$reportedPos).column;
  }

  function expected(description) {
    throw peg$buildException(
      null,
      [{ type: 'other', description: description }],
      peg$reportedPos
    );
  }

  function error(message) {
    throw peg$buildException(message, null, peg$reportedPos);
  }

  // setting functions
  utils.text = text;
  utils.offset = offset;
  utils.line = line;
  utils.column = column;
  utils.expected = expected;
  utils.error = error;

  function peg$computePosDetails(pos) {
    function advance(details, startPos, endPos) {
      let p; let ch;

      for (p = startPos; p < endPos; p++) {
        ch = input.charAt(p);
        if (ch === '\n') {
          if (!details.seenCR) {
            details.line++;
          }
          details.column = 1;
          details.seenCR = false;
        } else if (ch === '\r' || ch === '\u2028' || ch === '\u2029') {
          details.line++;
          details.column = 1;
          details.seenCR = true;
        } else {
          details.column++;
          details.seenCR = false;
        }
      }
    }

    if (peg$cachedPos !== pos) {
      if (peg$cachedPos > pos) {
        peg$cachedPos = 0;
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
      }
      advance(peg$cachedPosDetails, peg$cachedPos, pos);
      peg$cachedPos = pos;
    }

    return peg$cachedPosDetails;
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildException(message, expected, pos) {
    function cleanupExpected(expected) {
      let i = 1;

      expected.sort(function(a, b) {
        if (a.description < b.description) {
          return -1;
        } else if (a.description > b.description) {
          return 1;
        } else {
          return 0;
        }
      });

      while (i < expected.length) {
        if (expected[i - 1] === expected[i]) {
          expected.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    function buildMessage(expected, found) {
      function stringEscape(s) {
        function hex(ch) {
          return ch.charCodeAt(0).toString(16).toUpperCase();
        }

        return s
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\x08/g, '\\b')
          .replace(/\t/g, '\\t')
          .replace(/\n/g, '\\n')
          .replace(/\f/g, '\\f')
          .replace(/\r/g, '\\r')
          .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) {
            return '\\x0' + hex(ch);
          })
          .replace(/[\x10-\x1F\x80-\xFF]/g, function(ch) {
            return '\\x' + hex(ch);
          })
          .replace(/[\u0180-\u0FFF]/g, function(ch) {
            return '\\u0' + hex(ch);
          })
          .replace(/[\u1080-\uFFFF]/g, function(ch) {
            return '\\u' + hex(ch);
          });
      }

      const expectedDescs = new Array(expected.length);
      let i;

      for (i = 0; i < expected.length; i++) {
        expectedDescs[i] = expected[i].description;
      }

      const expectedDesc = expected.length > 1
        ? expectedDescs.slice(0, -1).join(', ')
              + ' or '
              + expectedDescs[expected.length - 1]
        : expectedDescs[0];

      const foundDesc = found ? '"' + stringEscape(found) + '"' : 'end of input';

      return 'Expected ' + expectedDesc + ' but ' + foundDesc + ' found.';
    }

    const posDetails = peg$computePosDetails(pos);
    const found = pos < input.length ? input.charAt(pos) : null;

    if (expected !== null) {
      cleanupExpected(expected);
    }

    return new SyntaxError(
      message !== null ? message : buildMessage(expected, found),
      expected,
      found,
      pos,
      posDetails.line,
      posDetails.column
    );
  }

  function peg$parsetransformList() {
    let s0; let s1; let s2; let s3; let s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsewsp();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parsewsp();
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsetransforms();
      if (s2 === peg$FAILED) {
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsewsp();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsewsp();
        }
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c3(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsetransforms() {
    let s0; let s1; let s2; let s3;

    s0 = peg$currPos;
    s1 = peg$parsetransform();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsecommaWsp();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsecommaWsp();
        }
      } else {
        s2 = peg$c0;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsetransforms();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c4(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsetransform();
    }

    return s0;
  }

  function peg$parsetransform() {
    let s0;

    s0 = peg$parsematrix();
    if (s0 === peg$FAILED) {
      s0 = peg$parsetranslate();
      if (s0 === peg$FAILED) {
        s0 = peg$parsescale();
        if (s0 === peg$FAILED) {
          s0 = peg$parserotate();
          if (s0 === peg$FAILED) {
            s0 = peg$parseskewX();
            if (s0 === peg$FAILED) {
              s0 = peg$parseskewY();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsematrix() {
    let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7;
    let s8; let s9; let s10; let s11; let s12; let s13; let s14; let s15; let s16; let s17;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c5) {
      s1 = peg$c5;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c6);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsewsp();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsewsp();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenumber();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecommaWsp();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsenumber();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsecommaWsp();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsenumber();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsecommaWsp();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsenumber();
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecommaWsp();
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsenumber();
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsecommaWsp();
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsenumber();
                                if (s15 !== peg$FAILED) {
                                  s16 = [];
                                  s17 = peg$parsewsp();
                                  while (s17 !== peg$FAILED) {
                                    s16.push(s17);
                                    s17 = peg$parsewsp();
                                  }
                                  if (s16 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 41) {
                                      s17 = peg$c9;
                                      peg$currPos++;
                                    } else {
                                      s17 = peg$FAILED;
                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$c10);
                                      }
                                    }
                                    if (s17 !== peg$FAILED) {
                                      peg$reportedPos = s0;
                                      s1 = peg$c11(s5, s7, s9, s11, s13, s15);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$c0;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$c0;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsetranslate() {
    let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7; let s8;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 9) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 9;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c13);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsewsp();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsewsp();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenumber();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecommaWspNumber();
              if (s6 === peg$FAILED) {
                s6 = peg$c2;
              }
              if (s6 !== peg$FAILED) {
                s7 = [];
                s8 = peg$parsewsp();
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parsewsp();
                }
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s8 = peg$c9;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c10);
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c14(s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsescale() {
    let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7; let s8;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c15) {
      s1 = peg$c15;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c16);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsewsp();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsewsp();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenumber();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecommaWspNumber();
              if (s6 === peg$FAILED) {
                s6 = peg$c2;
              }
              if (s6 !== peg$FAILED) {
                s7 = [];
                s8 = peg$parsewsp();
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parsewsp();
                }
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s8 = peg$c9;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c10);
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c17(s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parserotate() {
    let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7; let s8;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c18) {
      s1 = peg$c18;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c19);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsewsp();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsewsp();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenumber();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecommaWspTwoNumbers();
              if (s6 === peg$FAILED) {
                s6 = peg$c2;
              }
              if (s6 !== peg$FAILED) {
                s7 = [];
                s8 = peg$parsewsp();
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parsewsp();
                }
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s8 = peg$c9;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c10);
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c20(s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parseskewX() {
    let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c21) {
      s1 = peg$c21;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c22);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsewsp();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsewsp();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenumber();
            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$parsewsp();
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$parsewsp();
              }
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c9;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c10);
                  }
                }
                if (s7 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c23(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parseskewY() {
    let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c24) {
      s1 = peg$c24;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c25);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsewsp();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsewsp();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsenumber();
            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$parsewsp();
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$parsewsp();
              }
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c9;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c10);
                  }
                }
                if (s7 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c26(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsenumber() {
    let s0; let s1; let s2; let s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parsesign();
    if (s2 === peg$FAILED) {
      s2 = peg$c2;
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parsefloatingPointConstant();
      if (s3 !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$c0;
    }
    if (s1 !== peg$FAILED) {
      peg$reportedPos = s0;
      s1 = peg$c27(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parsesign();
      if (s2 === peg$FAILED) {
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseintegerConstant();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c28(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsecommaWspNumber() {
    let s0; let s1; let s2;

    s0 = peg$currPos;
    s1 = peg$parsecommaWsp();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenumber();
      if (s2 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c29(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsecommaWspTwoNumbers() {
    let s0; let s1; let s2; let s3; let s4;

    s0 = peg$currPos;
    s1 = peg$parsecommaWsp();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenumber();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecommaWsp();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsenumber();
          if (s4 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c30(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsecommaWsp() {
    let s0; let s1; let s2; let s3; let s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsewsp();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsewsp();
      }
    } else {
      s1 = peg$c0;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomma();
      if (s2 === peg$FAILED) {
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsewsp();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsewsp();
        }
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsecomma();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsewsp();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsewsp();
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    }

    return s0;
  }

  function peg$parsecomma() {
    let s0;

    if (input.charCodeAt(peg$currPos) === 44) {
      s0 = peg$c31;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c32);
      }
    }

    return s0;
  }

  function peg$parseintegerConstant() {
    let s0; let s1;

    s0 = peg$currPos;
    s1 = peg$parsedigitSequence();
    if (s1 !== peg$FAILED) {
      peg$reportedPos = s0;
      s1 = peg$c33(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsefloatingPointConstant() {
    let s0; let s1; let s2;

    s0 = peg$currPos;
    s1 = peg$parsefractionalConstant();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseexponent();
      if (s2 === peg$FAILED) {
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsedigitSequence();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexponent();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    }

    return s0;
  }

  function peg$parsefractionalConstant() {
    let s0; let s1; let s2; let s3;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parsedigitSequence();
    if (s1 === peg$FAILED) {
      s1 = peg$c2;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c35;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c36);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsedigitSequence();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c37(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsedigitSequence();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c35;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c36);
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c38(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c34);
      }
    }

    return s0;
  }

  function peg$parseexponent() {
    let s0; let s1; let s2; let s3;

    s0 = peg$currPos;
    if (peg$c39.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c40);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsesign();
      if (s2 === peg$FAILED) {
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsedigitSequence();
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsesign() {
    let s0;

    if (peg$c41.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c42);
      }
    }

    return s0;
  }

  function peg$parsedigitSequence() {
    let s0; let s1;

    s0 = [];
    s1 = peg$parsedigit();
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsedigit();
      }
    } else {
      s0 = peg$c0;
    }

    return s0;
  }

  function peg$parsedigit() {
    let s0;

    if (peg$c43.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c44);
      }
    }

    return s0;
  }

  function peg$parsewsp() {
    let s0;

    if (peg$c45.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c46);
      }
    }

    return s0;
  }

  const peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail({ type: 'end', description: 'end of input' });
    }

    throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
  }
}

return {
  SyntaxError: SyntaxError,
  parse: parse,
};
})();

export default parseSvgTransform.parse;
