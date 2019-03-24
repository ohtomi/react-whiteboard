// @flow

import React from 'react'

import type {ModeType, ResizeType} from './Constants'
import * as Constants from './Constants'
import type {StrokeColorType, StrokeWidthType} from './EventStream'
import EventStream from './EventStream'
import type {ImageDataType, MoveDataType, PointDataType} from './EventStore'
import EventStore from './EventStore'
import CursorPane from './CursorPane'
import CanvasPane from './CanvasPane'


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

export default class Whiteboard extends React.Component<propsType, stateType> {

    static defaultProps: defaultPropsType
    props: propsType
    state: stateType

    canvas: ?CanvasPane

    constructor(props: propsType) {
        super(props)

        this.state = {
            eventStore: props.eventStore,
            mode: Constants.MODE.HAND,
            layer: 0,
            strokeWidth: 5,
            strokeColor: 'black'
        }

        this.canvas = null
    }

    getSvgElement(): ?Element {
        if (this.canvas) {
            return this.canvas.getSvgElement()
        }
    }

    componentDidMount() {
        this.setupEventHandler()
    }

    setupEventHandler() {
        this.props.events.on('selectLayer', this.selectLayer.bind(this))
        this.props.events.on('addLayer', this.addLayer.bind(this))

        this.props.events.on('start', this.startDrawing.bind(this))
        this.props.events.on('stop', this.stopDrawing.bind(this))

        this.props.events.on('set', (event: StrokeWidthType | StrokeColorType) => {
            if (event.key === 'strokeWidth') {
                this.changeStrokeWidth(event.value)
            }
            if (event.key === 'strokeColor') {
                this.changeStrokeColor(event.value)
            }
        })

        this.props.events.on('push', this.pushPoint.bind(this))

        this.props.events.on('paste', this.pasteImage.bind(this))
        this.props.events.on('startDragging', this.startDragging.bind(this))
        this.props.events.on('stopDragging', this.stopDragging.bind(this))
        this.props.events.on('drag', this.dragImage.bind(this))
        this.props.events.on('startResizing', this.startResizing.bind(this))
        this.props.events.on('stopResizing', this.stopResizing.bind(this))
        this.props.events.on('resize', this.resizeImage.bind(this))

        this.props.events.on('undo', this.undo.bind(this))
        this.props.events.on('redo', this.redo.bind(this))
        this.props.events.on('clear', this.clear.bind(this))
    }

    selectLayer(layer: number) {
        this.state.eventStore.selectLayer(layer)
        this.setState({
            layer: layer,
            eventStore: this.state.eventStore
        })
    }

    addLayer() {
        this.state.eventStore.addLayer()
        this.setState({eventStore: this.state.eventStore})
    }

    startDrawing(point: PointDataType) {
        this.state.eventStore.startDrawing(this.state.strokeWidth, this.state.strokeColor, point)
        this.setState({
            mode: Constants.MODE.DRAW_LINE,
            eventStore: this.state.eventStore
        })
    }

    stopDrawing() {
        this.state.eventStore.stopDrawing()
        this.setState({
            mode: Constants.MODE.HAND,
            eventStore: this.state.eventStore
        })
    }

    changeStrokeWidth(width: number) {
        this.state.eventStore.stopDrawing()
        this.setState({
            strokeWidth: width,
            eventStore: this.state.eventStore
        })
    }

    changeStrokeColor(color: string) {
        this.state.eventStore.stopDrawing()
        this.setState({
            strokeColor: color,
            eventStore: this.state.eventStore
        })
    }

    pushPoint(point: PointDataType) {
        this.state.eventStore.pushPoint(this.state.strokeWidth, this.state.strokeColor, point)
        this.setState({eventStore: this.state.eventStore})
    }

    pasteImage(image: ImageDataType) {
        this.state.eventStore.pasteImage(image)
        this.setState({eventStore: this.state.eventStore})
    }

    startDragging() {
        this.setState({mode: Constants.MODE.DRAG_IMAGE})
    }

    stopDragging() {
        this.setState({mode: Constants.MODE.HAND})
    }

    dragImage(move: MoveDataType) {
        if (this.state.mode !== Constants.MODE.DRAG_IMAGE) {
            return
        }

        this.state.eventStore.dragImage(move)
        this.setState({eventStore: this.state.eventStore})
    }

    startResizing(resizeType: ResizeType) {
        this.setState({mode: resizeType})
    }

    stopResizing() {
        this.setState({mode: Constants.MODE.HAND})
    }

    resizeImage(move: MoveDataType) {
        if (this.state.mode === Constants.MODE.NW_RESIZE_IMAGE) {
            this.state.eventStore.nwResizeImage(move)
            this.setState({eventStore: this.state.eventStore})
        } else if (this.state.mode === Constants.MODE.NE_RESIZE_IMAGE) {
            this.state.eventStore.neResizeImage(move)
            this.setState({
                eventStore: this.state.eventStore
            })
        } else if (this.state.mode === Constants.MODE.SE_RESIZE_IMAGE) {
            this.state.eventStore.seResizeImage(move)
            this.setState({
                eventStore: this.state.eventStore
            })
        } else if (this.state.mode === Constants.MODE.SW_RESIZE_IMAGE) {
            this.state.eventStore.swResizeImage(move)
            this.setState({eventStore: this.state.eventStore})
        }
    }

    undo() {
        this.state.eventStore.undo()
        this.setState({eventStore: this.state.eventStore})
    }

    redo() {
        this.state.eventStore.redo()
        this.setState({eventStore: this.state.eventStore})
    }

    clear() {
        this.state.eventStore.clear()
        this.setState({eventStore: this.state.eventStore})
    }

    render() {
        const wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height
        }

        const props = Object.assign({}, this.props, this.state)

        return (
            <div style={wrapperStyle}>
                <CursorPane {...props}/>
                <CanvasPane ref={canvas => this.canvas = canvas} {...props}/>
            </div>
        )
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
}
