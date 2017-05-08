import Whiteboard from './Whiteboard';
import EventCreator from './EventCreator';
// import SvgConverter from './SvgConverter';


export {
    Whiteboard,
    EventCreator,
    // SvgConverter,
};


import React from 'react';
import ReactDOM from 'react-dom';

let appNode = document.createElement('div');
appNode.setAttribute('id', 'content');
document.body.appendChild(appNode);

ReactDOM.render(<Whiteboard width={800} height={600} style={{backgroundColor: 'lightyellow'}}/>, appNode);
