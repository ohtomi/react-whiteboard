// main.js
'use strict';

import React from 'react';
import {EventEmitter} from 'events';
import d3 from 'd3';
import Canvas from './Canvas';
import Pallete from './Palette';

var svg = null;
var emitter = new EventEmitter();

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

    componentDidMount() {
        svg = d3.select(this.refs.whiteboard).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        var that = this;
        svg.on('click.whiteboard', function() {
            if (that.props.listener) {
                that.props.listener(d3.event);
            }
        });
    }

    render() {
        return (
            <div ref="whiteboard">
                <Canvas {...this.state} />
                <Pallete {...this.state} />
            </div>
        );
    }

}
