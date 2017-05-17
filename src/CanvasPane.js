import React from 'react';
import PropTypes from 'prop-types';


export default class CanvasPane extends React.Component {

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height,
            background: this.props.style.backgroundColor,
        };

        return (
            <div style={canvasLayerStyle}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width}
                     height={this.props.height}>
                    {this.drawWhiteboardCanvas()}
                </svg>
            </div>
        );
    }

    drawWhiteboardCanvas() {
        return this.props.dataset
            .filter((element) => {
                return element.values.length > 1;
            })
            .map((element, index) => {
                const k = index;
                const d = element.values.map((point, index) => {
                    if (index === 0) {
                        return 'M ' + point[0] + ' ' + point[1];
                    } else {
                        return 'L ' + point[0] + ' ' + point[1];
                    }
                });

                return (
                    <path key={k} d={d.join(' ')} fill="none" stroke={element.strokeColor} strokeWidth={element.strokeWidth}></path>
                );
            });
    }
}

CanvasPane.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dataset: PropTypes.array,
    style: PropTypes.object,
};
