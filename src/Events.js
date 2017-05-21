export default class Events {

    constructor(emitter) {
        this.emitter = emitter;
    }

    on(name, listener) {
        this.emitter.on(name, listener);
    }

    changeMode(mode) {
        this.emitter.emit('set', {key: 'mode', value: mode});
    }

    changeStrokeWidth(width) {
        this.emitter.emit('set', {key: 'strokeWidth', value: width});
    }

    changeStrokeColor(color) {
        this.emitter.emit('set', {key: 'strokeColor', value: color});
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
}
