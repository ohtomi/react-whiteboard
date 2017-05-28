export default class DataHolder {

    constructor() {
        this.dataset = [];
        this.undoStack = [];
    }

    startDrawing(strokeWidth, strokeColor, point) {
        this.dataset.push({
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
    }

    stopDrawing() {
        this.dataset.push({});
    }

    changeStrokeWidth(width) {
        this.dataset.push({});
    }

    changeStrokeColor(color) {
        this.dataset.push({});
    }

    pushPoint(strokeWidth, strokeColor, point) {
        this.dataset.push({
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
}
