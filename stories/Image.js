import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {Whiteboard, EventStream, EventStore, SvgConverter, Constants} from '../src/index';


storiesOf('Image', module)
    .add('paste image', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl);
                });
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                <Whiteboard events={events} eventStore={eventStore} width={600} height={600} style={style}/>
            </div>
        );
    })
    .add('resize image', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl);
                    events.startResizing(Constants.MODE.NW_RESIZE_IMAGE);
                    events.resizeImage(150, 150);
                    events.stopResizing();
                });
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                <Whiteboard events={events} eventStore={eventStore} width={600} height={600} style={style}/>
            </div>
        );
    })
    .add('drag image', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl);
                    events.startResizing(Constants.MODE.NW_RESIZE_IMAGE);
                    events.resizeImage(150, 150);
                    events.stopResizing();
                    events.startDragging();
                    events.dragImage(-150, -150);
                    events.stopDragging();
                });
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                <Whiteboard events={events} eventStore={eventStore} width={600} height={600} style={style}/>
            </div>
        );
    })
    .add('download whiteboard', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        let whiteboardEl, linkEl;

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl);
                    events.startResizing(Constants.MODE.NW_RESIZE_IMAGE);
                    events.resizeImage(150, 150);
                    events.stopResizing();
                    events.startDragging();
                    events.dragImage(-150, -150);
                    events.stopDragging();
                    events.stopDrawing();

                    const svgEl = whiteboardEl.getSvgElement();
                    SvgConverter.toPngData(svgEl)
                        .then(data => {
                            linkEl.href = data;
                        });
                });
        });

        return (
            <div>
                <a ref={link => linkEl = link} href="#" download="react-whiteboard.png">download as png</a>
                <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                    <Whiteboard ref={whiteboard => whiteboardEl = whiteboard}
                                events={events} eventStore={eventStore} width={600} height={600} style={style}/>
                </div>
            </div>
        );
    });
