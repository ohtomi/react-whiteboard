import {configure} from '@storybook/react'

const req = require.context('../stories', true, /\.tsx$/)

function loadStories() {
    req.keys().forEach(req)
}

configure(loadStories, module)
