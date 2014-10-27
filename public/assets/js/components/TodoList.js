/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;
var Reflux = require('reflux');
var stores = require('../stores');
var actions = require('../actions');

var TotoList = React.createClass({
	mixins: [ 
		React.addons.LinkedStateMixin,
		Reflux.connect(stores.todos, "todos")
	],
	getInitialState: function() {
		return {
			todos : [],
			title : ''
		};
	},
	componentDidMount: function() {
		actions.fetchTodos();
	},
	onAdd : function(){
		actions.addTodo(this.state.title);
		this.setState({ title : ''})
	},
	render: function() {
		var todos = this.state.todos.map(function(todo){
			var todoClass = cx({
				completed : todo.completed
			})
			return <li className='group'>
				<label className={todoClass}>
					<input onChange={actions.toggleStatus.bind(null, todo)} checked={todo.completed} type='checkbox' />
					{todo.title}
				</label>
				<a className='btn' onClick={actions.removeTodo.bind(null, todo)}>delete</a>
			</li>
		}.bind(this))
		return (
			<div className='todo-list'>
				<ul>{todos}</ul>
				<div className="new-todo">
					<input valueLink={this.linkState('title')} type='text'/>
					<a  className='btn' onClick={this.onAdd}>add</a>
				</div>
			</div>
		);
	}

});

module.exports = TotoList;