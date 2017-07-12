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
            if (event.key === 'strokeWidth') {
                this.changeStrokeWidth(event.value);
            }
            if (event.key === 'strokeColor') {
                this.changeStrokeColor(event.value);
            }
        });

        this.events.on('selectLayer', layer => {
            this.selectLayer(layer);
        });
        this.events.on('addLayer', () => {
            this.addLayer();
        });

        this.events.on('paste', image => {
            this.pasteImage(image);
        });
        this.events.on('push', point => {
            this.pushPoint(point);
        });

        this.events.on('undo', () => {
            this.undo();
        });
        this.events.on('redo', () => {
            this.redo();
        });
        this.events.on('clear', () => {
            this.clear();
        });
    }

    startDrawing(point) {
        this.state.dataHolder.startDrawing(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            mode: Constants.MODE.LINE,
            dataHolder: this.state.dataHolder,
        });
    }

    stopDrawing() {
        this.state.dataHolder.stopDrawing();
        this.setState({
            mode: Constants.MODE.HAND,
            dataHolder: this.state.dataHolder,
        });
    }

    changeStrokeWidth(width) {
        this.state.dataHolder.stopDrawing();
        this.setState({
            strokeWidth: width,
            dataHolder: this.state.dataHolder,
        });
    }

    changeStrokeColor(color) {
        this.state.dataHolder.stopDrawing();
        this.setState({
            strokeColor: color,
            dataHolder: this.state.dataHolder,
        });
    }

    selectLayer(layer) {
        this.state.dataHolder.selectLayer(layer);
        this.setState({
            layer: layer,
            dataHolder: this.state.dataHolder,
        });
    }

    addLayer() {
        this.state.dataHolder.addLayer();
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    pasteImage(image) {
        this.state.dataHolder.pasteImage(image);
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    pushPoint(point) {
        this.state.dataHolder.pushPoint(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    undo() {
        this.state.dataHolder.undo();
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    redo() {
        this.state.dataHolder.redo();
        this.setState({
            dataHolder: this.state.dataHolder,
        });
    }

    clear() {
        this.state.dataHolder.clear();
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
