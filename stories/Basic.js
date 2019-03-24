import React from 'react'
import {storiesOf} from '@storybook/react'

import {EventStore, EventStream, Whiteboard} from '../src/index'


storiesOf('Basic', module)
    .add('plain', () => {
        const events = new EventStream()
        const eventStore = new EventStore()

        return (
            <Whiteboard events={events} eventStore={eventStore} width={450} height={450}/>
        )
    })
    .add('background color', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        return (
            <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
        )
    })
    .add('container div', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        )
    })
    .add('draw lines', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        requestAnimationFrame(() => {
            events.selectLayer(0)

            events.changeStrokeColor('blue')
            events.changeStrokeWidth(5)
            events.startDrawing(100, 100)
            events.pushPoint(100, 200)
            events.pushPoint(200, 200)
            events.stopDrawing()

            events.changeStrokeColor('green')
            events.changeStrokeWidth(7)
            events.startDrawing(200, 200)
            events.pushPoint(200, 100)
            events.pushPoint(100, 100)
            events.stopDrawing()
        })

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        )
    })
