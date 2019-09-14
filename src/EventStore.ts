import * as Constants from './Constants'


export type PointDataType = {
    x: number,
    y: number
}

export type ImageDataType = {
    x?: number,
    y?: number,
    width: number,
    height: number,
    dataUrl: string
}

export type MoveDataType = {
    x: number,
    y: number
}

export type PointEventType = {
    type: typeof Constants.SVG_ELEMENT_TYPE.LINE,
    layer: number,
    strokeWidth: number,
    strokeColor: string,
    point: PointDataType
}

export type ImageEventType = {
    type: typeof Constants.SVG_ELEMENT_TYPE.IMAGE,
    layer: number,
    image: ImageDataType
}

export type StopEventType = {
    type: null
}

export type AnyEventType = PointEventType | ImageEventType | StopEventType

export type ReducedLineEventType = {
    type: typeof Constants.SVG_ELEMENT_TYPE.LINE,
    strokeWidth: number,
    strokeColor: string,
    values: Array<PointDataType>
}

export type ReducedImageEventType = {
    type: typeof Constants.SVG_ELEMENT_TYPE.IMAGE,
    image: ImageDataType
}

export type ReducedStopEventType = {
    type?: null
}

export type AnyReducedEventType = ReducedLineEventType | ReducedImageEventType | ReducedStopEventType

export const isPointEvent = (arg: AnyEventType): arg is PointEventType => {
    return arg.type === Constants.SVG_ELEMENT_TYPE.LINE
}

export const isImageEvent = (arg: AnyEventType): arg is ImageEventType => {
    return arg.type === Constants.SVG_ELEMENT_TYPE.IMAGE
}


export const isReducedLineEvent = (arg: AnyReducedEventType): arg is ReducedLineEventType => {
    return arg.type === Constants.SVG_ELEMENT_TYPE.LINE
}

export const isReducedImageEvent = (arg: AnyReducedEventType): arg is ReducedImageEventType => {
    return arg.type === Constants.SVG_ELEMENT_TYPE.IMAGE
}

export class EventStore {

    selectedLayer: number
    renderableLayers: Array<boolean>
    goodEvents: Array<AnyEventType>
    undoEvents: Array<AnyEventType>

    constructor() {
        this.selectedLayer = 0
        this.renderableLayers = [true]
        this.goodEvents = []
        this.undoEvents = []
    }

    lastImage(): ImageDataType | undefined {
        const last = this.goodEvents[this.goodEvents.length - 1]
        if (last && isImageEvent(last)) {
            return last.image
        } else {
            return null
        }
    }

    reduceEvents(): Array<AnyReducedEventType> {
        return this.goodEvents.reduce((prev: Array<Array<AnyReducedEventType>>, element: AnyEventType): Array<Array<AnyReducedEventType>> => {
                if (!element.type) {
                    prev.forEach(p => {
                        p.push({})
                    })
                    return prev
                }

                if (isPointEvent(element)) {
                    let last = prev[element.layer][prev[element.layer].length - 1]
                    if (last && isReducedLineEvent(last) && last.strokeWidth === element.strokeWidth && last.strokeColor === element.strokeColor) {
                        last.values.push(element.point)
                    } else {
                        const event: ReducedLineEventType = {
                            type: element.type,
                            strokeWidth: element.strokeWidth,
                            strokeColor: element.strokeColor,
                            values: [element.point]
                        }
                        prev[element.layer].push(event)
                    }
                    return prev

                } else if (isImageEvent(element)) {
                    const event: ReducedImageEventType = {
                        type: element.type,
                        image: element.image
                    }
                    prev[element.layer].push(event)
                    return prev

                } else {
                    return prev
                }

            }, this.renderableLayers.map(() => [])
        ).filter((element: Array<AnyReducedEventType>, index: number): boolean => {
            return this.renderableLayers[index]

        }).reduce((prev: Array<AnyReducedEventType>, element: Array<AnyReducedEventType>): Array<AnyReducedEventType> => {
                return prev.concat(element)

            }, []
        ).filter((element: AnyReducedEventType): boolean => {
            if (isReducedLineEvent(element)) {
                return element.values.length > 1
            } else if (isReducedImageEvent(element)) {
                return true
            } else {
                return true
            }
        })
    }

    selectLayer(layer: number) {
        this.goodEvents.push({type: null})
        this.selectedLayer = layer
    }

    addLayer() {
        this.renderableLayers.push(true)
    }

    startDrawing(strokeWidth: number, strokeColor: string, point: PointDataType) {
        this.goodEvents.push({
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point
        })
    }

    stopDrawing() {
        this.goodEvents.push({type: null})
    }

    pushPoint(strokeWidth: number, strokeColor: string, point: PointDataType) {
        const event: PointEventType = {
            type: Constants.SVG_ELEMENT_TYPE.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point
        }
        this.goodEvents.push(event)
        this.undoEvents = []
    }

    pasteImage(image: ImageDataType) {
        const event: ImageEventType = {
            type: Constants.SVG_ELEMENT_TYPE.IMAGE,
            layer: this.selectedLayer,
            image: image
        }
        this.goodEvents.push(event)
        this.undoEvents = []
    }

    dragImage(move: MoveDataType) {
        const lastImage = this.lastImage()
        if (lastImage) {
            lastImage.x = lastImage.x + move.x
            lastImage.y = lastImage.y + move.y
        }
    }

    nwResizeImage(move: MoveDataType) {
        const lastImage = this.lastImage()
        if (lastImage) {
            lastImage.x = lastImage.x + move.x
            lastImage.y = lastImage.y + move.y
            lastImage.width = lastImage.width - move.x
            lastImage.height = lastImage.height - move.y
        }
    }

    neResizeImage(move: MoveDataType) {
        const lastImage = this.lastImage()
        if (lastImage) {
            // lastImage.x = lastImage.x + move.x;
            lastImage.y = lastImage.y + move.y
            lastImage.width = lastImage.width + move.x
            lastImage.height = lastImage.height - move.y
        }
    }

    seResizeImage(move: MoveDataType) {
        const lastImage = this.lastImage()
        if (lastImage) {
            // lastImage.x = lastImage.x + move.x;
            // lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width + move.x
            lastImage.height = lastImage.height + move.y
        }
    }

    swResizeImage(move: MoveDataType) {
        const lastImage = this.lastImage()
        if (lastImage) {
            lastImage.x = lastImage.x + move.x
            // lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width - move.x
            lastImage.height = lastImage.height + move.y
        }
    }

    undo() {
        if (this.goodEvents.length) {
            this.undoEvents.push(this.goodEvents.pop()) // {}
            this.undoEvents.push(this.goodEvents.pop()) // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.goodEvents.push({type: null})
        }
    }

    redo() {
        if (this.undoEvents.length) {
            this.goodEvents.pop()
            this.goodEvents.push(this.undoEvents.pop()) // {type: 'line', point: [...], ...} or {type: 'image', image: {...}, ...}
            this.goodEvents.push(this.undoEvents.pop()) // {}
        }
    }

    clear() {
        this.goodEvents = []
        this.undoEvents = []
    }
}
