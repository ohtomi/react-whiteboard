import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';


export default class CanvasPane extends React.Component {

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div style={canvasLayerStyle}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                     width={this.props.width} height={this.props.height}>
                    <rect width={'100%'} height={'100%'} fill={this.props.style.backgroundColor}></rect>
                    {this.drawBackgroundImage()}
                    {this.drawWhiteboardCanvas()}
                </svg>
            </div>
        );
    }

    drawBackgroundImage() {
        if (this.props.dataHolder.backgroundImage) {
            return (
                <image
                    width={this.props.dataHolder.backgroundImage.width}
                    height={this.props.dataHolder.backgroundImage.height}
                    xlinkHref={this.props.dataHolder.backgroundImage.dataUrl}>
                </image>
            );
        } else {
            return null;
        }
    }

    drawWhiteboardCanvas() {
        return this.props.dataHolder.dataset
            .reduce((prev, element) => {
                if (!element.type) {
                    prev.forEach(p => {
                        p.push({
                            type: null,
                            strokeWidth: null,
                            strokeColor: null,
                            values: [],
                        });
                    });
                    return prev;
                }

                if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                    if (!prev[element.layer]) {
                        prev[element.layer] = [{
                            type: null,
                            strokeWidth: null,
                            strokeColor: null,
                            values: [],
                        }];
                    }

                    let last = prev[element.layer][prev[element.layer].length - 1];
                    last.type = element.type;
                    last.strokeWidth = element.strokeWidth;
                    last.strokeColor = element.strokeColor;
                    last.values.push(element.point);
                    return prev;
                } else {
                    return prev;
                }
            }, [[{
                type: null,
                strokeWidth: null,
                strokeColor: null,
                values: [],
            }]])
            .filter((element, index) => {
                return this.props.dataHolder.renderLayers[index];
            })
            .reduce((prev, element) => {
                return prev.concat(element);
            }, [])
            .filter((element) => {
                if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                    return element.values.length > 1;
                } else {
                    return true;
                }
            })
            .map((element, index) => {
                if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                    const k = index;
                    const d = element.values.map((point, index) => {
                        if (index === 0) {
                            return 'M ' + point.x + ' ' + point.y;
                        } else {
                            return 'L ' + point.x + ' ' + point.y;
                        }
                    });

                    return (
                        <path key={k} d={d.join(' ')} fill="none" stroke={element.strokeColor} strokeWidth={element.strokeWidth}></path>
                    );
                } else {
                    return null;
                }
            });
    }
}

CanvasPane.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dataHolder: PropTypes.object,
    style: PropTypes.shape({
        backgroundColor: PropTypes.string,
    }),
};
