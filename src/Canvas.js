// Canvas.js
'use strict';

import React from 'react';
import d3 from 'd3';
import {CURSOR_LAYER_RELATIVE_TOP, SVG_BACKGROUND_COLOR} from './Constant';

const line = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1]);

export default class Canvas extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            strokeColor: React.PropTypes.string,
            dataset: React.PropTypes.array,
            style: React.PropTypes.object,
        };
    }

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    componentDidMount() {
        let svg = d3.select(this.refs.canvasLayer).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);
        this.svg = svg;

        if (this.props.style && this.props.style.backgroundColor) {
            svg.attr('style', 'background: ' + this.props.style.backgroundColor);
        } else {
            svg.attr('style', 'background: ' + SVG_BACKGROUND_COLOR);
        }

        let that = this;
        d3.select(this.refs.cursorLayer).on('mousemove.canvas', () => {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3.select(this.refs.cursorLayer).on('click', () => {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('click.canvas', point);
        });

        this.drawWhiteboardCanvas();
    }

    componentDidUpdate() {
        this.drawWhiteboardCanvas();
    }

    render() {
        let wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height
        };
        let cursorLayerStyle = {
            position: 'absolute',
            top: -CURSOR_LAYER_RELATIVE_TOP,
            zIndex: 2000,
            width: this.props.width,
            height: this.props.height,
            cursor: 'url(css/ic_edit_' + this.props.strokeColor + '_24px.svg), default'
        };
        let canvasLayerStyle = {
            position: 'absolute',
            top: 0,
            width: this.props.width,
            height: this.props.height
        };
        return (
            <div style={wrapperStyle}>
                <div ref="cursorLayer" style={cursorLayerStyle}></div>
                <div ref="canvasLayer" style={canvasLayerStyle}></div>
            </div>
        );
    }

    drawWhiteboardCanvas() {
        let svg = this.svg;
        svg.selectAll('path').remove();

        for (let i = 0; i < this.props.dataset.length; i++) {
            let d = this.props.dataset[i];
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
