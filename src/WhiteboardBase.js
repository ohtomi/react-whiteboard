// WhiteboardBase.js
import React from 'react';
import EventEmitter from 'events';


export default class WhiteboardBase extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            style: React.PropTypes.object,
            emitter: React.PropTypes.object,
        };
    }

    static get childContextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    getChildContext() {
        return {
            emitter: this.emitter
        };
    }

    constructor(props) {
        super(props);
        this.emitter = this.props.emitter || new EventEmitter();
    }

}
