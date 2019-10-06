import EventEmitter from 'events'

import {ResizeImageDirection} from './Constants'
import {ImageData, MouseMoveData, PointData} from './EventStore'


export type EventListener = (value: any) => void

export type ChangeStrokeWidth = {
    key: 'strokeWidth',
    value: number
}

export type ChangeStrokeColor = {
    key: 'strokeColor',
    value: string
}

export enum EventNameEnum {
    SELECT_LAYER = 'selectLayer',
    ADD_LAYER = 'addLayer',
    START = 'start',
    STOP = 'stop',
    SET = 'set',
    PUSH = 'push',
    PASTE = 'paste',
    START_DRAGGING = 'startDragging',
    STOP_DRAGGING = 'stopDragging',
    DRAG = 'drag',
    START_RESIZING = 'startResizing',
    STOP_RESIZING = 'stopResizing',
    RESIZE = 'resize',
    UNDO = 'undo',
    REDO = 'redo',
    CLEAR = 'clear'
}

export class EventStream {

    emitter: EventEmitter

    constructor() {
        this.emitter = new EventEmitter()
    }

    on(name: EventNameEnum, listener: EventListener) {
        this.emitter.on(name, listener)
    }

    selectLayer(layer: number) {
        this.emitter.emit('selectLayer', layer)
    }

    addLayer() {
        this.emitter.emit('addLayer')
    }

    startDrawing(x: number, y: number) {
        this.emitter.emit('start', {x, y})
    }

    stopDrawing() {
        this.emitter.emit('stop')
    }

    changeStrokeWidth(width: number) {
        const change: ChangeStrokeWidth = {key: 'strokeWidth', value: width}
        this.emitter.emit('set', change)
    }

    changeStrokeColor(color: string) {
        const change: ChangeStrokeColor = {key: 'strokeColor', value: color}
        this.emitter.emit('set', change)
    }

    pushPoint(x: number, y: number) {
        const point: PointData = {x, y}
        this.emitter.emit('push', point)
    }

    pasteImage(x: number, y: number, width: number, height: number, dataUrl: string) {
        const image: ImageData = {x, y, width, height, dataUrl}
        this.emitter.emit('paste', image)
    }

    startDragging() {
        this.emitter.emit('startDragging')
    }

    stopDragging() {
        this.emitter.emit('stopDragging')
    }

    dragImage(x: number, y: number) {
        const move: MouseMoveData = {x, y}
        this.emitter.emit('drag', move)
    }

    startResizing(direction: ResizeImageDirection) {
        this.emitter.emit('startResizing', direction)
    }

    stopResizing() {
        this.emitter.emit('stopResizing')
    }

    resizeImage(x: number, y: number) {
        const move: MouseMoveData = {x, y}
        this.emitter.emit('resize', move)
    }

    undo() {
        this.emitter.emit('undo')
    }

    redo() {
        this.emitter.emit('redo')
    }

    clear() {
        this.emitter.emit('clear')
    }
}
