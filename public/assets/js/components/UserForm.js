/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Router = require('react-router');
var Reflux = require('reflux');

var actions = require('../actions');

var stores = require('../stores');

var UserForm = React.createClass({
	mixins: [ 
		Router.Navigation,
		React.addons.LinkedStateMixin,
		Reflux.connect(stores.user)
	],
	getInitialState: function() {
		return {
			name : ''
		};
	},
	componentDidMount: function() {
		var user_id = this.props.params.id;
		if (user_id){
			actions.getUser(user_id)
		}
  	},
  	save : function(){
  		actions.saveUser(this.state);
  		window.location = '#/users';
  	},
	render: function() {
		return (
			<div>
				<input valueLink={this.linkState('name')}/><br/>
				<a onClick={this.save}>save</a>
				<a href='#/users'>cancel</a>
			</div>
		);
	}

});

module.exports = UserForm;