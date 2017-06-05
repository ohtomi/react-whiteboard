import React from 'react';
import PropTypes from 'react-proptypes';

import Events from './Events';
import * as Constants from './Constants';
import DataHolder from './DataHolder';
import CursorPane from './CursorPane';
import CanvasPane from './CanvasPane';


export default class Whiteboard extends React.Component {

    constructor(props) {
        super(props);

        this.events = props.events || new Events();
        this.state = {
            dataHolder: props.dataHolder || new DataHolder(),
            mode: Constants.MODE.HAND,
            strokeWidth: 5,
            strokeColor: 'black',
        };
    }

    getChildContext() {
        return {
            events: this.events,
        };
    }

    componentDidMount() {
        this.setupEventHandler();
    }

    setupEventHandler() {
        this.events.on('start', point => {
            this.startDrawing(point);
        });
        this.events.on('stop', () => {
            this.stopDrawing();
        });

        this.events.on('set', event => {
            if (event.key === 'layer') {
                this.changeLayer(event.value);
            }
            if (event.key === 'renderLayers') {
                this.changeRenderLayers(event.value);
            }
            if (event.key === 'strokeWidth') {
                this.changeStrokeWidth(event.value);
            }
            if (event.key === 'strokeColor') {
                this.changeStrokeColor(event.value);
            }
        });

        this.events.on('push', point => {
            this.pushPoint(point);
        });
        this.events.on('undo', () => {
            this.undoPoint();
        });
        this.events.on('redo', () => {
            this.redoPoint();
        });
        this.events.on('clear', () => {
            this.clearPoint();
        });
    }

    startDrawing(point) {
        if (this.state.mode === Constants.MODE.LINE) {
            return;
        }

        this.state.dataHolder.startDrawing(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            mode: Constants.MODE.LINE,
            dataHolder: this.state.dataHolder,
        });
    }

    stopDrawing() {
        if (this.state.mode === Constants.MODE.HAND) {
            return;
        }

        this.state.dataHolder.stopDrawing();
        this.setState({
            mode: Constants.MODE.HAND,
            dataHolder: this.state.dataHolder,
        });
    }

    changeLayer(layer) {
        this.state.dataHolder.changeLayer(layer);
        this.setState({
            layer: layer,
            dataHolder: this.state.dataHolder,
        });
    }

    changeStrokeWidth(width) {
        this.state.dataHolder.changeStrokeWidth(width);
        this.setState({
            strokeWidth: width,
            dataHolder: this.state.dataHolder,
        });
    }

    changeStrokeColor(color) {
        this.state.dataHolder.changeStrokeColor(color);
        this.setState({
            strokeColor: color,
            dataHolder: this.state.dataHolder,
        });
    }

    pushPoint(point) {
        if (this.state.mode === Constants.MODE.HAND) {
            return;
        }

        this.state.dataHolder.pushPoint(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    undoPoint() {
        this.state.dataHolder.undoPoint();
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    redoPoint() {
        this.state.dataHolder.redoPoint();
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    clearPoint() {
        this.state.dataHolder.clearPoint();
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    changeRenderLayers(renderLayers) {
        this.state.dataHolder.changeRenderLayers(renderLayers);
        this.setState({
            dataHolder: this.state.dataHolder,
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
                <CursorPane {...this.props} {...this.state}></CursorPane>
                <CanvasPane {...this.props} {...this.state}></CanvasPane>
            </div>
        );
    }
}

Whiteboard.propTypes = {
    events: PropTypes.object,
    dataHolder: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.shape({
        backgroundColor: PropTypes.string,
    }),
};

Whiteboard.childContextTypes = {
    events: PropTypes.object,
};
