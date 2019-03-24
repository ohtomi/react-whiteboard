// @flow

import React from 'react'

import * as Constants from './Constants'
import type {AnyReducedEventType, ImageDataType, PointDataType} from './EventStore'
import EventStore from './EventStore'


type propsType = {
    eventStore: EventStore,
    width: number,
    height: number,
    style: {
        backgroundColor: string
    }
};

type stateType = {};

export default class CanvasPane extends React.Component<propsType, stateType> {

    props: propsType
    state: stateType

    svgElement: ?Element

    constructor(props: propsType) {
        super(props)

        this.svgElement = null
    }

    getSvgElement(): ?Element {
        return this.svgElement
    }

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height
        }

        return (
            <div style={canvasLayerStyle}>
                <svg ref={element => this.svgElement = element}
                     version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                     width={this.props.width} height={this.props.height}>
                    <rect width={'100%'} height={'100%'} fill={this.props.style.backgroundColor}/>
                    {this.drawWhiteboardCanvas()}
                    {this.drawImageBorder()}
                </svg>
            </div>
        )
    }

    drawWhiteboardCanvas(): Array<?React$Element<any>> {
        return this.props.eventStore.reduceEvents().map((element: AnyReducedEventType, index: number): ?React$Element<any> => {
            if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                const key = index
                const d = element.values.map((point: PointDataType, index: number) => {
                    if (index === 0) {
                        return 'M ' + point.x + ' ' + point.y
                    } else {
                        return 'L ' + point.x + ' ' + point.y
                    }
                })

                return (
                    <path key={key} d={d.join(' ')} fill="none" stroke={element.strokeColor} strokeWidth={element.strokeWidth}/>
                )

            } else if (element.type === Constants.SVG_ELEMENT_TYPE.IMAGE) {
                const key = index
                const image: ImageDataType = element.image

                return (
                    <image key={key} x={image.x} y={image.y} width={image.width} height={image.height} xlinkHref={image.dataUrl}/>
                )

            } else {
                return null
            }
        })
    }

    drawImageBorder(): ?React$Element<any> {
        const lastImage = this.props.eventStore.lastImage()
        if (!lastImage) {
            return null
        }

        return (
            <rect x={lastImage.x} y={lastImage.y} width={lastImage.width} height={lastImage.height}
                  fill={'none'} stroke={'black'} strokeDasharray={'5,5'}/>
        )
    }
}
