// App.js
(function() {

'use strict';

var React = require('react');
var Whiteboard = require('../../../../../lib/js/react-whiteboard');

var App = React.createClass({

    render: function() {
        return (
            <div>
                <Whiteboard width={600} height={400} />
            </div>
        );
    }

});

module.exports = App;

})();
