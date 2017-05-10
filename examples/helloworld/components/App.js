import React from 'react';
import {Whiteboard, SvgConverter} from '../../../src/index';

export default class App extends React.Component {

    componentDidMount() {
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
                    <li>To start/stop drawing line, click in the whiteboard.</li>
                    <li>To switch color, black, red, green, blue, press c key.</li>
                    <li>To select stroke width, press 1-9 key.</li>
                </ul>
                <Whiteboard width={800} height={600} style={{backgroundColor: 'lightyellow'}}/>
            </div>
        );
    }
}
