// main.js
(function() {

'use strict';

var React = require('react');
var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');
var Canvas = require('./Canvas');
var Pallete = require('./Palette');

var svg = null;
var emitter = new EventEmitter();

var Whiteboard = React.createClass({

    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        listener: React.PropTypes.func
    },

    childContextTypes: {
        emitter: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            emitter: emitter
        };
    },

    componentDidMount: function() {
        svg = d3.select(this.refs.whiteboard).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        var that = this;
        svg.on('click.whiteboard', function() {
            if (that.props.listener) {
                that.props.listener(d3.event);
            }
        });
    },

    render: function() {
        return (
            <div ref="whiteboard">
                <Canvas {...this.state} />
                <Pallete {...this.state} />
            </div>
        );
    }

});

module.exports = Whiteboard;

})();
