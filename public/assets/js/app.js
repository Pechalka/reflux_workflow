/** @jsx React.DOM */
var React = require('react/addons'); 
var	ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var UserList = require('./components/UserList');
var UserForm = require('./components/UserForm');
var ConstructorApp = require('./components/ConstructorApp');
var TodoList = require('./components/TodoList')

var App = React.createClass({
    render: function () {
    	return <div >
                <a href='#/users'>users</a>
    			{this.props.activeRouteHandler()}
    		</div>;
    }
});

var routes = (<Route handler={App}>
	<DefaultRoute handler={UserList}/>
	<Route name="users" handler={UserList}/>
    <Route name="todos" handler={TodoList}/>
    <Route name="users add" path="users/add" handler={UserForm}/>
	<Route name="users edit" path="users/:id" handler={UserForm}/>
    <Route name="constructor app" path="users/:user_id/constructor" handler={ConstructorApp} />
</Route>)

App.start = function () {
    React.renderComponent(
    	<Routes children={routes}/>
    , document.getElementById('app'));
};

module.exports = window.App = App;
