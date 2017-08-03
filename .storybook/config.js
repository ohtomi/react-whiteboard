import {configure} from '@storybook/react';

function loadStories() {
    require('../stories/Basic');
    require('../stories/Image');
    require('../stories/UndoRedo');
    require('../stories/Layer');
}

configure(loadStories, module);
