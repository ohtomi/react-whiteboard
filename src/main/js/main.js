// main.js
(function() {

'use strict';

var React = require('react');
var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

var Whiteboard = React.createClass({

    svg: null,

    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    getInitialState: function() {
        return {
            emitter: new EventEmitter()
        };
    },

    componentDidMount: function() {
        this.svg = d3.select(this.refs.whiteboad).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);
    },

    render: function() {
        return (<div ref="whiteboad"></div>);
    }

});

module.exports = Whiteboard;

})();
