// main.js
'use strict';

import React from 'react';
import {EventEmitter} from 'events';
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
            dataset: []
        };
    }

    componentDidMount() {
        let that = this;
        emitter.on('click.canvas', function(ev) {
            const point = [ev.x, ev.y];
            const dataset = that.state.dataset;
            dataset.push(point);
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
