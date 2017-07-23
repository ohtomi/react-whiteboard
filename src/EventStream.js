import EventEmitter from 'events';


export default class EventStream {

    constructor() {
        this.emitter = new EventEmitter();
    }

    on(name, listener) {
        this.emitter.on(name, listener);
    }

    startDrawing(x, y) {
        this.emitter.emit('start', {x: x, y: y});
    }

    stopDrawing() {
        this.emitter.emit('stop');
    }

    selectLayer(layer) {
        this.emitter.emit('selectLayer', layer);
    }

    addLayer() {
        this.emitter.emit('addLayer');
    }

    changeStrokeWidth(width) {
        this.emitter.emit('set', {key: 'strokeWidth', value: width});
    }

    changeStrokeColor(color) {
        this.emitter.emit('set', {key: 'strokeColor', value: color});
    }

    pasteImage(x, y, width, height, dataUrl) {
        this.emitter.emit('paste', {x: x, y: y, width: width, height: height, dataUrl: dataUrl});
    }

    startDragging() {
        this.emitter.emit('startDragging');
    }

    stopDragging() {
        this.emitter.emit('stopDragging');
    }

    dragImage(x, y) {
        this.emitter.emit('drag', {x: x, y: y});
    }

    startNwResizing() {
        this.emitter.emit('startNwResizing');
    }

    stopNwResizing() {
        this.emitter.emit('stopNwResizing');
    }

    nwResizeImage(d) {
        this.emitter.emit('nwResize', {d: d});
    }

    pushPoint(x, y) {
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
