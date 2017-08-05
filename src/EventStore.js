// @flow

import * as Constants from './Constants';


export type PointType = {
    x: number,
    y: number
};

export type ImageType = {
    x?: number,
    y?: number,
    width: number,
    height: number,
    dataUrl: string
};

export type MoveType = {
    x: number,
    y: number
};

export default class EventStore {

    selectedLayer: number;
    renderableLayers: Array<boolean>;
    goodEvents: Array<Object>;
    undoEvents: Array<Object>;

    constructor() {
        this.selectedLayer = 0;
        this.renderableLayers = [true];
        this.goodEvents = [];
        this.undoEvents = [];
    }

    lastImage(): ?ImageType {
        const last = this.goodEvents[this.goodEvents.length - 1];
        if (last && last.type === Constants.SVG_ELEMENT_TYPE.IMAGE) {
            return last.image;
        } else {
            return null;
        }
    }

    reduceEvents() {
        return this.goodEvents.reduce((prev, element) => {
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

    startDrawing(strokeWidth: number, strokeColor: string, point: PointType) {
        this.goodEvents.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
    }

    stopDrawing() {
        this.goodEvents.push({});
    }

    selectLayer(layer: number) {
        this.goodEvents.push({});
        this.selectedLayer = layer;
    }

    addLayer() {
        this.renderableLayers.push(true);
    }

    pasteImage(image: ImageType) {
        this.goodEvents.push({
            type: Constants.SVG_ELEMENT_TYPE.IMAGE,
            layer: this.selectedLayer,
            image: image
        });
        this.undoEvents = [];
    }

    dragImage(move: MoveType) {
        const lastImage = this.lastImage();
        if (lastImage) {
            lastImage.x = lastImage.x + move.x;
            lastImage.y = lastImage.y + move.y;
        }
    }

    nwResizeImage(move: MoveType) {
        const lastImage = this.lastImage();
        if (lastImage) {
            lastImage.x = lastImage.x + move.x;
            lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width - move.x;
            lastImage.height = lastImage.height - move.y;
        }
    }

    neResizeImage(move: MoveType) {
        const lastImage = this.lastImage();
        if (lastImage) {
            // lastImage.x = lastImage.x + move.x;
            lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width + move.x;
            lastImage.height = lastImage.height - move.y;
        }
    }

    seResizeImage(move: MoveType) {
        const lastImage = this.lastImage();
        if (lastImage) {
            // lastImage.x = lastImage.x + move.x;
            // lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width + move.x;
            lastImage.height = lastImage.height + move.y;
        }
    }

    swResizeImage(move: MoveType) {
        const lastImage = this.lastImage();
        if (lastImage) {
            lastImage.x = lastImage.x + move.x;
            // lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width - move.x;
            lastImage.height = lastImage.height + move.y;
        }
    }

    pushPoint(strokeWidth: number, strokeColor: string, point: PointType) {
        this.goodEvents.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point,
        });
        this.undoEvents = [];
    }

    undo() {
        if (this.goodEvents.length) {
            this.undoEvents.push(this.goodEvents.pop()); // {}
            this.undoEvents.push(this.goodEvents.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.goodEvents.push({});
        }
    }

    redo() {
        if (this.undoEvents.length) {
            this.goodEvents.pop();
            this.goodEvents.push(this.undoEvents.pop()); // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.goodEvents.push(this.undoEvents.pop()); // {}
        }
    }

    clear() {
        this.goodEvents = [];
        this.undoEvents = [];
    }
}
