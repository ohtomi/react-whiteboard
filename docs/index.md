# Demo

- To draw a line, click the `whiteboard` and move the mouse cursor in the `whiteboard`.
- To change line width and line color, select choices.
- To paste an image on the `whiteboard`, type an URL of the image in the text box and press the paste button.

<div>
    <div id="root"></div>
    <label>
        width: 
        <select id="width">
            <option value="1" selected>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
        </select>
    </label>
    &nbsp;|&nbsp;
    <label>
        color: 
        <select id="color">
            <option value="black" selected>black</option>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="blue">blue</option>
        </select>
    </label>
    &nbsp;|&nbsp;
    <label>
        image: 
        <input type="text" id="image"/>
        <button id="paste">paste</button>
    </label>
</div>
<script src="js/demo.js"></script>

## source code

```javascript
import React from 'react';

import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';


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
    }

    render() {
        return (
            <Whiteboard events={this.events} eventStore={this.eventStore}
                        width={this.width} height={this.height} style={this.style}/>
        );
    }
}
```
