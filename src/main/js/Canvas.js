// Canvas.js
'use strict';

import React from 'react';
import d3 from 'd3';

const line = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1]);

export default class Canvas extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            dataset: React.PropTypes.array
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

        let that = this;
        svg.on('mousemove.canvas', function() {
            const point = [d3.event.x - 6, d3.event.y + 18];
            that.context.emitter.emit('mousemove.canvas', point);
        });

        this.renderCanvas();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render() {
        let canvasStyle = {
            width: this.props.width,
            height: this.props.height,
            cursor: 'url(css/ic_edit_' + this.props.strokeColor + '_24px.svg), default'
        };
        return (
            <div ref="canvas" style={canvasStyle}></div>
        );
    }

    renderCanvas() {
        let svg = d3.select('svg');
        svg.selectAll('path').remove();
        for (var i = 0; i < this.props.dataset.length; i++) {
            var d = this.props.dataset[i];
            if (d.values.length <= 1) {
                return;
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
