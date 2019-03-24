// @flow

import EventEmitter from 'events'
import type {ResizeType} from './Constants'
import type {ImageDataType, MoveDataType, PointDataType} from './EventStore'


type listenerType = (any) => void;

export type StrokeWidthType = {
    key: 'strokeWidth',
    value: number
};

export type StrokeColorType = {
    key: 'strokeColor',
    value: string
};

export default class EventStream {

    emitter: EventEmitter

    constructor() {
        this.emitter = new EventEmitter()
    }

    on(name: string, listener: listenerType) {
        this.emitter.on(name, listener)
    }

    selectLayer(layer: number) {
        this.emitter.emit('selectLayer', layer)
    }

    addLayer() {
        this.emitter.emit('addLayer')
    }

    startDrawing(x: number, y: number) {
        this.emitter.emit('start', {x: x, y: y})
    }

    stopDrawing() {
        this.emitter.emit('stop')
    }

    changeStrokeWidth(width: number) {
        const change: StrokeWidthType = {key: 'strokeWidth', value: width}
        this.emitter.emit('set', change)
    }

    changeStrokeColor(color: string) {
        const change: StrokeColorType = {key: 'strokeColor', value: color}
        this.emitter.emit('set', change)
    }

    pushPoint(x: number, y: number) {
        const point: PointDataType = {x: x, y: y}
        this.emitter.emit('push', point)
    }

    pasteImage(x: number, y: number, width: number, height: number, dataUrl: string) {
        const image: ImageDataType = {x: x, y: y, width: width, height: height, dataUrl: dataUrl}
        this.emitter.emit('paste', image)
    }

    startDragging() {
        this.emitter.emit('startDragging')
    }

    stopDragging() {
        this.emitter.emit('stopDragging')
    }

    dragImage(x: number, y: number) {
        const move: MoveDataType = {x: x, y: y}
        this.emitter.emit('drag', move)
    }

    startResizing(resizeType: ResizeType) {
        this.emitter.emit('startResizing', resizeType)
    }

    stopResizing() {
        this.emitter.emit('stopResizing')
    }

    resizeImage(x: number, y: number) {
        const move: MoveDataType = {x: x, y: y}
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
