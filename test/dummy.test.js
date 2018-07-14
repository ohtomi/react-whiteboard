import test from 'ava';
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import {shallow} from 'enzyme';

import {Whiteboard, EventStream, EventStore} from '../dist/';

test('svg exist', t => {
    const events = new EventStream();
    const eventStore = new EventStore();
    const width = 800;
    const height = 600;
    const wrapper = shallow(<Whiteboard events={events} eventStore={eventStore} width={width} height={height}/>);
    t.truthy(wrapper.find('svg'));
});
