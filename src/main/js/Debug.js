// Debug.js
'use strict';

import React from 'react';

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
        for (let i = 0; i < this.props.dataset.length; i++) {
            let d = this.props.dataset[i];
            let message = '';
            message += 'width: ' + d.strokeWidth;
            message += ', color: ' + d.strokeColor;
            message += ', value: [';
            for (let j = 0; j < d.values.length; j++) {
                let p = d.values[j];
                message += '(' + p[0] + ', ' + p[1] + '), ';
            }
            message += ']';
            console.log(message);
        }
    }

    render() {
        const mode = this.props.mode.id;
        const strokeWidth = this.props.strokeWidth;
        const strokeColor = this.props.strokeColor;

        return (
            <div>
                <span>mode: {mode} </span>
                <span>stroke-width: {strokeWidth} </span>
                <span>stroke-color: {strokeColor} </span>
                <span><a href="#" onClick={ev => this.dump(ev)}>Dump data</a> </span>
            </div>
        );
    }

}
