/* eslint-disable */

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

global.document = new JSDOM('<body></body>');
global.window = document.window;
global.navigator = window.navigator;
