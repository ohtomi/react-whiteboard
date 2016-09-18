// main.js
'use strict';

import React from 'react';
import {EventEmitter} from 'events';
import d3 from 'd3';
import {MODE} from './Constant';
import Canvas from './Canvas';
import Pallete from './Palette';
import Debug from './Debug';

const emitter = new EventEmitter();

export default class Whiteboard extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            listener: React.PropTypes.func,
            style: React.PropTypes.object,
            renderPallete: React.PropTypes.bool,
            renderDebugInfo: React.PropTypes.bool
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
            dataset: [],
            undoStack: [],
            mode: MODE.HAND,
            strokeWidth: 5,
            strokeColor: 'black',
            doingUndo: false,
            doingRedo: false,
            renderGrid: false,
            renderDownloadMenu: false
        };
    }

    componentDidMount() {
        d3.select('body').on('keydown.body', () => {
            emitter.emit('keydown.body', d3.event.keyCode);
        });

        let that = this;
        emitter.on('keydown.body', (keyCode) => {
            if (keyCode === 48) { // 0'
                that.toggleMode();
            }
            if (keyCode >= 49 && keyCode <= 57) { // '1' - '9'
                that.changeStrokeWidth(keyCode - 48);
            }
            if (keyCode === 67) { // 'c'
                that.toggleStrokeColor();
            }
        });
        emitter.on('mousemove.canvas', (point) => {
            that.pushPoint(point);
        });
        emitter.on('click.canvas', (point) => {
            that.toggleMode(point);
        });
        emitter.on('undo.pallete', (doing) => {
            that.undoPoint(doing);
        });
        emitter.on('redo.pallete', (doing) => {
            that.redoPoint(doing);
        });
        emitter.on('grid.pallete', () => {
            that.toggleGrid();
        });
        emitter.on('clear.pallete', () => {
            that.clearPoint();
        });
        emitter.on('open.download.menu', () => {
            that.showDownloadMenu(true);
        });
        emitter.on('close.download.menu', () => {
            that.showDownloadMenu(false);
        });
    }

    toggleMode(point) {
        if (this.state.mode === MODE.LINE) {
            this.setState({
                mode: MODE.HAND
            });
        } else {
            const dataset = this.state.dataset;
            dataset.push({
                strokeWidth: this.state.strokeWidth,
                strokeColor: this.state.strokeColor,
                values: point ? [point] : []
            });
            this.setState({
                mode: MODE.LINE,
                dataset: dataset
            });
        }
    }

    changeStrokeWidth(width) {
        this.setState({strokeWidth: width});
    }

    toggleStrokeColor() {
        if (this.state.strokeColor === 'black') {
            this.setState({strokeColor: 'red'});
        } else if (this.state.strokeColor === 'red') {
            this.setState({strokeColor: 'green'});
        } else if (this.state.strokeColor === 'green') {
            this.setState({strokeColor: 'blue'});
        } else {
            this.setState({strokeColor: 'black'});
        }
    }

    pushPoint(point) {
        if (this.state.mode === MODE.HAND) {
            return;
        }

        const dataset = this.state.dataset;
        const current = dataset[dataset.length - 1];

        if (current &&
                current.strokeWidth === this.state.strokeWidth &&
                current.strokeColor === this.state.strokeColor) {
            current.values.push(point);
            this.setState({
                dataset: dataset,
                undoStack: []
            });
        } else {
            dataset.push({
                strokeWidth: this.state.strokeWidth,
                strokeColor: this.state.strokeColor,
                values: [point]
            });
            this.setState({
                dataset: dataset,
                undoStack: []
            });
        }
    }

    undoPoint(doing) {
        if (doing) {
            const dataset = this.state.dataset;
            const current = dataset[dataset.length - 1];
            const undoStack = this.state.undoStack;

            if (current && current.values.length > 1) {
                const point = current.values.pop();
                const undoOperation = (newState) => {
                    const dataset = this.state.dataset;
                    const current = dataset[dataset.length - 1];
                    current.values.push(point);
                    newState.dataset = dataset;
                    this.setState(newState);
                };
                undoStack.push(undoOperation);
                this.setState({
                    dataset: dataset,
                    undoStack: undoStack,
                    doingUndo: true
                });

            } else if (current && current.values.length === 1) {
                dataset.pop();
                const undoOperation = (newState) => {
                    const dataset = this.state.dataset;
                    dataset.push(current);
                    newState.dataset = dataset;
                    this.setState(newState);
                };
                undoStack.push(undoOperation);
                this.setState({
                    dataset: dataset,
                    undoStack: undoStack,
                    doingUndo: true
                });

            } else {
                this.setState({doingUndo: false});
            }
        } else {
            this.setState({doingUndo: false});
        }
    }

    redoPoint(doing) {
        if (doing) {
            const undoStack = this.state.undoStack;
            const redoOperation = undoStack.pop();
            if (redoOperation) {
                redoOperation({
                    undoStack: undoStack,
                    doingRedo: true
                });
            } else {
                this.setState({doingRedo: false});
            }
        } else {
            this.setState({doingRedo: false});
        }
    }

    toggleGrid() {
        this.setState({renderGrid: !this.state.renderGrid});
    }

    clearPoint() {
        this.setState({
            dataset: [],
            undoStack: []
        });
    }

    showDownloadMenu(doing) {
        this.setState({renderDownloadMenu: doing});
    }

    render() {
        return (
            <div ref="whiteboard">
                {this.renderCanvas()}
                {this.renderPallete()}
                {this.renderDebugInfo()}
            </div>
        );
    }

    renderCanvas() {
        return (
            <Canvas {...this.props} {...this.state} />
        );
    }

    renderPallete() {
        if (!this.props.renderPallete) {
            return;
        }

        return (
            <Pallete {...this.props} {...this.state} />
        );
    }

    renderDebugInfo() {
        if (!this.props.renderDebugInfo) {
            return;
        }

        return (
            <Debug {...this.props} {...this.state} />
        );
    }

}
