import * as Constants from './Constants';

export default class DataHolder {

    constructor() {
        this.layer = 0;
        this.dataset = [];
        this.undoStack = [];
        this.renderLayers = [];
    }

    startDrawing(strokeWidth, strokeColor, point) {
        this.dataset.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.layer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
    }

    stopDrawing() {
        this.dataset.push({});
    }

    changeLayer(layer) {
        this.dataset.push({});
        this.layer = layer;
    }

    changeStrokeWidth(width) {
        this.dataset.push({});
    }

    changeStrokeColor(color) {
        this.dataset.push({});
    }

    pasteImage(image) {
        this.dataset.push({
            type: Constants.SVG_ELEMENT_TYPE.IMAGE,
            layer: this.layer,
            image: image
        });
    }

    pushPoint(strokeWidth, strokeColor, point) {
        this.dataset.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.layer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
        this.undoStack = [];
    }

    undo() {
        this.undoStack.push(this.dataset.pop()); // {}
        this.undoStack.push(this.dataset.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
        this.dataset.push({});
    }

    redo() {
        if (this.undoStack.length) {
            this.dataset.pop();
            this.dataset.push(this.undoStack.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.dataset.push(this.undoStack.pop()); // {}
        }
    }

    clear() {
        this.dataset = [];
        this.undoStack = [];
    }

    changeRenderLayers(renderLayers) {
        this.renderLayers = renderLayers;
    }
}
