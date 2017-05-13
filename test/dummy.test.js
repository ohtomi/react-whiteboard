// @flow

import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import {Whiteboard} from '../dist/';

test('svg exist', t => {
    const wrapper = shallow(<Whiteboard width={800} height={600}/>);
    t.truthy(wrapper.find('svg'));
});
