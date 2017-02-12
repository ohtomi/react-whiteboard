import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Whiteboard from './Whiteboard';
import EventCreator from './EventCreator';
import SvgConverter from './SvgConverter';


export {
    Whiteboard,
    EventCreator,
    SvgConverter,
};


let appNode = document.createElement('div');
appNode.setAttribute('id', 'content');
document.body.appendChild(appNode);

ReactDOM.render(
  <AppContainer>
    <Whiteboard width={800} height={600} style={{backgroundColor: 'lightyellow'}} />
  </AppContainer>
  , appNode);
