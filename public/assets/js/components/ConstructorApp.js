/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Reflux = require('reflux');
var stores = require('../stores');
var actions = require('../actions');


/**
 * @jsx React.DOM
 */

var React = require('react');

var AddForm = React.createClass({
	mixins : [React.addons.LinkedStateMixin],
	getInitialState: function() {
		return {
			text : ''
		};
	},
	onAdd : function(){
		this.props.onAdd(this.state.text);
		this.setState({ text : ''})
	},
	render: function() {
		return (
			<div>
				add {this.props.lable}
				<input type='text' valueLink={this.linkState('text')}/>
				<a onClick={this.onAdd}>add</a>
			</div>
		);
	}

});

module.exports = AddForm;

var ConstructorApp = React.createClass({
	mixins: [
		Reflux.connect(stores.site, "currentSite"),
		Reflux.connect(stores.sites, "sites"),		
		Reflux.connect(stores.pages, "pages"),	
	],
	componentDidMount : function(){
		var user_id = this.props.params.user_id;
		actions.fetchUserSitesAndPages(user_id);
	},
	getInitialState: function() {
		return {
			currentSite : { title : '' } ,
			sites : [],
			pages : []
		};
	},
	addSite : function(text){
		actions.addSite(this.props.params.user_id, text)
	},
	changeSite : function(s){
		actions.fetchUserSitesAndPages(this.props.params.user_id, s.id);
	},
	render: function() {
		var sites = this.state.sites.map(function(s){
			return <li>{s.title} <a onClick={this.changeSite.bind(this, s)}>edit</a></li>
		}.bind(this))

		var pages = this.state.pages.map(function(p){
			var deleteLink;
			if (!p.isHomePage){
				deleteLink = <a onClick={actions.removePage.bind(this, p)}>X</a>
			}
			return <li>{p.title} {deleteLink}</li>
		}.bind(this))

		return (
			<div>
				<h1>{this.state.currentSite.title}</h1>
				<div>
					<h3>sites</h3>
					<ul>{sites}</ul>
					<AddForm lable="site" onAdd={this.addSite}/>
				</div>
				<div>
					<h3>pages</h3>
					<ul>{pages}</ul>
					<AddForm lable="page" onAdd={actions.addPageToCurrentSite}/>
				</div>
			</div>
		);
	}

});

module.exports = ConstructorApp;