import React from 'react';
import EventEmitter from 'events';
import d3selection from 'd3-selection';
import CursorPane from './CursorPane';
import CanvasPane from './CanvasPane';


const MODE = {
    HAND: {},
    LINE: {},
};


export default class Whiteboard extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            style: React.PropTypes.object,
        };
    }

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
        this.state = {
            dataset: [],
            undoStack: [],
            mode: MODE.HAND,
            strokeWidth: 5,
            strokeColor: 'black',
        };
    }

    componentDidMount() {
        this.setupEventHandler();
    }

    setupEventHandler() {
        d3selection.select('body').on('keydown.body', () => {
            this.emitter.emit('keydown.body', d3selection.event.keyCode);
        });

        const that = this;
        this.emitter.on('keydown.body', (keyCode) => {
            if (keyCode >= 49 && keyCode <= 57) { // '1' - '9'
                that.changeStrokeWidth(keyCode - 48);
            }
            if (keyCode === 67) { // 'c'
                that.toggleStrokeColor();
            }
        });
        this.emitter.on('mousemove.canvas', (point) => {
            that.pushPoint(point);
        });
        this.emitter.on('click.canvas', (point) => {
            that.toggleMode(point);
        });
        this.emitter.on('undo.pallete', () => {
            that.undoPoint();
        });
        this.emitter.on('redo.pallete', () => {
            that.redoPoint();
        });
    }

    toggleMode(point) {
        if (this.state.mode === MODE.LINE) {
            this.setState({
                mode: MODE.HAND,
            });
        } else {
            const dataset = this.state.dataset;
            dataset.push({
                strokeWidth: this.state.strokeWidth,
                strokeColor: this.state.strokeColor,
                values: point ? [point] : [],
            });
            this.setState({
                mode: MODE.LINE,
                dataset: dataset,
            });
        }
    }

    changeStrokeWidth(width) {
        this.setState({
            strokeWidth: width,
        });
    }

    toggleStrokeColor() {
        if (this.state.strokeColor === 'black') {
            this.setState({
                strokeColor: 'red',
            });
        } else if (this.state.strokeColor === 'red') {
            this.setState({
                strokeColor: 'green',
            });
        } else if (this.state.strokeColor === 'green') {
            this.setState({
                strokeColor: 'blue',
            });
        } else {
            this.setState({
                strokeColor: 'black',
            });
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
                undoStack: [],
            });
        } else {
            dataset.push({
                strokeWidth: this.state.strokeWidth,
                strokeColor: this.state.strokeColor,
                values: [point],
            });
            this.setState({
                dataset: dataset,
                undoStack: [],
            });
        }
    }

    undoPoint() {
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
            });
        }
    }

    redoPoint() {
        const undoStack = this.state.undoStack;
        const redoOperation = undoStack.pop();
        if (redoOperation) {
            redoOperation({
                undoStack: undoStack,
            });
        }
    }

    clearPoint() {
        this.setState({
            dataset: [],
            undoStack: [],
        });
    }

    render() {
        const wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div style={wrapperStyle}>
                <CursorPane {...this.props} {...this.state} />
                <CanvasPane {...this.props} {...this.state} />
            </div>
        );
    }

}
