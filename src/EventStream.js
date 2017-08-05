// @flow

import * as Constants from './Constants';
import EventEmitter from 'events';


type listenerType = (string, any) => void;

export default class EventStream {

    emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
    }

    on(name: string, listener: listenerType) {
        this.emitter.on(name, listener);
    }

    startDrawing(x: number, y: number) {
        this.emitter.emit('start', {x: x, y: y});
    }

    stopDrawing() {
        this.emitter.emit('stop');
    }

    selectLayer(layer: number) {
        this.emitter.emit('selectLayer', layer);
    }

    addLayer() {
        this.emitter.emit('addLayer');
    }

    changeStrokeWidth(width: number) {
        this.emitter.emit('set', {key: 'strokeWidth', value: width});
    }

    changeStrokeColor(color: string) {
        this.emitter.emit('set', {key: 'strokeColor', value: color});
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

    startResizing(resizeType: typeof Constants.MODE) {
        this.emitter.emit('startResizing', resizeType);
    }

    stopResizing() {
        this.emitter.emit('stopResizing');
    }

    resizeImage(x: number, y: number) {
        this.emitter.emit('resize', {x: x, y: y});
    }

    pushPoint(x: number, y: number) {
        this.emitter.emit('push', {x: x, y: y});
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
