import React from 'react';
import {Whiteboard} from '../../../src/react-whiteboard';

export default class App extends React.Component {

    handleEvent(ev) {
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
                <Whiteboard width={800} height={600} style={{backgroundColor: 'lightyellow'}} />
            </div>
        );
    }

}
