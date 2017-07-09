import * as Constants from './Constants';

export default class DataHolder {

    constructor() {
        this.layer = 0;
        this.eventList = [];
        this.undoList = [];
        this.renderLayers = [];
    }

    drawDataList() {
        return this.eventList
            .reduce((prev, element) => {
                if (!element.type) {
                    prev.forEach(p => {
                        p.push({
                            type: null,
                            strokeWidth: null,
                            strokeColor: null,
                            values: [],
                        });
                    });
                    return prev;
                }

                if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                    if (!prev[element.layer]) {
                        prev[element.layer] = [{
                            type: null,
                            strokeWidth: null,
                            strokeColor: null,
                            values: [],
                        }];
                    }

                    let last = prev[element.layer][prev[element.layer].length - 1];
                    if (last.type === element.type) {
                        last.type = element.type;
                        last.strokeWidth = element.strokeWidth;
                        last.strokeColor = element.strokeColor;
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
                    if (!prev[element.layer]) {
                        prev[element.layer] = [{
                            type: null,
                            strokeWidth: null,
                            strokeColor: null,
                            values: [],
                        }];
                    }

                    prev[element.layer].push({
                        type: element.type,
                        values: [element.image],
                    });
                    return prev;

                } else {
                    return prev;
                }
            }, [[{
                type: null,
                strokeWidth: null,
                strokeColor: null,
                values: [],
            }]])
            .filter((element, index) => {
                return this.renderLayers[index];
            })
            .reduce((prev, element) => {
                return prev.concat(element);
            }, [])
            .filter((element) => {
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
