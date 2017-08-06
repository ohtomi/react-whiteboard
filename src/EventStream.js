// @flow

import EventEmitter from 'events';
import type {ResizeType} from "./Constants";


type listenerType = (any) => void;

export type KeyValuePairType = {
    key: string,
    value: any
};

export default class EventStream {

    emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
    }

    on(name: string, listener: listenerType) {
        this.emitter.on(name, listener);
    }

    selectLayer(layer: number) {
        this.emitter.emit('selectLayer', layer);
    }

    addLayer() {
        this.emitter.emit('addLayer');
    }

    startDrawing(x: number, y: number) {
        this.emitter.emit('start', {x: x, y: y});
    }

    stopDrawing() {
        this.emitter.emit('stop');
    }

    changeStrokeWidth(width: number) {
        this.emitter.emit('set', {key: 'strokeWidth', value: width});
    }

    changeStrokeColor(color: string) {
        this.emitter.emit('set', {key: 'strokeColor', value: color});
    }

    pushPoint(x: number, y: number) {
        this.emitter.emit('push', {x: x, y: y});
    }

    pasteImage(x: number, y: number, width: number, height: number, dataUrl: string) {
        this.emitter.emit('paste', {x: x, y: y, width: width, height: height, dataUrl: dataUrl});
    }

    startDragging() {
        this.emitter.emit('startDragging');
    }

    stopDragging() {
        this.emitter.emit('stopDragging');
    }

    dragImage(x: number, y: number) {
        this.emitter.emit('drag', {x: x, y: y});
    }

    startResizing(resizeType: ResizeType) {
        this.emitter.emit('startResizing', resizeType);
    }

    stopResizing() {
        this.emitter.emit('stopResizing');
    }

    resizeImage(x: number, y: number) {
        this.emitter.emit('resize', {x: x, y: y});
    }

    undo() {
        this.emitter.emit('undo');
    }

    redo() {
        this.emitter.emit('redo');
    }

    clear() {
        this.emitter.emit('clear');
    }
}
