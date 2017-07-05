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

    changeLayer(layer) {
        this.emitter.emit('set', {key: 'layer', value: layer});
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

    undoPoint() {
        this.emitter.emit('undo');
    }

    redoPoint() {
        this.emitter.emit('redo');
    }

    clearPoint() {
        this.emitter.emit('clear');
    }

    changeRenderLayers(renderLayers) {
        this.emitter.emit('set', {key: 'renderLayers', value: renderLayers});
    }
}
