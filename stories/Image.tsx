import * as React from 'react'
import {storiesOf} from '@storybook/react'

import {EventStore, EventStream, ModeEnum, SvgConverter, Whiteboard} from '../src/index'


storiesOf('Image', module)
    .add('paste image', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://4.bp.blogspot.com/-add9p_TiRII/V9PE77mE44I/AAAAAAAA9kk/1JeafQlm6-QFxt--xA5gMWrPl2EZyKTMgCLcB/s400/kjhou_board.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl)
                })
        })

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                <Whiteboard events={events} eventStore={eventStore} width={600} height={600} style={style}/>
            </div>
        )
    })
    .add('resize image', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://4.bp.blogspot.com/-add9p_TiRII/V9PE77mE44I/AAAAAAAA9kk/1JeafQlm6-QFxt--xA5gMWrPl2EZyKTMgCLcB/s400/kjhou_board.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl)
                    events.startResizing(ModeEnum.NW_RESIZE_IMAGE)
                    events.resizeImage(150, 150)
                    events.stopResizing()
                })
        })

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                <Whiteboard events={events} eventStore={eventStore} width={600} height={600} style={style}/>
            </div>
        )
    })
    .add('drag image', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://4.bp.blogspot.com/-add9p_TiRII/V9PE77mE44I/AAAAAAAA9kk/1JeafQlm6-QFxt--xA5gMWrPl2EZyKTMgCLcB/s400/kjhou_board.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl)
                    events.startResizing(ModeEnum.NW_RESIZE_IMAGE)
                    events.resizeImage(150, 150)
                    events.stopResizing()
                    events.startDragging()
                    events.dragImage(-150, -150)
                    events.stopDragging()
                })
        })

        return (
            <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                <Whiteboard events={events} eventStore={eventStore} width={600} height={600} style={style}/>
            </div>
        )
    })
    .add('download whiteboard', () => {
        const events = new EventStream()
        const eventStore = new EventStore()
        const style = {
            backgroundColor: 'lightyellow'
        }

        let whiteboardEl: Whiteboard, linkEl: HTMLAnchorElement

        requestAnimationFrame(() => {
            SvgConverter.fromPngImage('https://4.bp.blogspot.com/-add9p_TiRII/V9PE77mE44I/AAAAAAAA9kk/1JeafQlm6-QFxt--xA5gMWrPl2EZyKTMgCLcB/s400/kjhou_board.png')
                .then(image => {
                    events.pasteImage(50, 50, image.width, image.height, image.dataUrl)
                    events.startResizing(ModeEnum.NW_RESIZE_IMAGE)
                    events.resizeImage(150, 150)
                    events.stopResizing()
                    events.startDragging()
                    events.dragImage(-150, -150)
                    events.stopDragging()
                    events.stopDrawing()

                    const svgEl = whiteboardEl.getSvgElement()
                    SvgConverter.toPngData(svgEl)
                        .then(data => {
                            linkEl.href = data
                        })
                })
        })

        return (
            <div>
                <a ref={link => linkEl = link} href="#" download="react-whiteboard.png">download as png</a>
                <div style={{backgroundColor: 'lightblue', padding: 10, width: 600, height: 600}}>
                    <Whiteboard ref={whiteboard => whiteboardEl = whiteboard}
                                events={events} eventStore={eventStore} width={600} height={600} style={style}/>
                </div>
            </div>
        )
    })
