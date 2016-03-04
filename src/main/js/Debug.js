// Debug.js
'use strict';

import React from 'react';
import {handMode} from './Constant';

export default class Debug extends React.Component {

    static get propTypes() {
        return {
            dataset: React.PropTypes.array,
            mode: React.PropTypes.object,
            strokeWidth: React.PropTypes.number,
            strokeColor: React.PropTypes.string
        };
    }

    dump(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        for (var i = 0; i < this.props.dataset.length; i++) {
            var d = this.props.dataset[i];
            var message = '';
            message += 'width: ' + d.strokeWidth;
            message += ', color: ' + d.strokeColor;
            message += ', value: [';
            for (var j = 0; j < d.values.length; j++) {
                var p = d.values[j];
                message += '(' + p[0] + ', ' + p[1] + '), ';
            }
            message += ']';
            console.log(message);
        }
    }

    render() {
        const mode = this.props.mode === handMode ? 'hand' : 'line';
        const strokeWidth = this.props.strokeWidth;
        const strokeColor = this.props.strokeColor;

        return (
            <div>
                <span>mode: {mode} </span>
                <span>stroke-width: {strokeWidth} </span>
                <span>stroke-color: {strokeColor} </span>
                <span><a href="#" ref="dump" onClick={ev => this.dump(ev)}>Dump data</a> </span>
            </div>
        );
    }

}
