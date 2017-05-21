import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';


export default class CursorPane extends React.Component {

    componentDidMount() {
        this.cursorLayer.addEventListener('click', (ev) => {
            if (this.props.mode === Constants.MODE.HAND) {
                const x = ev.offsetX - 2;
                const y = ev.offsetY + (2 * (this.props.strokeWidth / 3));
                this.context.events.startDrawing(x, y);
            } else {
                this.context.events.stopDrawing();
            }
        });
        this.cursorLayer.addEventListener('mousemove', (ev) => {
            const x = ev.offsetX - 2;
            const y = ev.offsetY + (2 * (this.props.strokeWidth / 3));
            this.context.events.pushPoint(x, y);
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
