import * as React from 'react'

import {ModeType, ResizeType} from './Constants'
import * as Constants from './Constants'
import {EventStream} from './EventStream'
import {PointDataType} from './EventStore'
import {EventStore} from './EventStore'


type propsType = {
    events: EventStream,
    eventStore: EventStore,
    width: number,
    height: number,
    mode: ModeType,
    strokeWidth: number,
    strokeColor: string
}

type stateType = {
    dragStart?: PointDataType,
    resizeStart?: PointDataType
}

export class CursorPane extends React.Component<propsType, stateType> {

    props: propsType
    state: stateType

    dragHandle?: HTMLElement

    constructor(props: propsType) {
        super(props)

        this.state = {
            dragStart: null,
            resizeStart: null
        }
    }

    onClickCursorLayer(ev: React.MouseEvent<HTMLDivElement>) {
        let eventToPoint = (ev: React.MouseEvent<HTMLDivElement>): Array<number> => {
            const x = ev.nativeEvent.offsetX - 2
            const y = ev.nativeEvent.offsetY + (2 * (this.props.strokeWidth / 3))
            return [x, y]
        }

        if (this.props.mode === Constants.MODE.HAND) {
            const [x, y] = eventToPoint(ev)
            this.props.events.startDrawing(x, y)
        } else {
            this.props.events.stopDrawing()
        }
    }

    onMouseMoveCursorLayer(ev: React.MouseEvent<HTMLDivElement>) {
        let eventToPoint = (ev: React.MouseEvent<HTMLDivElement>): Array<number> => {
            const x = ev.nativeEvent.offsetX - 2
            const y = ev.nativeEvent.offsetY + (2 * (this.props.strokeWidth / 3))
            return [x, y]
        }

        if (this.props.mode === Constants.MODE.DRAW_LINE) {
            const [x, y] = eventToPoint(ev)
            this.props.events.pushPoint(x, y)
        } else if (this.props.mode === Constants.MODE.DRAG_IMAGE) {
            if (ev.target !== this.dragHandle) {
                return
            }

            const lastImage = this.props.eventStore.lastImage()
            if (!lastImage) {
                return
            }

            if (this.state.dragStart) {
                const base = (lastImage.width < lastImage.height) ? lastImage.width : lastImage.height
                const unit = (base / 8) < 20 ? Math.ceil(base / 8) : 20

                const moveX = lastImage.x + unit < 0 ? ev.nativeEvent.offsetX - this.state.dragStart.x - (lastImage.x + unit) : ev.nativeEvent.offsetX - this.state.dragStart.x
                const moveY = lastImage.y + unit < 0 ? ev.nativeEvent.offsetY - this.state.dragStart.y - (lastImage.y + unit) : ev.nativeEvent.offsetY - this.state.dragStart.y

                this.props.events.dragImage(moveX, moveY)
            }
        } else if (this.props.mode === Constants.MODE.NW_RESIZE_IMAGE || this.props.mode === Constants.MODE.NE_RESIZE_IMAGE || this.props.mode === Constants.MODE.SE_RESIZE_IMAGE || this.props.mode === Constants.MODE.SW_RESIZE_IMAGE) {
            const lastImage = this.props.eventStore.lastImage()
            if (!lastImage) {
                return
            }

            if (this.state.resizeStart) {
                const moveX = ev.pageX - this.state.resizeStart.x
                const moveY = ev.pageY - this.state.resizeStart.y

                // do nothing if cannot resize image
                if (this.props.mode === Constants.MODE.NW_RESIZE_IMAGE && (lastImage.width - moveX < 0 || lastImage.height - moveY < 0)) {
                    return
                } else if (this.props.mode === Constants.MODE.NE_RESIZE_IMAGE && (lastImage.width + moveX < 0 || lastImage.height - moveY < 0)) {
                    return
                } else if (this.props.mode === Constants.MODE.SE_RESIZE_IMAGE && (lastImage.width + moveX < 0 || lastImage.height + moveY < 0)) {
                    return
                } else if (this.props.mode === Constants.MODE.SW_RESIZE_IMAGE && (lastImage.width - moveX < 0 || lastImage.height + moveY < 0)) {
                    return
                }

                this.setState({resizeStart: {x: ev.pageX, y: ev.pageY}})
                this.props.events.resizeImage(moveX, moveY)
            }
        }
    }

