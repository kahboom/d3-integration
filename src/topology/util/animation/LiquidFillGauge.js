import defaults from 'lodash/defaults';
const d3 = Object.assign({}, require('d3-selection'), require('d3-scale'), require('d3-shape'), require('d3-interpolate'), require('d3-ease'));
// import * as d3 from 'd3';
export default {
  getDefaultSettings() {
    return {
      minValue: 0, // The gauge minimum value.
      maxValue: 100, // The gauge maximum value.
      generateCircle: true,
      circleSelector: 'circle',
      circleRadius: 12, // The outer circle radius.
      circleX: 35, // The outer circle cx.
      circleY: 20, // The outer circle cy.
      circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
      circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
      circleColor: '#FFF', // The color of the outer circle.
      waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
      waveCount: 1, // The number of full waves per width of the wave circle.
      waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
      waveAnimateTime: 2000, // The amount of time in milliseconds for a full wave to enter the wave circle.
      waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
      // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill,
      // and minimum at 0% and 100% fill.
      // This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
      waveHeightScaling: true,
      waveAnimate: true, // Controls if the wave scrolls or is static.
      waveOpacity: 1,
      waveColor: '#178BCA', // The color of the fill wave.
      waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
      textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
      textHoriPosition: 0.5, // The width at which to display the percentage text withing the wave circle. 0 = center, 1 = right, -1 = left.
      textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
      valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
      displayPercent: true, // If true, a % symbol is displayed after the value.
      textColor: '#045681', // The color of the value text when the wave does not overlap it.
      waveTextColor: '#A4DBf8', // The color of the value text when the wave overlaps it.
      textFontWeight: 'normal'
    };
  },

  load(id, dom, percentage, config, targetTimer) {
    const me = this;
    const gauge = dom;
    config = config ? defaults(config, me.getDefaultSettings()) : me.getDefaultSettings();

    // let gaugeId = uuid.v4();
    const gaugeId = id;
    let outerCircle;

    if (!config.generateCircle) {
      outerCircle = gauge.select(config.circleSelector);
    } else {
      outerCircle = gauge
        .append('circle')
        .classed('liquidFillGaugeCircle', true)
        .attr('r', config.circleRadius)
        .attr('cx', config.circleX)
        .attr('cy', config.circleY)
        .style('fill', config.circleColor);
      config.circleSelector = 'circle.liquidFillGaugeCircle';
    }

    if (!outerCircle.node()) {
      return;
    }

    const outerCircleRadius = outerCircle.attr('r');

    const radius = outerCircleRadius - 2;
    const fillPercent = Math.max(config.minValue, Math.min(config.maxValue, percentage)) / config.maxValue;
    let waveHeightScale;
    if (config.waveHeightScaling) {
      waveHeightScale = d3
        .scaleLinear()
        .range([0, config.waveHeight, 0])
        .domain([0, 50, 100]);
    } else {
      waveHeightScale = d3
        .scaleLinear()
        .range([config.waveHeight, config.waveHeight])
        .domain([0, 100]);
    }
    const textPixels = (config.textSize * radius) / 2;
    const textFinalValue = parseFloat(percentage).toFixed(2);
    const textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
    const percentText = config.displayPercent ? '%' : '';
    const circleThickness = config.circleThickness * radius;
    const circleFillGap = config.circleFillGap * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    const waveLength = (fillCircleRadius * 2) / config.waveCount;
    const waveClipCount = 1 + config.waveCount;
    const waveClipWidth = waveLength * waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    let textRounder = function(value) {
      return Math.round(value);
    };
    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = function(value) {
        return parseFloat(value).toFixed(1);
      };
    }
    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = function(value) {
        return parseFloat(value).toFixed(2);
      };
    }

    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
      data.push({ x: i / (40 * waveClipCount), y: i / 40 });
    }

    // Scales for drawing the outer circle.
    // let gaugeCircleX = d3.scaleLinear().range([0,2 * Math.PI]).domain([0,1]);
    // let gaugeCircleY = d3.scaleLinear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    const waveScaleX = d3
      .scaleLinear()
      .range([0, waveClipWidth])
      .domain([0, 1]);
    const waveScaleY = d3
      .scaleLinear()
      .range([0, waveHeight])
      .domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    const waveRiseScale = d3
      .scaleLinear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
      .range([fillCircleMargin + fillCircleRadius * 2 + waveHeight, fillCircleMargin - waveHeight])
      .domain([0, 1]);
    const waveAnimateScale = d3
      .scaleLinear()
      .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    // Scale for controlling the position of the text within the gauge.
    const textRiseScaleY = d3
      .scaleLinear()
      .range([fillCircleMargin + fillCircleRadius * 2, fillCircleMargin + textPixels * 0.7])
      .domain([0, 1]);
    const textRiseScaleX = d3
      .scaleLinear()
      .range([fillCircleMargin + fillCircleRadius * 2, 0])
      .domain([0, 1]);

    const outerCircleX = config.generateCircle ? config.circleX : 0;
    const outerCircleY = config.generateCircle ? config.circleY : 0;

    // Text where the wave does not overlap.
    const text1 = gauge
      .append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('id', 'text1_' + gaugeId)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('x', outerCircleX)
      .attr('y', outerCircleY)
      .style('font-size', textPixels + 'px')
      .style('fill', config.textColor)
      .style('font-weight', config.textFontWeight)
      .attr('transform', 'translate(' + (radius - textRiseScaleX(config.textHoriPosition)) + ',' + (textRiseScaleY(config.textVertPosition) - radius) + ')');

    // The clipping wave area.
    const clipArea = d3
      .area()
      .x(function(d) {
        return waveScaleX(d.x);
      })
      .y0(function(d) {
        return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
      })
      .y1(function() {
        return fillCircleRadius * 2 + waveHeight;
      });
    const waveGroup = gauge
      .append('defs', outerCircle)
      .attr('id', 'defs_' + gaugeId)
      .append('clipPath')
      .attr('id', gaugeId);
    const wave = waveGroup
      .append('path')
      .datum(data)
      .attr('d', clipArea)
      .attr('T', 0);

    // The inner circle with the clipping wave attached.
    const fillCircleGroup = gauge
      .append('g', waveGroup)
      .attr('id', 'g_' + gaugeId)
      .attr('clip-path', 'url(#' + gaugeId + ')')
      .attr('transform', 'translate(' + parseInt(outerCircleX - radius) + ',' + parseInt(outerCircleY - radius) + ')');
    fillCircleGroup
      .append('circle')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', fillCircleRadius)
      .style('opacity', config.waveOpacity)
      .style('fill', config.waveColor);

    // Text where the wave does overlap.
    const text2 = fillCircleGroup
      .append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .style('fill', config.waveTextColor)
      .style('font-size', textPixels + 'px')
      .style('font-weight', config.textFontWeight)
      .attr('transform', 'translate(' + (radius * 2 - textRiseScaleX(config.textHoriPosition)) + ',' + textRiseScaleY(config.textVertPosition) + ')');

    // Make the value count up.
    if (config.valueCountUp) {
      const textTween = function() {
        // eslint-disable-next-line no-invalid-this
        const i = d3.interpolate(this.textContent, textFinalValue);
        return function(t) {
          // eslint-disable-next-line no-invalid-this
          this.textContent = textRounder(i(t)) + percentText;
        };
      };
      text1
        .transition()
        .duration(config.waveRiseTime)
        .tween('text', textTween);
      text2
        .transition()
        .duration(config.waveRiseTime)
        .tween('text', textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    const waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (config.waveRise) {
      waveGroup
        .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
        .transition()
        .duration(config.waveRiseTime)
        .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
        .on('start', function() {
          wave.attr('transform', 'translate(1,0)');
        });
      // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false.
      // The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
      waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
    }

    if (config.waveAnimate) animateWave();

    function animateWave() {
      wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
      wave
        .transition()
        .duration(config.waveAnimateTime * (1 - wave.attr('T')))
        .ease(d3.easeLinear)
        .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
        .attr('T', 1)
        .on('end', function() {
          wave.attr('T', 0);
          if (config.waveAnimate && targetTimer[id] === true) {
            animateWave();
          }
        });
    }

    function GaugeUpdater() {
      this.update = function(value) {
        const newFinalValue = parseFloat(value).toFixed(2);
        let textRounderUpdater = function(value) {
          return Math.round(value);
        };
        if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
          textRounderUpdater = function(value) {
            return parseFloat(value).toFixed(1);
          };
        }
        if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
          textRounderUpdater = function(value) {
            return parseFloat(value).toFixed(2);
          };
        }

        const textTween = function() {
          // eslint-disable-next-line no-invalid-this
          const i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
          return function(t) {
            // eslint-disable-next-line no-invalid-this
            this.textContent = textRounderUpdater(i(t)) + percentText;
          };
        };

        text1
          .transition()
          .duration(config.waveRiseTime)
          .tween('text', textTween);
        text2
          .transition()
          .duration(config.waveRiseTime)
          .tween('text', textTween);

        const fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
        const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
        const waveRiseScale = d3
          .scaleLinear()
          // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
          // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
          // circle at 100%.
          .range([fillCircleMargin + fillCircleRadius * 2 + waveHeight, fillCircleMargin - waveHeight])
          .domain([0, 1]);
        const newHeight = waveRiseScale(fillPercent);
        const waveScaleX = d3
          .scaleLinear()
          .range([0, waveClipWidth])
          .domain([0, 1]);
        const waveScaleY = d3
          .scaleLinear()
          .range([0, waveHeight])
          .domain([0, 1]);
        let newClipArea;
        if (config.waveHeightScaling) {
          newClipArea = d3
            .area()
            .x(function(d) {
              return waveScaleX(d.x);
            })
            .y0(function(d) {
              return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
            })
            .y1(function() {
              return fillCircleRadius * 2 + waveHeight;
            });
        } else {
          newClipArea = clipArea;
        }

        const newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
        wave
          .transition()
          .duration(0)
          .transition()
          .duration(config.waveAnimate ? config.waveAnimateTime * (1 - wave.attr('T')) : config.waveRiseTime)
          .ease(d3.easeLinear)
          .attr('d', newClipArea)
          .attr('transform', 'translate(' + newWavePosition + ',0)')
          .attr('T', '1')
          .on('end', function() {
            if (config.waveAnimate && targetTimer[id] === true) {
              wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
              animateWave();
            }
          });
        waveGroup
          .transition()
          .duration(config.waveRiseTime)
          .attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')');
      };
    }
    return new GaugeUpdater();
  },

  remove(id, target) {
    if (id) {
      const text1 = target.select('#text1_' + id);
      if (text1.node()) {
        target.select('#text1_' + id).remove();
        target.select('#defs_' + id).remove();
        target.select('#g_' + id).remove();
        target.select('circle.liquidFillGaugeCircle').remove();
      }
    }
  }
};
