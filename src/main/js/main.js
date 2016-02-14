// main.js
'use strict';

import React from 'react';
import {EventEmitter} from 'events';
import d3 from 'd3';
import Canvas from './Canvas';
import Pallete from './Palette';

const emitter = new EventEmitter();

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
            dataset: [
                {
                    width: 1,
                    values: []
                }
            ]
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
                const dataset = that.state.dataset;
                dataset.push({
                    widht: 1,
                    values: []
                });
                that.setState({dataset: dataset});
            }
            if (width >= 1 && width <= 9) {
                const dataset = that.state.dataset;
                dataset.push({
                    width: width,
                    values: []
                });
                that.setState({dataset: dataset});
            }
        });
        emitter.on('mousemove.canvas', function(point) {
            const dataset = that.state.dataset;
            const current = dataset[dataset.length - 1];
            current.values.push(point);
            that.setState({dataset: dataset});
        });
    }

    render() {
        return (
            <div ref="whiteboard">
                <Canvas {...this.props} {...this.state} />
                <Pallete {...this.props} {...this.state} />
            </div>
        );
    }

}
