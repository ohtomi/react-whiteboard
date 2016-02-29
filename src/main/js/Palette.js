// Pallete.js
'use strict';

import React from 'react';

export default class Pallete extends React.Component {

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    undo(ev) {
        ev.preventDefault();
        this.context.emitter.emit('undo.pallete');
    }

    redo(ev) {
        ev.preventDefault();
        this.context.emitter.emit('redo.pallete');
    }

    render() {
        return (
            <div>
                <span><a href="#" onClick={ev => this.undo(ev)}>Undo</a> </span>
                <span><a href="#" onClick={ev => this.redo(ev)}>Redo</a> </span>
            </div>
        );
    }

}
