import React from 'react';
import {Whiteboard, Events, SvgConverter} from '../../../src/index';


const strokeColors = ['black', 'red', 'blue', 'green', 'yellow'];
let strokeColorIndex = 0;

export default class App extends React.Component {

    constructor() {
        super();

        this.events = new Events();
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

        this.undoButton.addEventListener('click', () => {
            this.events.undoPoint();
        });

        this.redoButton.addEventListener('click', () => {
            this.events.redoPoint();
        });

        this.clearButton.addEventListener('click', () => {
            this.events.clearPoint();
        });

        let downloadAsPng = document.querySelector('#download-as-png');
        downloadAsPng.addEventListener('mouseover', () => {
            let svg = document.querySelector('svg');
            let converter = new SvgConverter(svg);
            converter.toPngData().then(data => {
                downloadAsPng.href = data;
                downloadAsPng.download = 'xxx.png';
            });
        });

        let downloadAsJpeg = document.querySelector('#download-as-jpeg');
        downloadAsJpeg.addEventListener('mouseover', () => {
            let svg = document.querySelector('svg');
            let converter = new SvgConverter(svg);
            converter.toJpegData().then(data => {
                downloadAsJpeg.href = data;
                downloadAsJpeg.download = 'xxx.jpeg';
            });
        });

        let downloadAsSvg = document.querySelector('#download-as-svg');
        downloadAsSvg.addEventListener('mouseover', () => {
            let svg = document.querySelector('svg');
            let converter = new SvgConverter(svg);
            converter.toSvgData().then(data => {
                downloadAsSvg.href = data;
                downloadAsSvg.download = 'xxx.svg';
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
                <Whiteboard events={this.events} width={800} height={600} style={{backgroundColor: 'lightyellow'}}></Whiteboard>
                <button ref={undoButton => this.undoButton = undoButton}>Undo</button>
                <button ref={redoButton => this.redoButton = redoButton}>Redo</button>
                <button ref={clearButton => this.clearButton = clearButton}>Clear</button>
            </div>
        );
    }
}
