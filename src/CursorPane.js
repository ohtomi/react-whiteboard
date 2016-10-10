import React from 'react';
import d3 from 'd3';


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
        const that = this;
        d3.select(this.refs.cursorLayer).on('mousemove.canvas', () => {
            const point = [d3.event.offsetX, d3.event.offsetY - 2];
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3.select(this.refs.cursorLayer).on('click', () => {
            const point = [d3.event.offsetX, d3.event.offsetY - 2];
            that.context.emitter.emit('click.canvas', point);
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
            <div ref="cursorLayer" style={cursorLayerStyle}></div>
        );
    }

}
