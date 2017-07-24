import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';


export default class CursorPane extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dragStart: null,
            nwResizeStart: null,
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
            const lastImage = this.props.eventStore.lastImage();
            if (!lastImage) {
                return;
            }

            const base = (lastImage.width < lastImage.height) ? lastImage.width : lastImage.height;
            const unit = (base / 8) < 20 ? Math.ceil(base / 8) : 20;

            const moveX = lastImage.x + unit < 0 ? ev.nativeEvent.offsetX - this.state.dragStart.x - (lastImage.x + unit) : ev.nativeEvent.offsetX - this.state.dragStart.x;
            const moveY = lastImage.y + unit < 0 ? ev.nativeEvent.offsetY - this.state.dragStart.y - (lastImage.y + unit) : ev.nativeEvent.offsetY - this.state.dragStart.y;

            this.context.events.dragImage(moveX, moveY);
        } else if (this.props.mode === Constants.MODE.NW_RESIZE_IMAGE) {
            const lastImage = this.props.eventStore.lastImage();
            if (!lastImage) {
                return;
            }

            this.setState({nwResizeStart: {x: ev.pageX, y: ev.pageY}});

            const moveX = lastImage.x < 0 ? ev.pageX - this.state.nwResizeStart.x - (lastImage.x ) : ev.pageX - this.state.nwResizeStart.x;
            const moveY = lastImage.y < 0 ? ev.pageY - this.state.nwResizeStart.y - (lastImage.y ) : ev.pageY - this.state.nwResizeStart.y;

            if (moveX * moveY < 0) {
                return;
            }

            if (moveX > 0) {
                this.context.events.nwResizeImage(moveY / moveX < lastImage.height / lastImage.width ? -moveX : -moveY);
            } else {
                this.context.events.nwResizeImage(moveY / moveX > lastImage.height / lastImage.width ? -moveX : -moveY);
            }
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

    onClickNwResizeHandle(ev) {
        if (this.props.mode === Constants.MODE.HAND) {
            this.setState({nwResizeStart: {x: ev.pageX, y: ev.pageY}});
            this.context.events.startNwResizing();
        } else {
            this.setState({nwResizeStart: null});
            this.context.events.stopNwResizing();
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
            <div role="presentation" style={cursorLayerStyle}
                 onClick={this.onClickCursorLayer.bind(this)} onMouseMove={this.onMouseMoveCursorLayer.bind(this)}>
                {this.renderImageHandle()}
            </div>
        );
    }

    renderImageHandle() {
        const lastImage = this.props.eventStore.lastImage();
        if (!lastImage) {
            return;
        }

        const base = (lastImage.width < lastImage.height) ? lastImage.width : lastImage.height;
        const unit = (base / 8) < 20 ? Math.ceil(base / 8) : 20;

        const top = lastImage.y + unit < 0 ? 0 : lastImage.y + unit > this.props.height ? this.props.height : lastImage.y + unit;
        const bottom = lastImage.y + lastImage.height - unit < 0 ? 0 : lastImage.y + lastImage.height - unit > this.props.height ? this.props.height : lastImage.y + lastImage.height - unit;
        const left = lastImage.x + unit < 0 ? 0 : lastImage.x + unit > this.props.width ? this.props.width : lastImage.x + unit;
        const right = lastImage.x + lastImage.width - unit < 0 ? 0 : lastImage.x + lastImage.width - unit > this.props.width ? this.props.width : lastImage.x + lastImage.width - unit;

        const dragHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: top,
            left: left,
            width: right - left,
            height: bottom - top,
            cursor: 'move',
        };

        const nwResizeHandleStyle = {
            position: 'absolute',
            zIndex: 2500,
            top: dragHandleStyle.top - unit < 0 ? 0 : dragHandleStyle.top - unit > this.props.height ? this.props.height : dragHandleStyle.top - unit,
            left: dragHandleStyle.left - unit < 0 ? 0 : dragHandleStyle.left - unit > this.props.width ? this.props.width : dragHandleStyle.left - unit,
            width: dragHandleStyle.left - (dragHandleStyle.left - unit < 0 ? 0 : dragHandleStyle.left - unit > this.props.width ? this.props.width : dragHandleStyle.left - unit),
            height: dragHandleStyle.top - (dragHandleStyle.top - unit < 0 ? 0 : dragHandleStyle.top - unit > this.props.height ? this.props.height : dragHandleStyle.top - unit),
            cursor: 'nw-resize',
        };

        return ([
            <div key="drag" role="presentation" style={dragHandleStyle} onClick={this.onClickDragHandle.bind(this)}/>,
            <div key="nw-resize" role="presentation" style={nwResizeHandleStyle} onClick={this.onClickNwResizeHandle.bind(this)}/>
        ]);
    }
}

CursorPane.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    eventStore: PropTypes.object,
    mode: PropTypes.object,
    strokeWidth: PropTypes.number,
    strokeColor: PropTypes.string,
};

CursorPane.contextTypes = {
    events: PropTypes.object,
};
