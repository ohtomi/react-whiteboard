import React from 'react';
import CursorPane from './CursorPane';
import CanvasPane from './CanvasPane';


export default class Canvas extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
        };
    }

    render() {
        let wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div style={wrapperStyle}>
                <CursorPane {...this.props} {...this.state} />
                <CanvasPane {...this.props} {...this.state} />
            </div>
        );
    }

}
