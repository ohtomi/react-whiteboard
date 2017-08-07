import React from 'react';
import ReactDOM from 'react-dom';

import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';


class Demo extends React.Component {

    constructor(props) {
        super(props);

        this.events = new EventStream();
        this.eventStore = new EventStore();
        this.width = 800;
        this.height = 600;
    }

    render() {
        return (
            <div>
                <Whiteboard events={this.events} eventStore={this.eventStore} width={this.width} height={this.height}/>
            </div>
        );
    }
}


const main = document.querySelector('.main-content');
const heading = document.getElementById('demo');
const container = document.createElement('div');
main.insertBefore(container, heading.nextSibling);

ReactDOM.render(<Demo/>, container);
