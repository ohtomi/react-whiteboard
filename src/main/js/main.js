// main.js
'use strict';

import React from 'react';
import {EventEmitter} from 'events';
import d3 from 'd3';
import Canvas from './Canvas';
import Pallete from './Palette';

const emitter = new EventEmitter();

const handMode = {};
const lineMode = {};

export default class Whiteboard extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            listener: React.PropTypes.func
        };
    }

    static get childContextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    getChildContext() {
        return {
            emitter: emitter
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            dataset: [],
            mode: handMode,
            strokeWidth: 1,
            strokeColor: 'black'
        };
    }

    componentDidMount() {
        d3.select('body').on('keydown.body', function() {
            const width = d3.event.keyCode - 48;
            emitter.emit('keydown.body', width);
        });

        let that = this;
        emitter.on('keydown.body', function(width) {
            if (width === 0) {
                that.toggleMode();
            }
            if (width >= 1 && width <= 9) {
                that.changeStrokeWidth(width);
            }
            if (width === 19) { // 'c'
                that.toggleStrokeColor();
            }
        });
        emitter.on('mousemove.canvas', function(point) {
            that.pushPoint(point);
        });
    }

    toggleMode() {
        if (this.state.mode === lineMode) {
            this.setState({mode: handMode});
        } else {
            const dataset = this.state.dataset;
            dataset.push({
                strokeWidth: this.state.strokeWidth,
                strokeColor: this.state.strokeColor,
                values: []
            });
            this.setState({
                mode: lineMode,
                dataset: dataset
            });
        }
    }

    changeStrokeWidth(width) {
        this.setState({strokeWidth: width});
    }

    toggleStrokeColor() {
        if (this.state.strokeColor === 'black') {
            this.setState({strokeColor: 'red'});
        } else if (this.state.strokeColor === 'red') {
            this.setState({strokeColor: 'green'});
        } else if (this.state.strokeColor === 'green') {
            this.setState({strokeColor: 'blue'});
        } else {
            this.setState({strokeColor: 'black'});
        }
    }

    pushPoint(point) {
        if (this.state.mode === handMode) {
            return;
        }

        const dataset = this.state.dataset;
        const current = dataset[dataset.length - 1];

        if (current &&
                current.strokeWidth === this.state.strokeWidth &&
                current.strokeColor === this.state.strokeColor) {
            current.values.push(point);
            this.setState({dataset: dataset});
        } else {
            dataset.push({
                strokeWidth: this.state.strokeWidth,
                strokeColor: this.state.strokeColor,
                values: [point]
            });
            this.setState({dataset: dataset});
        }
    }

    render() {
        return (
            <div ref="whiteboard">
                <Canvas {...this.props} {...this.state} />
                <Pallete {...this.props} {...this.state} />
                {this.renderDebugInfo()}
            </div>
        );
    }

    renderDebugInfo() {
        const mode = this.state.mode === handMode ? 'hand' : 'line';
        const strokeWidth = this.state.strokeWidth;
        const strokeColor = this.state.strokeColor;

        return (
            <div>
                <span>mode: {mode} </span>
                <span>stroke-width: {strokeWidth} </span>
                <span>stroke-color: {strokeColor} </span>
            </div>
        );
    }

}
