// App.js
(function() {

'use strict';

var React = require('react');
var Whiteboard = require('react-whiteboard');

var App = React.createClass({

    handleEvent: function(ev) {
        console.log(ev);
    },

    render: function() {
        return (
            <div>
                <Whiteboard width={600} height={400} listener={this.handleEvent} />
            </div>
        );
    }

});

module.exports = App;

})();
