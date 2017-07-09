import * as Constants from './Constants';

export default class DataHolder {

    constructor() {
        this.layer = 0;
        this.eventList = [];
        this.undoList = [];
        this.renderLayers = [];
    }

    startDrawing(strokeWidth, strokeColor, point) {
        this.eventList.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.layer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
    }

    stopDrawing() {
        this.eventList.push({});
    }

    changeLayer(layer) {
        this.eventList.push({});
        this.layer = layer;
    }

    changeStrokeWidth(width) {
        this.eventList.push({});
    }

    changeStrokeColor(color) {
        this.eventList.push({});
    }

    pasteImage(image) {
        this.eventList.push({
            type: Constants.SVG_ELEMENT_TYPE.IMAGE,
            layer: this.layer,
            image: image
        });
    }

    pushPoint(strokeWidth, strokeColor, point) {
        this.eventList.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.layer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
        this.undoList = [];
    }

    undo() {
        this.undoList.push(this.eventList.pop()); // {}
        this.undoList.push(this.eventList.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
        this.eventList.push({});
    }

    redo() {
        if (this.undoList.length) {
            this.eventList.pop();
            this.eventList.push(this.undoList.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.eventList.push(this.undoList.pop()); // {}
        }
    }

    clear() {
        this.eventList = [];
        this.undoList = [];
    }

    changeRenderLayers(renderLayers) {
        this.renderLayers = renderLayers;
    }
}
