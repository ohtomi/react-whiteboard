// @flow

import React from 'react';

import * as Constants from './Constants';
import EventStream from './EventStream';
import EventStore from './EventStore';
import CursorPane from './CursorPane';
import CanvasPane from './CanvasPane';
import type {ModeType, ResizeType} from "./Constants";
import type {KeyValuePairType} from "./EventStream";
import type {ImageType, MoveType, PointType} from "./EventStore";


type defaultPropsType = {
    events: EventStream,
    eventStore: EventStore,
    width: number,
    height: number,
    style: {
        backgroundColor: string
    }
};

type propsType = {
    events: EventStream,
    eventStore: EventStore,
    width: number,
    height: number,
    style: {
        backgroundColor: string
    }
};

type stateType = {
    eventStore: EventStore,
    mode: ModeType,
    layer: number,
    strokeWidth: number,
    strokeColor: string
};

export default class Whiteboard extends React.Component {

    static defaultProps: defaultPropsType;
    props: propsType;
    state: stateType;

    canvas: ?CanvasPane;

    constructor(props: propsType) {
        super(props);

        this.state = {
            eventStore: props.eventStore,
            mode: Constants.MODE.HAND,
            layer: 0,
            strokeWidth: 5,
            strokeColor: 'black',
        };

        this.canvas = null;
    }

    getSvgElement(): ?HTMLElement {
        if (this.canvas) {
            return this.canvas.getSvgElement();
        }
    }

    componentDidMount() {
        this.setupEventHandler();
    }

    setupEventHandler() {
        this.props.events.on('start', (point: PointType) => {
            this.startDrawing(point);
        });
        this.props.events.on('stop', () => {
            this.stopDrawing();
        });

        this.props.events.on('set', (event: KeyValuePairType) => {
            if (event.key === 'strokeWidth') {
                this.changeStrokeWidth(event.value);
            }
            if (event.key === 'strokeColor') {
                this.changeStrokeColor(event.value);
            }
        });

        this.props.events.on('selectLayer', (layer: number) => {
            this.selectLayer(layer);
        });
        this.props.events.on('addLayer', () => {
            this.addLayer();
        });

        this.props.events.on('paste', (image: ImageType) => {
            this.pasteImage(image);
        });
        this.props.events.on('startDragging', () => {
            this.startDragging();
        });
        this.props.events.on('stopDragging', () => {
            this.stopDragging();
        });
        this.props.events.on('drag', (move: MoveType) => {
            this.dragImage(move);
        });
        this.props.events.on('startResizing', (resizeType: ResizeType) => {
            this.startResizing(resizeType);
        });
        this.props.events.on('stopResizing', () => {
            this.stopResizing();
        });
        this.props.events.on('resize', (move: MoveType) => {
            this.resizeImage(move);
        });
        this.props.events.on('push', (point: PointType) => {
            this.pushPoint(point);
        });

        this.props.events.on('undo', () => {
            this.undo();
        });
        this.props.events.on('redo', () => {
            this.redo();
        });
        this.props.events.on('clear', () => {
            this.clear();
        });
    }

    startDrawing(point: PointType) {
        this.state.eventStore.startDrawing(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            mode: Constants.MODE.DRAW_LINE,
            eventStore: this.state.eventStore,
        });
    }

    stopDrawing() {
        this.state.eventStore.stopDrawing();
        this.setState({
            mode: Constants.MODE.HAND,
            eventStore: this.state.eventStore,
        });
    }

    changeStrokeWidth(width: number) {
        this.state.eventStore.stopDrawing();
        this.setState({
            strokeWidth: width,
            eventStore: this.state.eventStore,
        });
    }

    changeStrokeColor(color: string) {
        this.state.eventStore.stopDrawing();
        this.setState({
            strokeColor: color,
            eventStore: this.state.eventStore,
        });
    }

    selectLayer(layer: number) {
        this.state.eventStore.selectLayer(layer);
        this.setState({
            layer: layer,
            eventStore: this.state.eventStore,
        });
    }

    addLayer() {
        this.state.eventStore.addLayer();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    pasteImage(image: ImageType) {
        this.state.eventStore.pasteImage(image);
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    startDragging() {
        this.setState({
            mode: Constants.MODE.DRAG_IMAGE,
        });
    }

    stopDragging() {
        this.setState({
            mode: Constants.MODE.HAND,
        });
    }

    dragImage(move: MoveType) {
        if (this.state.mode !== Constants.MODE.DRAG_IMAGE) {
            return;
        }

        this.state.eventStore.dragImage(move);
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    startResizing(resizeType: ResizeType) {
        this.setState({
            mode: resizeType,
        });
    }

    stopResizing() {
        this.setState({
            mode: Constants.MODE.HAND,
        });
    }

    resizeImage(move: MoveType) {
        if (this.state.mode === Constants.MODE.NW_RESIZE_IMAGE) {
            this.state.eventStore.nwResizeImage(move);
            this.setState({
                eventStore: this.state.eventStore,
            });
        } else if (this.state.mode === Constants.MODE.NE_RESIZE_IMAGE) {
            this.state.eventStore.neResizeImage(move);
            this.setState({
                eventStore: this.state.eventStore,
            });
        } else if (this.state.mode === Constants.MODE.SE_RESIZE_IMAGE) {
            this.state.eventStore.seResizeImage(move);
            this.setState({
                eventStore: this.state.eventStore,
            });
        } else if (this.state.mode === Constants.MODE.SW_RESIZE_IMAGE) {
            this.state.eventStore.swResizeImage(move);
            this.setState({
                eventStore: this.state.eventStore,
            });
        }
    }

    pushPoint(point: PointType) {
        this.state.eventStore.pushPoint(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    undo() {
        this.state.eventStore.undo();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    redo() {
        this.state.eventStore.redo();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    clear() {
        this.state.eventStore.clear();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    render() {
        const wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height,
        };

        // TODO use object type spread?
        return (
            <div style={wrapperStyle}>
                <CursorPane events={this.props.events} eventStore={this.state.eventStore}
                            width={this.props.width} height={this.props.height}
                            mode={this.state.mode} strokeColor={this.state.strokeColor} strokeWidth={this.state.strokeWidth}/>
                <CanvasPane ref={canvas => this.canvas = canvas}
                            eventStore={this.state.eventStore}
                            width={this.props.width} height={this.props.height} style={this.props.style}/>
            </div>
        );
    }
}

Whiteboard.defaultProps = {
    events: new EventStream(),
    eventStore: new EventStore(),
    width: 400,
    height: 400,
    style: {
        backgroundColor: 'none'
    }
};
