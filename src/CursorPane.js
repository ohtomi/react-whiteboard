import React from 'react';
import d3selection from 'd3-selection';


export default class CursorPane extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            strokeWidth: React.PropTypes.number,
            strokeColor: React.PropTypes.string,
        };
    }

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object,
        };
    }

    tweakPoint(point) {
        if (this.props.strokeWidth <= 3) {
            return [point[0] - 2, point[1] + 2];
        } else if (this.props.strokeWidth <= 6) {
            return [point[0] - 2, point[1] + 4];
        } else {
            return [point[0] - 2, point[1] + 6];
        }
    }

    componentDidMount() {
        const that = this;
        d3selection.select(this.refs.cursorLayer).on('mousemove.canvas', () => {
            const point = that.tweakPoint([d3selection.event.offsetX, d3selection.event.offsetY]);
            that.context.emitter.emit('mousemove.canvas', point);
        });
        d3selection.select(this.refs.cursorLayer).on('click', () => {
            const point = [d3selection.event.offsetX - 2, d3selection.event.offsetY + 2];
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
