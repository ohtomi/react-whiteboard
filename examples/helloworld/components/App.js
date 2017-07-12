import React from 'react';
import {Whiteboard, Events, DataHolder, SvgConverter} from '../../../src/index';


const strokeColors = ['black', 'red', 'blue', 'green', 'yellow'];
let strokeColorIndex = 0;

export default class App extends React.Component {

    constructor() {
        super();

        this.events = new Events();
        this.dataHolder = new DataHolder();
        this.dataHolder.addLayer();
    }

    componentDidMount() {
        document.body.addEventListener('keydown', (ev) => {
            if (ev.keyCode >= 49 && ev.keyCode <= 57) { // '1' - '9'
                this.events.changeStrokeWidth(ev.keyCode - 48);
            }
            if (ev.keyCode === 67) { // 'c'
                strokeColorIndex = (strokeColorIndex + 1) % strokeColors.length;
                this.events.changeStrokeColor(strokeColors[strokeColorIndex]);
            }
        });

        this.pasteButton.addEventListener('click', () => {
            let imageUrl = this.imageUrl.value;
            if (imageUrl.endsWith('.png')) {
                SvgConverter.fromPngImage(this.imageUrl.value)
                    .then(image => {
                        this.events.pasteImage(image.width, image.height, image.dataUrl);
                    });
            } else if (imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.jpg')) {
                SvgConverter.fromJpegImage(this.imageUrl.value)
                    .then(image => {
                        this.events.pasteImage(image.width, image.height, image.dataUrl);
                    });
            } else if (imageUrl.endsWith('.gif')) {
                SvgConverter.fromGifImage(this.imageUrl.value)
                    .then(image => {
                        this.events.pasteImage(image.width, image.height, image.dataUrl);
                    });
            }
        });

        this.undoButton.addEventListener('click', () => {
            this.events.undo();
        });

        this.redoButton.addEventListener('click', () => {
            this.events.redo();
        });

        this.clearButton.addEventListener('click', () => {
            this.events.clear();
        });

        this.layerSelect.addEventListener('change', () => {
            this.events.selectLayer(this.layerSelect.value);
        });

        let downloadAsPng = document.querySelector('#download-as-png');
        downloadAsPng.addEventListener('mouseover', () => {
            let svg = document.querySelector('svg');
            let converter = new SvgConverter(svg);
            converter.toPngData().then(data => {
                downloadAsPng.href = data;
                downloadAsPng.download = 'drawDataList.png';
            });
        });

        let downloadAsJpeg = document.querySelector('#download-as-jpeg');
        downloadAsJpeg.addEventListener('mouseover', () => {
            let svg = document.querySelector('svg');
            let converter = new SvgConverter(svg);
            converter.toJpegData().then(data => {
                downloadAsJpeg.href = data;
                downloadAsJpeg.download = 'drawDataList.jpeg';
            });
        });

        let downloadAsSvg = document.querySelector('#download-as-svg');
        downloadAsSvg.addEventListener('mouseover', () => {
            let svg = document.querySelector('svg');
            let converter = new SvgConverter(svg);
            converter.toSvgData().then(data => {
                downloadAsSvg.href = data;
                downloadAsSvg.download = 'drawDataList.svg';
            });
        });
    }

    render() {
        return (
            <div style={{margin: 30}}>
                <h1>React-Whiteboard Sample</h1>
                <ul>
                    <li>{'To start/stop drawing line, click in the whiteboard.'}</li>
                    <li>{'To switch color, black -> red -> blue -> green -> yellow, press c key.'}</li>
                    <li>{'To select stroke width, press 1-9 key.'}</li>
                </ul>
                <Whiteboard events={this.events} dataHolder={this.dataHolder} renderLayers={this.renderLayers}
                            width={750} height={450}
                            style={{backgroundColor: 'lightyellow'}}>
                </Whiteboard>
                <input ref={imageUrl => this.imageUrl = imageUrl} type="text"></input>
                <button ref={pasteButton => this.pasteButton = pasteButton}>Paste Image</button>
                |
                <button ref={undoButton => this.undoButton = undoButton}>Undo</button>
                <button ref={redoButton => this.redoButton = redoButton}>Redo</button>
                <button ref={clearButton => this.clearButton = clearButton}>Clear</button>
                |
                <select ref={layerSelect => this.layerSelect = layerSelect}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                </select>
            </div>
        );
    }
}

// https://upload.wikimedia.org/wikipedia/commons/9/93/Solid_color_You_Tube_logo.png
// https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png
