// Debug.js
'use strict';

import React from 'react';
import {handMode} from './Constant';

export default class Debug extends React.Component {

    render() {
        const mode = this.props.mode === handMode ? 'hand' : 'line';
        const strokeWidth = this.props.strokeWidth;
        const strokeColor = this.props.strokeColor;

        return (
            <div>
                <span>mode: {mode} </span>
                <span>stroke-width: {strokeWidth} </span>
                <span>stroke-color: {strokeColor} </span>
            </div>
        );
    }

}
