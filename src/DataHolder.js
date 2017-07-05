export default class DataHolder {

    constructor() {
        this.layer = 0;
        this.dataset = [];
        this.undoStack = [];
        this.renderLayers = [];
        this.backgroundImage = undefined;
    }

    startDrawing(strokeWidth, strokeColor, point) {
        this.dataset.push({
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
        this.backgroundImage = image;
    }

    pushPoint(strokeWidth, strokeColor, point) {
        this.dataset.push({
            layer: this.layer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
        this.undoStack = [];
    }

    undoPoint() {
        this.undoStack.push(this.dataset.pop()); // {}
        this.undoStack.push(this.dataset.pop()); // {point: [...], ...}
        this.dataset.push({});
    }

    redoPoint() {
        if (this.undoStack.length) {
            this.dataset.pop();
            this.dataset.push(this.undoStack.pop()); // {point: [...], ...}
            this.dataset.push(this.undoStack.pop()); // {}
        }
    }

    clearPoint() {
        this.dataset = [];
        this.undoStack = [];
    }

    changeRenderLayers(renderLayers) {
        this.renderLayers = renderLayers;
    }
}
