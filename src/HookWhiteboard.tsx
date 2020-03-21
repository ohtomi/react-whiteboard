import React, {useEffect, useState} from "react";

import {ModeEnum, ResizeImageDirection} from './Constants'
import {ChangeStrokeColor, ChangeStrokeWidth, EventNameEnum, EventStream} from './EventStream'
import {EventStore, ImageData, MouseMoveData, PointData} from './EventStore'
import {CursorPane} from "./CursorPane";
import {CanvasPane} from "./CanvasPane";

type Props = {
    events: EventStream,
    store: EventStore,
    width: number,
    height: number,
    style: {
        backgroundColor: string
    }
    setEventStore: Function,
}

export function HookWhiteboard(props: Props) {
    const {store, width, height = 400, style, events = new EventStream()} = props;

    const [eventStore, setEventStore] = useState(store);
    const [mode, setMode] = useState(ModeEnum.HAND);
    const [layer, setLayer] = useState(0);
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [strokeColor, setStrokeColor] = useState('black');
    const [canvas, setCanvas] = useState(null);

    function getSvgElement(): SVGSVGElement | undefined {
        if (canvas) {
            return canvas.getSvgElement()
        }
    }

    useEffect(() => setupEventHandler(), []);

    function setupEventHandler() {
        events.on(EventNameEnum.SELECT_LAYER, (layer) => selectLayer(layer));
        events.on(EventNameEnum.ADD_LAYER, () => addLayer());

        events.on(EventNameEnum.START, (point) => startDrawing(point));
        events.on(EventNameEnum.STOP, () => stopDrawing());

        events.on(EventNameEnum.SET, (event: ChangeStrokeWidth | ChangeStrokeColor) => {
            if (event.key === 'strokeWidth') {
                changeStrokeWidth(event.value)
            }
            if (event.key === 'strokeColor') {
                changeStrokeColor(event.value)
            }
        });

        events.on(EventNameEnum.PUSH, (point) => pushPoint(point));

        events.on(EventNameEnum.PASTE, (image) => pasteImage(image));
        events.on(EventNameEnum.START_DRAGGING, () => startDragging());
        events.on(EventNameEnum.STOP_DRAGGING, () => stopDragging());
        events.on(EventNameEnum.DRAG, (move) => dragImage(move));
        events.on(EventNameEnum.START_RESIZING, (direction) => startResizing(direction));
        events.on(EventNameEnum.STOP_RESIZING, () => stopResizing());
        events.on(EventNameEnum.RESIZE, (move) => resizeImage(move));

        events.on(EventNameEnum.UNDO, () => undo());
        events.on(EventNameEnum.REDO, () => redo());
        events.on(EventNameEnum.CLEAR, () => clear());
    }


    function selectLayer(layer: number) {
        eventStore.selectLayer(layer)
        setLayer(layer);
        setEventStore(eventStore);
    }

    function addLayer() {
        eventStore.addLayer();
        setEventStore(eventStore);
    }

    function startDrawing(point: PointData) {
        eventStore.startDrawing(strokeWidth, strokeColor, point);
        setMode(ModeEnum.DRAW_LINE);
        setEventStore(eventStore);
    }

    function stopDrawing() {
        eventStore.stopDrawing();
        setMode(ModeEnum.HAND);
        setEventStore(eventStore);
    }

    function changeStrokeWidth(width: number) {
        eventStore.stopDrawing();
        setStrokeWidth(width);
        setEventStore(eventStore);
    }

    function changeStrokeColor(color: string) {
        eventStore.stopDrawing();
        setStrokeColor(color);
        setEventStore(eventStore);
    }

    function pushPoint(point: PointData) {
        eventStore.pushPoint(strokeWidth, strokeColor, point);
        setEventStore(eventStore);
    }

    function pasteImage(image: ImageData) {
        eventStore.pasteImage(image);
        setEventStore(eventStore);
    }

    function startDragging() {
        setMode(ModeEnum.DRAG_IMAGE);
    }

    function stopDragging() {
        setMode(ModeEnum.HAND);
    }

    function dragImage(move: MouseMoveData) {
        if (mode !== ModeEnum.DRAG_IMAGE) {
            return;
        }

        eventStore.dragImage(move);
        setEventStore(eventStore);
    }

    function startResizing(direction: ResizeImageDirection) {
        setMode(direction);
    }

    function stopResizing() {
        setMode(ModeEnum.HAND);
    }

    function resizeImage(move: MouseMoveData) {
        if (mode === ModeEnum.NW_RESIZE_IMAGE) {
            eventStore.nwResizeImage(move);
            setEventStore(eventStore);
        } else if (mode === ModeEnum.NE_RESIZE_IMAGE) {
            eventStore.neResizeImage(move);
            setEventStore(eventStore);
        } else if (mode === ModeEnum.SE_RESIZE_IMAGE) {
            eventStore.seResizeImage(move);
            setEventStore(eventStore);
        } else if (mode === ModeEnum.SW_RESIZE_IMAGE) {
            eventStore.swResizeImage(move);
            setEventStore(eventStore);
        }
    }

    function undo() {
        eventStore.undo();
        setEventStore(eventStore);
    }

    function redo() {
        eventStore.redo();
        setEventStore(eventStore);
    }

    function clear() {
        eventStore.clear();
        setEventStore(eventStore);
    }

    const wrapperStyle = {
        position: 'relative' as 'relative',
        width: width,
        height: height
    };

    const lowerProps = {
        ...props,
        mode,
        layer,
        strokeWidth,
        strokeColor,
        eventStore,
    };

    return (
        <div style={wrapperStyle}>
            <CursorPane {...lowerProps}/>
            <CanvasPane ref={canvas => setCanvas(canvas)} {...lowerProps}/>
        </div>
    )
}
