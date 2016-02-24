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
                <Whiteboard
                    width={800} height={600} listener={this.handleEvent}
                    style={{backgroundColor: 'lightyellow'}}
                    renderPallete={true} renderDebugInfo={true}
                />
            </div>
        );
    }

}
