import React from 'react';
import EventEmitter from 'events';


export default class WhiteboardBase extends React.Component {

    static get childContextTypes() {
        return {
            emitter: React.PropTypes.object,
        };
    }

    getChildContext() {
        return {
            emitter: this.emitter,
        };
    }

    constructor(props) {
        super(props);
        this.emitter = new EventEmitter();
    }

}
