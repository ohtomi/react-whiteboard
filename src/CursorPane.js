import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';


export default class CursorPane extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dragStart: null,
        };
    }

    onClickCursorLayer(ev) {
        let eventToPoint = (ev) => {
            const x = ev.nativeEvent.offsetX - 2;
            const y = ev.nativeEvent.offsetY + (2 * (this.props.strokeWidth / 3));
            return [x, y];
        };

        if (this.props.mode === Constants.MODE.HAND) {
            this.context.events.startDrawing(...eventToPoint(ev));
        } else {
            this.context.events.stopDrawing();
        }
    }

    onMouseMoveCursorLayer(ev) {
        let eventToPoint = (ev) => {
            const x = ev.nativeEvent.offsetX - 2;
            const y = ev.nativeEvent.offsetY + (2 * (this.props.strokeWidth / 3));
            return [x, y];
        };

        if (this.props.mode === Constants.MODE.DRAW_LINE) {
            this.context.events.pushPoint(...eventToPoint(ev));
        } else if (this.props.mode === Constants.MODE.DRAG_IMAGE) {
            const moveX = ev.nativeEvent.offsetX - this.state.dragStart.x;
            const moveY = ev.nativeEvent.offsetY - this.state.dragStart.y;
            this.context.events.dragImage(moveX, moveY);
        }
    }

    onClickDragHandle(ev) {
        if (this.props.mode === Constants.MODE.HAND) {
            this.setState({dragStart: {x: ev.nativeEvent.offsetX, y: ev.nativeEvent.offsetY}});
            this.context.events.startDragging();
        } else {
            this.setState({dragStart: null});
            this.context.events.stopDragging();
        }
        ev.preventDefault();
        ev.stopPropagation();
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
            <div style={cursorLayerStyle}
                 onClick={this.onClickCursorLayer.bind(this)} onMouseMove={this.onMouseMoveCursorLayer.bind(this)}>
                {this.renderImageHandle()}
            </div>
        );
    }

    renderImageHandle() {
        const last = this.props.eventStore.goodEvents[this.props.eventStore.goodEvents.length - 1];
        if (!last || !last.type || last.type !== Constants.SVG_ELEMENT_TYPE.IMAGE) {
            return;
        }

        const base = (last.image.width < last.image.height) ? last.image.width : last.image.height;
        const unit = (base / 8) < 20 ? Math.ceil(base / 8) : 20;

        const dragHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: last.image.y + unit,
            left: last.image.x + unit,
            width: last.image.width - (unit * 2),
            height: last.image.height - (unit * 2),
            cursor: 'move',
        };

        return ([
            <div key="drag" onClick={this.onClickDragHandle.bind(this)} style={dragHandleStyle}></div>
        ]);
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
