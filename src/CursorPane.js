import React from 'react';
import d3 from 'd3';
import {CURSOR_LAYER_RELATIVE_TOP} from './Constant';


export default class CursorPane extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            strokeColor: React.PropTypes.string,
        };
    }

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object,
        };
    }

    componentDidMount() {
        let that = this;
        d3.select(this.refs.cursorLayer).on('mousemove.canvas', () => {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3.select(this.refs.cursorLayer).on('click', () => {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - CURSOR_LAYER_RELATIVE_TOP];
            that.context.emitter.emit('click.canvas', point);
        });
    }

    render() {
        let cursorLayerStyle = {
            position: 'absolute',
            top: -CURSOR_LAYER_RELATIVE_TOP,
            zIndex: 2000,
            width: this.props.width,
            height: this.props.height,
            cursor: 'url(css/ic_edit_' + this.props.strokeColor + '_24px.svg), default',
        };

        return (
            <div ref="cursorLayer" style={cursorLayerStyle}></div>
        );
    }

}
