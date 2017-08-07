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


ReactDOM.render(<Demo/>, document.getElementById('root'));
