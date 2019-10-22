import d3TopoUtil from '../d3TopoUtil';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import LiquidFillGauge from './LiquidFillGauge';

export default class DefaultAnimation {
  targetTimer;
  constructor(props) {
    console.log('animation constructing...');
    this.props = props || {};
    // init state
    this.state = { targetTimer: {} };
    this.init();
  }
  init() {}
  stopAllAnimation() {
    const { targetTimer } = this.state;
    // console.debug('set all timer false-->');
    forEach(targetTimer, function(value, key) {
      // targetTimer[key] = false;
      delete targetTimer[key];
    });
  }

  setAnimation(data, target, animate) {
    const me = this;
    const { targetTimer } = this.state;
    let animationNo;
    let animationId;
    // let iconDom = data.g.select(target);
    // console.debug('setAnimation target:',target, get(target.node(), 'id'));
    if (target && target.node && get(target.node(), 'id')) {
      animationNo = get(target.node(), 'id');
      // console.debug(targetTimer);
    }

    if (!animationNo) {
      console.warn("'Your target to set Animation' needs 'id'");
      return;
    }

    animationId = animationNo + '_rotate';
    if (animate.rotate) {
      if (!targetTimer[animationId]) {
        let dom = target;
        if (animate.rotateTargetClass) {
          dom = target.select('.' + animate.rotateTargetClass);
        }
        if (dom && dom.node && dom.node()) {
          targetTimer[animationId] = true;
          let x = 0;
          let y = 0;
          if (dom.attr('x')) {
            x = dom.attr('x').replace('px', '');
          }
          if (dom.attr('y')) {
            y = dom.attr('y').replace('px', '');
          }
          me.rotate(animationId, dom, 0, x, y, 10);
        }
      }
    } else {
      me.removeAnimation(animationId, target);
    }

    animationId = animationNo + '_flicker';
    if (animate.flicker) {
      if (!targetTimer[animationId]) {
        let dom = target;
        if (animate.flickerTargetClass) {
          dom = target.select('.' + animate.flickerTargetClass);
        }
        targetTimer[animationId] = true;
        me.flicker(animationId, dom, 900, 0.2, 1);
      }
    } else {
      me.removeAnimation(animationId, target);
    }

    animationId = animationNo + '_liquidFillGauge';
    if (animate.liquidFillGauge) {
      if (!targetTimer[animationId]) {
        const dom = target;
        const config = {
          generateCircle: !animate.liquidFillGaugeUseMainCircle,
          circleSelector: animate.liquidFillGaugeUseMainCircle ? 'circle.outer' : 'circle.liquidFillGaugeCircle',
          waveAnimate: true,
          waveOpacity: 0.5,
          circleColor: animate.liquidFillGaugeCircleColor,
          waveTextColor: animate.liquidFillGaugeWaveTextColor,
          circleX: animate.liquidFillGaugeCircleXPosition,
          circleY: animate.liquidFillGaugeCircleYPosition,
          textFontWeight: animate.liquidFillGaugeTextFontWeight,
          textSize: animate.liquidFillGaugeTextFontSize
        };
        targetTimer[animationId] = true;
        LiquidFillGauge.load(animationId, dom, data.percentage || 50, config, targetTimer); // hardcode 50% should be 0%
      }
    } else {
      me.removeAnimation(animationId, target);
    }
  }

  stopAnimation(target) {
    if (target && target.node && get(target.node(), 'id')) {
      const me = this;
      const { targetTimer } = this.state;
      const animationNo = target.node().id;
      const animationOriginNo = target.attr ? target.attr('originId') : get(target.node(), 'originId');
      for (const id in targetTimer) {
        // set(targetTimer , get(target.node(), 'id') , false );
        if (id.substring(0, animationNo.length) === animationNo) {
          // ie does not support startsWith
          me.removeAnimation(id, target);
        } else if (animationOriginNo && id.indexOf(animationOriginNo) !== -1) {
          me.removeAnimation(id, target);
        }
      }
    } else {
      console.warn("'Your target to stop Animation' needs 'id'");
    }
  }

  removeAnimation(animationId, target) {
    const { targetTimer } = this.state;
    if (animationId) {
      delete targetTimer[animationId];
      if (animationId.indexOf('_liquidFillGauge') !== -1) {
        LiquidFillGauge.remove(animationId, target);
      }
    }
  }

  flicker(animationId, dom, millisec, minOpacity, maxOpacity, isFadein) {
    const me = this;
    const { targetTimer } = this.state;
    minOpacity = minOpacity || 0;
    maxOpacity = maxOpacity || 1;
    isFadein = typeof isFadein === 'boolean' ? !isFadein : false;
    me._fade(dom, isFadein, minOpacity, maxOpacity, millisec);
    // console.debug('timerActive-->',_.get(targetTimer, dom.node().id));
    // if(timerActive){
    if (targetTimer[animationId] === true) {
      return setTimeout(function() {
        me.flicker(animationId, dom, millisec, minOpacity, maxOpacity, isFadein);
      }, millisec);
    } else {
      // revert opacity
      me._fade(dom, true, 1, 1, 0);
      // dom.style("opacity", null);
    }
  }

  _fade(dom, isFadein, minOpacity, maxOpacity, millisec) {
    const startOpacity = isFadein ? minOpacity : maxOpacity;
    const endOpacity = isFadein ? maxOpacity : minOpacity;
    dom
      .style('opacity', startOpacity)
      .transition()
      .duration(millisec)
      .style('opacity', endOpacity);
  }

  rotate(animationId, dom, rot, cx, cy, speed) {
    const me = this;
    const { targetTimer } = this.state;
    const transformStr = dom.attr('transform');
    const transform = d3TopoUtil.getParsedSvgTransform(transformStr);
    const translateStr = ` translate(${get(transform, 'translate.tx', 0)}, ${get(transform, 'translate.ty', 0)}) `;
    const scaleStr = transform.scale !== undefined ? `scale(${get(transform, 'scale.sx', 1)})` : 'scale(1)';
    dom.call(me._wrapRotateStyle('rotate(' + rot + ') ' + translateStr + scaleStr, cx, cy));
    if (targetTimer[animationId] === true) {
      return setTimeout(function() {
        me.rotate(animationId, dom, (rot % 360) + 1, cx, cy, speed);
      }, speed);
    }
  }

  _wrapRotateStyle(transformStr, cx, cy) {
    // console.log(transform);
    return node => {
      node.each(() => {
        const transform = d3TopoUtil.getParsedSvgTransform(transformStr);
        let rotate = get(transform, 'rotate.angle', 0);
        rotate = (rotate > 0 ? -1 : 1) * (180 - Math.abs(rotate));
        rotate = [rotate, cx, cy].join(','); // rotate center
        node.attr(
          'transform',
          `translate(${get(transform, 'translate.tx', 0)}, ${get(transform, 'translate.ty', 1)}) scale(${get(transform, 'scale.sx', 1)})
          rotate(${rotate})`
        );
      });
    };
  }
}
