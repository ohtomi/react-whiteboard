import * as React from 'react'

import {ModeEnum, ResizeImageDirection} from './Constants'
import {ChangeStrokeColor, ChangeStrokeWidth, EventNameEnum, EventStream} from './EventStream'
import {EventStore, ImageData, MouseMoveData, PointData} from './EventStore'
import {CursorPane} from './CursorPane'
import {CanvasPane} from './CanvasPane'


type Props = {
    events: EventStream,
    eventStore: EventStore,
    width: number,
    height: number,
    style: {
        backgroundColor: string
    }
}

type State = {
    eventStore: EventStore,
    mode: ModeEnum,
    layer: number,
    strokeWidth: number,
    strokeColor: string
}

export class Whiteboard extends React.Component<Props, State> {

    static defaultProps = {
        events: new EventStream(),
        eventStore: new EventStore(),
        width: 400,
        height: 400,
        style: {
            backgroundColor: 'none'
        }
    }
    props: Props
    state: State

    canvas?: CanvasPane

    constructor(props: Props) {
        super(props)

        this.state = {
            eventStore: props.eventStore,
            mode: ModeEnum.HAND,
            layer: 0,
            strokeWidth: 5,
            strokeColor: 'black'
        }

        this.canvas = null
    }

    getSvgElement(): SVGSVGElement | undefined {
        if (this.canvas) {
            return this.canvas.getSvgElement()
        }
    }

    componentDidMount() {
        this.setupEventHandler()
    }

    setupEventHandler() {
        this.props.events.on(EventNameEnum.SELECT_LAYER, this.selectLayer.bind(this))
        this.props.events.on(EventNameEnum.ADD_LAYER, this.addLayer.bind(this))

        this.props.events.on(EventNameEnum.START, this.startDrawing.bind(this))
        this.props.events.on(EventNameEnum.STOP, this.stopDrawing.bind(this))

        this.props.events.on(EventNameEnum.SET, (event: ChangeStrokeWidth | ChangeStrokeColor) => {
            if (event.key === 'strokeWidth') {
                this.changeStrokeWidth(event.value)
            }
            if (event.key === 'strokeColor') {
                this.changeStrokeColor(event.value)
            }
        })

        this.props.events.on(EventNameEnum.PUSH, this.pushPoint.bind(this))

        this.props.events.on(EventNameEnum.PASTE, this.pasteImage.bind(this))
        this.props.events.on(EventNameEnum.START_DRAGGING, this.startDragging.bind(this))
        this.props.events.on(EventNameEnum.STOP_DRAGGING, this.stopDragging.bind(this))
        this.props.events.on(EventNameEnum.DRAG, this.dragImage.bind(this))
        this.props.events.on(EventNameEnum.START_RESIZING, this.startResizing.bind(this))
        this.props.events.on(EventNameEnum.STOP_RESIZING, this.stopResizing.bind(this))
        this.props.events.on(EventNameEnum.RESIZE, this.resizeImage.bind(this))

        this.props.events.on(EventNameEnum.UNDO, this.undo.bind(this))
        this.props.events.on(EventNameEnum.REDO, this.redo.bind(this))
        this.props.events.on(EventNameEnum.CLEAR, this.clear.bind(this))
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

    startDrawing(point: PointData) {
        this.state.eventStore.startDrawing(this.state.strokeWidth, this.state.strokeColor, point)
        this.setState({
            mode: ModeEnum.DRAW_LINE,
            eventStore: this.state.eventStore
        })
    }

    stopDrawing() {
        this.state.eventStore.stopDrawing()
        this.setState({
            mode: ModeEnum.HAND,
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

    pushPoint(point: PointData) {
        this.state.eventStore.pushPoint(this.state.strokeWidth, this.state.strokeColor, point)
        this.setState({eventStore: this.state.eventStore})
    }

    pasteImage(image: ImageData) {
        this.state.eventStore.pasteImage(image)
        this.setState({eventStore: this.state.eventStore})
    }

    startDragging() {
        this.setState({mode: ModeEnum.DRAG_IMAGE})
    }

    stopDragging() {
        this.setState({mode: ModeEnum.HAND})
    }

    dragImage(move: MouseMoveData) {
        if (this.state.mode !== ModeEnum.DRAG_IMAGE) {
            return
        }

        this.state.eventStore.dragImage(move)
        this.setState({eventStore: this.state.eventStore})
    }

    startResizing(direction: ResizeImageDirection) {
        this.setState({mode: direction})
    }

    stopResizing() {
        this.setState({mode: ModeEnum.HAND})
    }

    resizeImage(move: MouseMoveData) {
        if (this.state.mode === ModeEnum.NW_RESIZE_IMAGE) {
            this.state.eventStore.nwResizeImage(move)
            this.setState({eventStore: this.state.eventStore})
        } else if (this.state.mode === ModeEnum.NE_RESIZE_IMAGE) {
            this.state.eventStore.neResizeImage(move)
            this.setState({eventStore: this.state.eventStore})
        } else if (this.state.mode === ModeEnum.SE_RESIZE_IMAGE) {
            this.state.eventStore.seResizeImage(move)
            this.setState({eventStore: this.state.eventStore})
        } else if (this.state.mode === ModeEnum.SW_RESIZE_IMAGE) {
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
            position: 'relative' as 'relative',
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
