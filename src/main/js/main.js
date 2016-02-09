// main.js
(function() {

'use strict';

var React = require('react');
var d3 = require('d3');

var Whiteboard = React.createClass({

    svg: null,

    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        listener: React.PropTypes.func
    },

    componentDidMount: function() {
        this.svg = d3.select(this.refs.whiteboard).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        var that = this;
        this.svg.on('click.whiteboard', function() {
            if (that.props.listener) {
                that.props.listener(d3.event);
            }
        });
    },

    render: function() {
        return (<div ref="whiteboard"></div>);
    }

});

module.exports = Whiteboard;

})();
