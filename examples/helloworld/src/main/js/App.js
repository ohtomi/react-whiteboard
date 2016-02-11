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
            <div>
                <Whiteboard width={600} height={400} listener={this.handleEvent} />
            </div>
        );
    }

}
