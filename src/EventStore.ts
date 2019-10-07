import {SvgElementEnum} from './Constants'


export type PointData = {
    x: number,
    y: number
}

export type ImageData = {
    x?: number,
    y?: number,
    width: number,
    height: number,
    dataUrl: string
}

export type MouseMoveData = {
    x: number,
    y: number
}

export type PointEvent = {
    type: typeof SvgElementEnum.LINE,
    layer: number,
    strokeWidth: number,
    strokeColor: string,
    point: PointData
}

export type ImageEvent = {
    type: typeof SvgElementEnum.IMAGE,
    layer: number,
    image: ImageData
}

export type StopEvent = {
    type: null
}

export type AnyEvent = PointEvent | ImageEvent | StopEvent

export type ReducedLineEvent = {
    type: typeof SvgElementEnum.LINE,
    strokeWidth: number,
    strokeColor: string,
    values: Array<PointData>
}

export type ReducedImageEvent = {
    type: typeof SvgElementEnum.IMAGE,
    image: ImageData
}

export type ReducedStopEvent = {
    type?: null
}

export type AnyReducedEvent = ReducedLineEvent | ReducedImageEvent | ReducedStopEvent

export const isPointEvent = (arg: AnyEvent): arg is PointEvent => {
    return arg.type === SvgElementEnum.LINE
}

export const isImageEvent = (arg: AnyEvent): arg is ImageEvent => {
    return arg.type === SvgElementEnum.IMAGE
}

export const isReducedLineEvent = (arg: AnyReducedEvent): arg is ReducedLineEvent => {
    return arg.type === SvgElementEnum.LINE
}

export const isReducedImageEvent = (arg: AnyReducedEvent): arg is ReducedImageEvent => {
    return arg.type === SvgElementEnum.IMAGE
}

export interface EventStoreProtocol {

    lastImage(): ImageData | undefined

    reduceEvents(): Array<AnyReducedEvent>

    selectLayer(layer: number): void

    addLayer(): void

    startDrawing(strokeWidth: number, strokeColor: string, point: PointData): void

    stopDrawing(): void

    pushPoint(strokeWidth: number, strokeColor: string, point: PointData): void

    pasteImage(image: ImageData): void

    dragImage(move: MouseMoveData): void

    nwResizeImage(move: MouseMoveData): void

    neResizeImage(move: MouseMoveData): void

    seResizeImage(move: MouseMoveData): void

    swResizeImage(move: MouseMoveData): void

    undo(): void

    redo(): void

    clear(): void
}


export class EventStore implements EventStoreProtocol {

    selectedLayer: number
    renderableLayers: Array<boolean>
    goodEvents: Array<AnyEvent>
    undoEvents: Array<AnyEvent>

    constructor() {
        this.selectedLayer = 0
        this.renderableLayers = [true]
        this.goodEvents = []
        this.undoEvents = []
    }

    lastImage(): ImageData | undefined {
        const last = this.goodEvents[this.goodEvents.length - 1]
        if (last && isImageEvent(last)) {
            return last.image
        } else {
            return null
        }
    }

    reduceEvents(): Array<AnyReducedEvent> {
        return this.goodEvents.reduce((prev: Array<Array<AnyReducedEvent>>, element: AnyEvent): Array<Array<AnyReducedEvent>> => {
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
                        const event: ReducedLineEvent = {
                            type: element.type,
                            strokeWidth: element.strokeWidth,
                            strokeColor: element.strokeColor,
                            values: [element.point]
                        }
                        prev[element.layer].push(event)
                    }
                    return prev

                } else if (isImageEvent(element)) {
                    const event: ReducedImageEvent = {
                        type: element.type,
                        image: element.image
                    }
                    prev[element.layer].push(event)
                    return prev

                } else {
                    return prev
                }

            }, this.renderableLayers.map(() => [])
        ).filter((element: Array<AnyReducedEvent>, index: number): boolean => {
            return this.renderableLayers[index]

        }).reduce((prev: Array<AnyReducedEvent>, element: Array<AnyReducedEvent>): Array<AnyReducedEvent> => {
                return prev.concat(element)

            }, []
        ).filter((element: AnyReducedEvent): boolean => {
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

    startDrawing(strokeWidth: number, strokeColor: string, point: PointData) {
        this.goodEvents.push({
            type: SvgElementEnum.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point
        })
    }

    stopDrawing() {
        this.goodEvents.push({type: null})
    }

    pushPoint(strokeWidth: number, strokeColor: string, point: PointData) {
        const event: PointEvent = {
            type: SvgElementEnum.LINE,
            layer: this.selectedLayer,
            strokeWidth: strokeWidth,
            strokeColor: strokeColor,
            point: point
        }
        this.goodEvents.push(event)
        this.undoEvents = []
    }

    pasteImage(image: ImageData) {
        const event: ImageEvent = {
            type: SvgElementEnum.IMAGE,
            layer: this.selectedLayer,
            image: image
        }
        this.goodEvents.push(event)
        this.undoEvents = []
    }

    dragImage(move: MouseMoveData) {
        const lastImage = this.lastImage()
        if (lastImage) {
            lastImage.x = lastImage.x + move.x
            lastImage.y = lastImage.y + move.y
        }
    }

    nwResizeImage(move: MouseMoveData) {
        const lastImage = this.lastImage()
        if (lastImage) {
            lastImage.x = lastImage.x + move.x
            lastImage.y = lastImage.y + move.y
            lastImage.width = lastImage.width - move.x
            lastImage.height = lastImage.height - move.y
        }
    }

    neResizeImage(move: MouseMoveData) {
        const lastImage = this.lastImage()
        if (lastImage) {
            // lastImage.x = lastImage.x + move.x;
            lastImage.y = lastImage.y + move.y
            lastImage.width = lastImage.width + move.x
            lastImage.height = lastImage.height - move.y
        }
    }

    seResizeImage(move: MouseMoveData) {
        const lastImage = this.lastImage()
        if (lastImage) {
            // lastImage.x = lastImage.x + move.x;
            // lastImage.y = lastImage.y + move.y;
            lastImage.width = lastImage.width + move.x
            lastImage.height = lastImage.height + move.y
        }
    }

    swResizeImage(move: MouseMoveData) {
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
