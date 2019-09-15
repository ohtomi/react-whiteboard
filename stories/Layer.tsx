import React from 'react'
import {storiesOf} from '@storybook/react'

import {EventStore, EventStream, Whiteboard} from '../src/index'


storiesOf('Layer', module)
    .add('draw lines on an upper layer', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        requestAnimationFrame(() => {
            events.addLayer()
            events.selectLayer(1)

            events.changeStrokeColor('blue')
            events.changeStrokeWidth(10)
            events.startDrawing(100, 100)
            events.pushPoint(110, 200)
            events.pushPoint(120, 100)
            events.pushPoint(130, 200)
            events.pushPoint(140, 100)
            events.pushPoint(150, 200)
            events.pushPoint(160, 100)
            events.pushPoint(170, 200)
            events.pushPoint(180, 100)
            events.pushPoint(190, 200)
            events.pushPoint(200, 100)
            events.stopDrawing()

            events.changeStrokeColor('yellow')
            events.startDrawing(50, 130)
            events.pushPoint(250, 130)
            events.stopDrawing()
            events.startDrawing(50, 150)
            events.pushPoint(250, 150)
            events.stopDrawing()
            events.startDrawing(50, 170)
            events.pushPoint(250, 170)
            events.stopDrawing()
        })

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        )
    })
    .add('draw lines on two layers', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        requestAnimationFrame(() => {
            events.addLayer()
            events.selectLayer(1)

            events.changeStrokeColor('blue')
            events.changeStrokeWidth(10)
            events.startDrawing(100, 100)
            events.pushPoint(110, 200)
            events.pushPoint(120, 100)
            events.pushPoint(130, 200)
            events.pushPoint(140, 100)
            events.pushPoint(150, 200)
            events.pushPoint(160, 100)
            events.pushPoint(170, 200)
            events.pushPoint(180, 100)
            events.pushPoint(190, 200)
            events.pushPoint(200, 100)
            events.stopDrawing()

            events.selectLayer(0)

            events.changeStrokeColor('yellow')
            events.startDrawing(50, 130)
            events.pushPoint(250, 130)
            events.stopDrawing()
            events.startDrawing(50, 150)
            events.pushPoint(250, 150)
            events.stopDrawing()
            events.startDrawing(50, 170)
            events.pushPoint(250, 170)
            events.stopDrawing()
        })

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 450, height: 450}}>
                <Whiteboard events={events} eventStore={eventStore} width={450} height={450} style={style}/>
            </div>
        )
    })
