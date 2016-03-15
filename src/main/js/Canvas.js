// Canvas.js
'use strict';

import React from 'react';
import d3 from 'd3';
import {toDownloadLinks} from './SvgConverter';
import {CURSOR_LAYER_RELATIVE_TOP, SVG_BACKGROUND_COLOR, GRID_SIZE} from './Constant';

const line = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1]);

export default class Canvas extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            dataset: React.PropTypes.array,
            style: React.PropTypes.object,
            renderGrid: React.PropTypes.bool,
            renderDownloadMenu: React.PropTypes.bool
        };
    }

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    closeDownload(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.context.emitter.emit('close.download.menu');
    }

    componentDidMount() {
        let svg = d3.select(this.refs.canvas).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        if (this.props.style && this.props.style.backgroundColor) {
            svg.attr('style', 'background: ' + this.props.style.backgroundColor);
        } else {
            svg.attr('style', 'background: ' + SVG_BACKGROUND_COLOR);
        }

        let that = this;
        d3.select(this.refs.cursorLayer).on('mousemove.canvas', function() {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3.select(this.refs.cursorLayer).on('click', function() {
            that.context.emitter.emit('close.download.menu');
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('click.canvas', point);
        });

        this.drawWhiteboardCanvas();
        this.createDownloadLinks();
    }

    componentDidUpdate() {
        this.drawWhiteboardCanvas();
        this.createDownloadLinks();
    }

    render() {
        let wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height
        };
        let downloadMenuStyle = {
            position: 'absolute',
            top: 0,
            zIndex: this.props.renderDownloadMenu ? 3000 : 1000,
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
        let canvasStyle = {
            position: 'absolute',
            top: 0,
            width: this.props.width,
            height: this.props.height
        };
        return (
            <div style={wrapperStyle}>
                <div ref="downloadMenu" style={downloadMenuStyle}>{this.renderDownloadMenu()}</div>
                <div ref="cursorLayer" style={cursorLayerStyle}></div>
                <div ref="canvas" style={canvasStyle}></div>
            </div>
        );
    }

    renderDownloadMenu() {
        if (this.props.renderDownloadMenu) {
            let linkStyle = {
                position: 'absolute',
                top: '50px',
                left: '50px'
            };
            return (
                <div style={linkStyle}>
                    <span><a ref="svgLink" download="whiteboard.svg">[Save as SVG]</a> </span>
                    <span><a ref="pngLink" download="whiteboard.png">[Save as PNG]</a> </span>
                    <span><a ref="jpegLink" download="whiteboard.jpg">[Save as JPEG]</a> </span>
                    <span><a ref="cancelLink" href="#" onClick={ev => this.cancelDownload(ev)}>[X]</a> </span>
                </div>
            );
        }
    }

    drawWhiteboardCanvas() {
        let svg = d3.select('svg');
        svg.selectAll('path').remove();

        if (this.props.renderGrid) {
            let xCount = this.props.width / GRID_SIZE;
            for (var x = 0; x < xCount; x++) {
                svg.append('path')
                    .datum([[x * GRID_SIZE, 0], [x * GRID_SIZE, this.props.height]])
                    .classed('line', true)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', 'gray')
                    .attr('stroke-width', 1);
            }

            let yCount = this.props.height / GRID_SIZE;
            for (var y = 0; y < yCount; y++) {
                svg.append('path')
                    .datum([[0, y * GRID_SIZE], [this.props.width, y * GRID_SIZE]])
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

    createDownloadLinks() {
        if (this.props.renderDownloadMenu) {
            let svg = d3.select('svg');
            let svgLink = d3.select(this.refs.svgLink);
            let pngLink = d3.select(this.refs.pngLink);
            let jpegLink = d3.select(this.refs.jpegLink);
            toDownloadLinks(svg, svgLink, pngLink, jpegLink);
        }
    }

}
