// Pallete.js
'use strict';

import React from 'react';
import d3 from 'd3';

export default class Pallete extends React.Component {

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    static get propTypes() {
        return {
            doingUndo: React.PropTypes.bool,
            doingRedo: React.PropTypes.bool
        };
    }

    undo(ev, doing) {
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        this.context.emitter.emit('undo.pallete', doing);
    }

    redo(ev, doing) {
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        this.context.emitter.emit('redo.pallete', doing);
    }

    grid(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.context.emitter.emit('grid.pallete');
    }

    download(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    componentDidUpdate() {
        if (this.props.doingUndo) {
            d3.select(this.refs.undo).on('mouseleave.pallete', ev => this.undo(ev, false));
            d3.select(this.refs.redo).on('mouseleave.pallete', null);
            setTimeout(() => this.undo(null, this.props.doingUndo), 100);
        } else if (this.props.doingRedo) {
            d3.select(this.refs.undo).on('mouseleave.pallete', null);
            d3.select(this.refs.redo).on('mouseleave.pallete', ev => this.redo(ev, false));
            setTimeout(() => this.redo(null, this.props.doingRedo), 100);
        } else {
            d3.select(this.refs.undo).on('mouseleave.pallete', null);
            d3.select(this.refs.redo).on('mouseleave.pallete', null);
        }
    }

    render() {
        return (
            <div>
                <span><a href="#" ref="undo" onMouseEnter={ev => this.undo(ev, true)}>Undo</a> </span>
                <span><a href="#" ref="redo" onMouseEnter={ev => this.redo(ev, true)}>Redo</a> </span>
                <span><a href="#" ref="grid" onClick={ev => this.grid(ev)}>Grid</a> </span>
                <span><a href="#" ref="download" id="xxxlayer" onClick={ev => this.download(ev)}>Save</a> </span>
            </div>
        );
    }

}
