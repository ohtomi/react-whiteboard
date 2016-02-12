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
        svg.on('click.canvas', function() {
            that.context.emitter.emit('click.canvas', d3.event);
        });

        this.renderCanvas();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render() {
        return (<div ref="canvas"></div>);
    }

    renderCanvas() {
        if (this.props.dataset.length <= 1) {
            return;
        }

        let svg = d3.select('svg');
        svg.selectAll('path').remove();
        svg.append('path')
            .datum(this.props.dataset)
            .classed('line', true)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'black');
    }

}
