// Canvas.js
'use strict';

import React from 'react';
import d3 from 'd3';
import downloadable from './d3-downloadable';

const line = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1]);

const layerAdjust = 20;

export default class Canvas extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            dataset: React.PropTypes.array,
            style: React.PropTypes.object,
            renderGrid: React.PropTypes.bool
        };
    }

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    componentDidMount() {
        let svg = d3.select(this.refs.canvas).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        if (this.props.style && this.props.style.backgroundColor) {
            svg.attr('style', 'background: ' + this.props.style.backgroundColor);
        } else {
            svg.attr('style', 'background: ' + '#f6f6f6');
        }

        let that = this;
        d3.select(this.refs.layer).on('mousemove.canvas', function() {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - layerAdjust];
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3.select(this.refs.layer).on('click', function() {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - layerAdjust];
            that.context.emitter.emit('click.canvas', point);
        });

        this.renderCanvas();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render() {
        let wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height
        };
        let cursorLayerStyle = {
            position: 'absolute',
            top: -layerAdjust,
            zIndex: 9999,
            width: this.props.width,
            height: this.props.height,
            cursor: 'url(css/ic_edit_' + this.props.strokeColor + '_24px.svg), default'
        };
        let canvasStyle = {
            position: 'absolute',
            top: 0,
            width: this.props.width,
            height: this.props.height,
            border: 'solid 2px #333'
        };
        return (
            <div style={wrapperStyle}>
                <div ref="layer" style={cursorLayerStyle}></div>
                <div ref="canvas" style={canvasStyle}></div>
            </div>
        );
    }

    renderCanvas() {
        let svg = d3.select('svg');
        svg.call(downloadable().filename('fig'));
        svg.selectAll('path').remove();

        if (this.props.renderGrid) {
            let xCount = this.props.width / 20;
            for (var x = 0; x < xCount; x++) {
                svg.append('path')
                    .datum([[x * 20, 0], [x * 20, this.props.height]])
                    .classed('line', true)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', 'gray')
                    .attr('stroke-width', 1);
            }

            let yCount = this.props.height / 20;
            for (var y = 0; y < yCount; y++) {
                svg.append('path')
                    .datum([[0, y * 20], [this.props.width, y * 20]])
                    .classed('line', true)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', 'gray')
                    .attr('stroke-width', 1);
            }
        }

        for (var i = 0; i < this.props.dataset.length; i++) {
            var d = this.props.dataset[i];
            if (d.values.length <= 1) {
                continue;
            }
            svg.append('path')
                .datum(d.values)
                .classed('line', true)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', d.strokeColor)
                .attr('stroke-width', d.strokeWidth);
        }
    }

}
