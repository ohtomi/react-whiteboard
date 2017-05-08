import React from 'react';


export default class CanvasPane extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            dataset: React.PropTypes.array,
            style: React.PropTypes.object,
        };
    }

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height,
            background: this.props.style.backgroundColor,
        };

        return (
            <div style={canvasLayerStyle}>
                <svg ref="svg" width={this.props.width} height={this.props.height}>
                    {this.drawWhiteboardCanvas()}
                </svg>
            </div>
        );
    }

    drawWhiteboardCanvas() {
        return this.props.dataset
            .filter((element, index, array) => {
                return element.values.length > 1;
            })
            .map((element, index, array) => {
                const k = index;
                const d = element.values.map((point, index, array) => {
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
