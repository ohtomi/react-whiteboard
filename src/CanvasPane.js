import React from 'react';
import d3 from 'd3';


const line = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1]);


export default class CanvasPane extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            dataset: React.PropTypes.array,
            style: React.PropTypes.object,
        };
    }

    componentDidMount() {
        const svg = d3.select(this.refs.svg);
        if (this.props.style && this.props.style.backgroundColor) {
            svg.attr('style', 'background: ' + this.props.style.backgroundColor);
        }

        this.drawWhiteboardCanvas();
    }

    componentDidUpdate() {
        this.drawWhiteboardCanvas();
    }

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div style={canvasLayerStyle}>
                <svg ref="svg" width={this.props.width} height={this.props.height}></svg>
            </div>
        );
    }

    drawWhiteboardCanvas() {
        const svg = d3.select(this.refs.svg);
        svg.selectAll('path').remove();

        for (let i = 0; i < this.props.dataset.length; i++) {
            const d = this.props.dataset[i];
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