    onClickDragHandle(ev: React.MouseEvent<HTMLDivElement>) {
        if (this.props.mode === Constants.MODE.HAND) {
            this.setState({dragStart: {x: ev.nativeEvent.offsetX, y: ev.nativeEvent.offsetY}})
            this.props.events.startDragging()
        } else {
            this.setState({dragStart: null})
            this.props.events.stopDragging()
        }
        ev.preventDefault()
        ev.stopPropagation()
    }

    onClickResizeHandle(resizeType: ResizeType, ev: React.MouseEvent<HTMLDivElement>) {
        if (this.props.mode === Constants.MODE.HAND) {
            this.setState({resizeStart: {x: ev.pageX, y: ev.pageY}})
            this.props.events.startResizing(resizeType)
        } else {
            this.setState({resizeStart: null})
            this.props.events.stopResizing()
        }
        ev.preventDefault()
        ev.stopPropagation()
    }

    render() {
        const cursorLayerStyle = {
            position: 'absolute',
            zIndex: 2000,
            width: this.props.width,
            height: this.props.height,
            borderStyle: 'none none solid none',
            borderColor: this.props.strokeColor
        }

        return (
            <div role="presentation" style={cursorLayerStyle}
                 onClick={this.onClickCursorLayer.bind(this)} onMouseMove={this.onMouseMoveCursorLayer.bind(this)}>
                {this.renderImageHandle()}
            </div>
        )
    }

    renderImageHandle(): Array<React.ComponentElement<any, any>> | undefined {
        const lastImage = this.props.eventStore.lastImage()
        if (!lastImage) {
            return null
        }

        const base = (lastImage.width < lastImage.height) ? lastImage.width : lastImage.height
        const unit = (base / 8) < 20 ? Math.ceil(base / 8) : 20

        const mathMinOrMax = (min: number, max: number, value: number): number => {
            if (value < min) {
                return min
            } else if (value > max) {
                return max
            } else {
                return value
            }
        }

        const top = mathMinOrMax(0, this.props.height, lastImage.y + unit)
        const bottom = mathMinOrMax(0, this.props.height, lastImage.y + lastImage.height - unit)
        const left = mathMinOrMax(0, this.props.width, lastImage.x + unit)
        const right = mathMinOrMax(0, this.props.width, lastImage.x + lastImage.width - unit)

        const dragHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: top,
            left: left,
            width: right - left,
            height: bottom - top,
            cursor: 'move'
        }

        const nwResizeHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: mathMinOrMax(0, this.props.height, top - unit),
            left: mathMinOrMax(0, this.props.width, left - unit),
            width: left - mathMinOrMax(0, this.props.width, left - unit),
            height: top - mathMinOrMax(0, this.props.height, top - unit),
            cursor: 'nw-resize'
        }

        const neResizeHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: mathMinOrMax(0, this.props.height, top - unit),
            left: right,
            width: mathMinOrMax(0, this.props.width, right + unit) - right,
            height: top - mathMinOrMax(0, this.props.height, top - unit),
            cursor: 'ne-resize'
        }

        const seResizeHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: bottom,
            left: right,
            width: mathMinOrMax(0, this.props.width, right + unit) - right,
            height: mathMinOrMax(0, this.props.height, bottom + unit) - bottom,
            cursor: 'se-resize'
        }

        const swResizeHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: bottom,
            left: mathMinOrMax(0, this.props.width, left - unit),
            width: left - mathMinOrMax(0, this.props.width, left - unit),
            height: mathMinOrMax(0, this.props.height, bottom + unit) - bottom,
            cursor: 'sw-resize'
        }

        return ([
            <div key="drag" role="presentation" style={dragHandleStyle}
                 ref={dragHandle => this.dragHandle = dragHandle} onClick={this.onClickDragHandle.bind(this)}/>,
            <div key="nw-resize" role="presentation" style={nwResizeHandleStyle}
                 onClick={this.onClickResizeHandle.bind(this, Constants.MODE.NW_RESIZE_IMAGE)}/>,
            <div key="ne-resize" role="presentation" style={neResizeHandleStyle}
                 onClick={this.onClickResizeHandle.bind(this, Constants.MODE.NE_RESIZE_IMAGE)}/>,
            <div key="se-resize" role="presentation" style={seResizeHandleStyle}
                 onClick={this.onClickResizeHandle.bind(this, Constants.MODE.SE_RESIZE_IMAGE)}/>,
            <div key="sw-resize" role="presentation" style={swResizeHandleStyle}
                 onClick={this.onClickResizeHandle.bind(this, Constants.MODE.SW_RESIZE_IMAGE)}/>
        ])
    }
}
