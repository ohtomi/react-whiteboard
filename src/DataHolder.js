import * as Constants from './Constants';

export default class DataHolder {

    constructor() {
        this.selectedLayer = 0;
        this.renderableLayers = [true];
        this.eventList = [];
        this.undoList = [];
    }

    drawDataList() {
        return this.eventList.reduce((prev, element) => {
            if (!element.type) {
                prev.forEach(p => {
                    p.push({});
                });
                return prev;
            }

            if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                let last = prev[element.layer][prev[element.layer].length - 1];
                if (last && last.type === element.type && last.strokeWidth === element.strokeWidth && last.strokeColor === element.strokeColor) {
                    last.values.push(element.point);
                } else {
                    prev[element.layer].push({
                        type: element.type,
                        strokeWidth: element.strokeWidth,
                        strokeColor: element.strokeColor,
                        values: [element.point],
                    });
                }
                return prev;

            } else if (element.type === Constants.SVG_ELEMENT_TYPE.IMAGE) {
                prev[element.layer].push({
                    type: element.type,
                    values: [element.image],
                });
                return prev;

            } else {
                return prev;
            }

        }, this.renderableLayers.map(() => [])).filter((element, index) => {
            return this.renderableLayers[index];

        }).reduce((prev, element) => {
            return prev.concat(element);

        }, []).filter((element) => {
            if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                return element.values.length > 1;
            } else if (element.type === Constants.SVG_ELEMENT_TYPE.IMAGE) {
                return element.values.length === 1;
            } else {
                return true;
            }
        });
    }

    startDrawing(strokeWidth, strokeColor, point) {
        this.eventList.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
    }

    stopDrawing() {
        this.eventList.push({});
    }

    selectLayer(layer) {
        this.eventList.push({});
        this.selectedLayer = layer;
    }

    addLayer() {
        this.renderableLayers.push(true);
    }

    pasteImage(image) {
        this.eventList.push({
            type: Constants.SVG_ELEMENT_TYPE.IMAGE,
            layer: this.selectedLayer,
            image: image
        });
        this.undoList = [];
    }

    pushPoint(strokeWidth, strokeColor, point) {
        this.eventList.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
        this.undoList = [];
    }

    undo() {
        if (this.eventList.length) {
            this.undoList.push(this.eventList.pop()); // {}
            this.undoList.push(this.eventList.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.eventList.push({});
        }
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
}
