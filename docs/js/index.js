import React from 'react';
import ReactDOM from 'react-dom';

import {Whiteboard, EventStream, EventStore, SvgConverter} from '@ohtomi/react-whiteboard';


class Demo extends React.Component {

    constructor(props) {
        super(props);

        this.events = new EventStream();
        this.eventStore = new EventStore();
        this.width = 450;
        this.height = 400;
        this.style = {
            backgroundColor: 'lightyellow'
        };

        this.initializeHandler();
    }

    initializeHandler() {
        this.props.widthEl.onchange = () => {
            this.events.changeStrokeWidth(this.props.widthEl.value);
        };
        this.props.colorEl.onchange = () => {
            this.events.changeStrokeColor(this.props.colorEl.value);
        };
        this.props.pasteEl.onclick = () => {
            const url = this.props.imageEl.value;
            if (url.endsWith('.png')) {
                SvgConverter.fromPngImage(url)
                    .then(image => {
                        this.events.pasteImage(0, 0, image.width, image.height, image.dataUrl);
                    });
            } else if (url.endsWith('.jpeg') || url.endsWith('.jpg')) {
                SvgConverter.fromJpegImage(url)
                    .then(image => {
                        this.events.pasteImage(0, 0, image.width, image.height, image.dataUrl);
                    });
            } else if (url.endsWith('.gif')) {
                SvgConverter.fromGifImage(url)
                    .then(image => {
                        this.events.pasteImage(0, 0, image.width, image.height, image.dataUrl);
                    });
            }
        };
    }

    render() {
        return (
            <Whiteboard events={this.events} eventStore={this.eventStore}
                        width={this.width} height={this.height} style={this.style}/>
        );
    }
}


const containerEl = document.getElementById('root');
const widthEl = document.getElementById('width');
const colorEl = document.getElementById('color');
const imageEl = document.getElementById('image');
const pasteEl = document.getElementById('paste');

ReactDOM.render(<Demo widthEl={widthEl} colorEl={colorEl} imageEl={imageEl} pasteEl={pasteEl}/>, containerEl);
