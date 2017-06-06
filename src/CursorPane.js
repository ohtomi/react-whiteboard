import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';


export default class CursorPane extends React.Component {

    componentDidMount() {
        this.setupEventHandler();
    }

    setupEventHandler() {
        let eventToPoint = (ev) => {
            const x = ev.offsetX - 2;
            const y = ev.offsetY + (2 * (this.props.strokeWidth / 3));
            return [x, y];
        };

        this.cursorLayer.addEventListener('click', (ev) => {
            if (this.props.mode === Constants.MODE.HAND) {
                this.context.events.startDrawing(...eventToPoint(ev));
            } else {
                this.context.events.stopDrawing();
            }
        });

        this.cursorLayer.addEventListener('mousemove', (ev) => {
            if (this.props.mode === Constants.MODE.LINE) {
                this.context.events.pushPoint(...eventToPoint(ev));
            }
        });
    }

    render() {
        const cursorLayerStyle = {
            position: 'absolute',
            zIndex: 2000,
            width: this.props.width,
            height: this.props.height,
            borderStyle: 'none none solid none',
            borderColor: this.props.strokeColor,
        };

        return (
            <div ref={cursorLayer => this.cursorLayer = cursorLayer} style={cursorLayerStyle}></div>
        );
    }
}

CursorPane.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    mode: PropTypes.object,
    strokeWidth: PropTypes.number,
    strokeColor: PropTypes.string,
};

CursorPane.contextTypes = {
    events: PropTypes.object,
};
