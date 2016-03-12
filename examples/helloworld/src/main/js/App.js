// App.js
'use strict';

import React from 'react';
import Whiteboard from 'react-whiteboard';

export default class App extends React.Component {

    handleEvent(ev) {
        console.log(ev);
    }

    render() {
        return (
            <div style={{margin: 30}}>
                <h1>React-Whiteboard Sample</h1>
                <ul>
                    <li>To draw line, press 0 key or click.</li>
                    <li>To switch color, press c key.</li>
                    <li>To select stroke width, press 1-9 key.</li>
                </ul>
                <Whiteboard
                    width={800} height={600} listener={this.handleEvent}
                    style={{backgroundColor: 'lightyellow'}}
                    renderPallete={true} renderDebugInfo={false}
                />
            </div>
        );
    }

}
