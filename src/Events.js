import EventEmitter from 'events';


export default class Events {

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

    pasteImage(width, height, dataUrl) {
        this.emitter.emit('paste', {width: width, height: height, dataUrl: dataUrl});
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
