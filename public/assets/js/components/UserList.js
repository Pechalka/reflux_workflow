/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Reflux = require('reflux');

var actions = require('../actions');
var stores = require('../stores');

var UserList = React.createClass({
	getInitialState: function() {
		return {
			users: []
		};
	},
	mixins: [
		Reflux.connect(stores.users, "users"),
		React.addons.LinkedStateMixin
	],
	componentDidMount : function(){
		actions.fetchUsers();
	},
	remove : function(user){
		actions.removeUser(user)
	},
	render: function() {
		var users = this.state.users.map(function(u){
			return <li>
						<a href={'#/users/' + u.id}>{u.name}</a><br/>
						<a href={'#/users/' + u.id + '/constructor'}>login</a><br/>
						<a onClick={this.remove.bind(this, u)}>X</a><br/>
						<hr/>
					</li>
		}.bind(this));

		return (
			<div>
				{users}
				<div>
					<a href='#users/add'>add</a>
				</div>
			</div>
		);
	}

});

module.exports = UserList;