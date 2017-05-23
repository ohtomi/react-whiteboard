export default class DataHolder {

    constructor() {
        this.dataset = [];
        this.undoStack = [];
    }

    startDrawing(strokeWidth, strokeColor, point) {
        this.dataset.push({
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            values: [point],
        });
    }

    pushPoint(strokeWidth, strokeColor, point) {
        const current = this.dataset[this.dataset.length - 1];

        if (current && current.strokeWidth === strokeWidth && current.strokeColor === strokeColor) {
            current.values.push(point);
            this.undoStack = [];

        } else {
            this.dataset.push({
                strokeWidth: strokeWidth,
                strokeColor: strokeColor,
                values: [point],
            });
            this.undoStack = [];
        }
    }

    undoPoint() {
        const current = this.dataset[this.dataset.length - 1];

        if (current && current.values.length > 1) {
            const point = current.values.pop();
            const undoOperation = () => {
                current.values.push(point);
            };
            this.undoStack.push(undoOperation);

        } else if (current && current.values.length === 1) {
            this.dataset.pop();
            const undoOperation = () => {
                this.dataset.push(current);
            };
            this.undoStack.push(undoOperation);
        }
    }

    redoPoint() {
        const redoOperation = this.undoStack.pop();
        if (redoOperation) {
            redoOperation();
        }
    }

    clearPoint() {
        this.dataset = [];
        this.undoStack = [];
    }
}
