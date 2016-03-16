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
        d3.select(this.refs.cursorLayer).on('mousemove.canvas', function() {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3.select(this.refs.cursorLayer).on('click', function() {
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
        let menuLayerStyle = {
            position: 'absolute',
            top: 0,
            zIndex: this.props.renderDownloadMenu ? 3000 : 1000,
            width: this.props.width,
            height: this.props.height,
            backgroundColor: this.props.renderDownloadMenu ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0)'
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
                <div ref="menuLayer" style={menuLayerStyle}>{this.renderDownloadMenu()}</div>
                <div ref="cursorLayer" style={cursorLayerStyle}></div>
                <div ref="canvasLayer" style={canvasLayerStyle}></div>
            </div>
        );
    }

    renderDownloadMenu() {
        if (this.props.renderDownloadMenu) {
            let menuDialogStyle = {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                padding: 10,
                width: 200,
                height: 120,
                backgroundColor: 'rgb(255, 255, 255)'
            };
            return (
                <div style={menuDialogStyle}>
                    <div style={{'textAlign': 'right'}}>
                        <span><a href="#" onClick={ev => this.closeDownload(ev)}>[X]</a></span>
                    </div>
                    <div>
                        <span><a ref="svgLink" download="whiteboard.svg">[Save as SVG]</a></span>
                        <br />
                        <span><a ref="pngLink" download="whiteboard.png">[Save as PNG]</a></span>
                        <br />
                        <span><a ref="jpegLink" download="whiteboard.jpg">[Save as JPEG]</a></span>
                    </div>
                </div>
            );
        }
    }

    drawWhiteboardCanvas() {
        let svg = this.svg;
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
            let svg = this.svg;
            let svgLink = d3.select(this.refs.svgLink);
            let pngLink = d3.select(this.refs.pngLink);
            let jpegLink = d3.select(this.refs.jpegLink);
            toDownloadLinks(svg, svgLink, pngLink, jpegLink);
        }
    }

}
