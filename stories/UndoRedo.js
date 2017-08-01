import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

import {Whiteboard, EventStream, EventStore} from '../src/index';


storiesOf('Undo & Redo', module)
    .add('draw lines', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            events.selectLayer(0);

            events.changeStrokeColor('blue');
            events.changeStrokeWidth(5);
            events.startDrawing(100, 100);
            events.pushPoint(100, 200);
            events.pushPoint(200, 200);
            events.pushPoint(200, 100);
            events.pushPoint(110, 100);
            events.stopDrawing();
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        );
    })
    .add('undo', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            events.selectLayer(0);

            events.changeStrokeColor('blue');
            events.changeStrokeWidth(5);
            events.startDrawing(100, 100);
            events.pushPoint(100, 200);
            events.pushPoint(200, 200);
            events.pushPoint(200, 100);
            events.pushPoint(110, 100);
            events.stopDrawing();

            events.undo();
            events.undo();
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        );
    })
    .add('redo', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            events.selectLayer(0);

            events.changeStrokeColor('blue');
            events.changeStrokeWidth(5);
            events.startDrawing(100, 100);
            events.pushPoint(100, 200);
            events.pushPoint(200, 200);
            events.pushPoint(200, 100);
            events.pushPoint(110, 100);
            events.stopDrawing();

            events.undo();
            events.undo();

            events.redo();
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        );
    })
    .add('redo then draw line', () => {
        const events = new EventStream();
        const eventStore = new EventStore();
        const style = {
            backgroundColor: 'lightyellow'
        };

        requestAnimationFrame(() => {
            events.selectLayer(0);

            events.changeStrokeColor('blue');
            events.changeStrokeWidth(5);
            events.startDrawing(100, 100);
            events.pushPoint(100, 200);
            events.pushPoint(200, 200);
            events.pushPoint(200, 100);
            events.pushPoint(110, 100);
            events.stopDrawing();

            events.undo();
            events.undo();

            events.redo();

            events.startDrawing(200, 100); // then delete undo stack
            events.pushPoint(300, 100);
            events.stopDrawing();

            events.redo(); // nothing to draw because undo stack is empty
        });

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        );
    });
