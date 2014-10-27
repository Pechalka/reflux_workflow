var _ = require('lodash');
var stores = require('./stores');
var Reflux = require('reflux');
var http = require('./utils').http;




var actions = Reflux.createActions([
    "fetchUsers",
    "removeUser",
    "getUser",
    "saveUser",


    "fetchUserSitesAndPages",
    "addSite",

    "addPageToCurrentSite",
    "removePage",

    "fetchTodos",
    "addTodo",
    "removeTodo",
    "toggleStatus"
]);


actions.addTodo.listen(function(title){
	http.post('/api/todos', { title : title, completed : false })
		.done(stores.todos.add)
})

actions.fetchTodos.listen(function(){
	http.get('/api/todos')
		.done(stores.todos.set)
})

actions.toggleStatus.listen(function(todo){
	todo.completed = !todo.completed;
	http.put('/api/todos/' + todo.id, todo)
		.done(stores.todos.update);
})


actions.removeTodo.listen(function(todo){
	http.del('/api/todos/' + todo.id)
		.done(stores.todos.remove)
})


actions.getUser.listen(function(id){
	http.get('/api/users/' + id)
		.done(stores.user.set)
	
})

actions.fetchUsers.listen(function(){
	http.get('/api/users')
		.done(stores.users.set)
})

actions.removeUser.listen(function(user){
	http.del('/api/users/' + user.id)
		.done(function(){ stores.users.remove(user) })
})

actions.saveUser.listen(function(user){
	if (user.id){
		http.put('/api/users/' + user.id, user)
			.done(stores.users.update);
	} else {
		http.post('/api/users', user)
			.then(stores.users.add)
			.then(function(newUser){
				return http.post('/api/sites', { user_id : newUser.id, title : 'site' })
			})
			.then(function(newSite){
				return http.post('/api/pages', { site_id : newSite.id, title : 'home page', isHomePage : true })
			})
	}
})


var currentSiteId = null;
actions.fetchUserSitesAndPages.listen(function(user_id, site_id){
	http.get('/api/sites', { user_id : user_id})
	    .then(stores.sites.set)
	    .then(function(sites){
	    	return site_id ? _.find(sites, { id : site_id }) 
	    				   : sites[0];
	    })
	    .then(function(selectedSite){
	    	currentSiteId = selectedSite.id;
	    	stores.site.set(selectedSite);
	    	return http.get('/api/pages', { site_id : selectedSite.id })
	    })
	    .then(stores.pages.set);
})

actions.addSite.listen(function(user_id, title){
	var data = {
		user_id : user_id,
		title : title
	}
	var new_site_id;
	http.post('/api/sites', data)
		.then(stores.sites.add)
		.then(function(site){
			new_site_id = site.id;
			return http.post('/api/pages', { 
				title : 'home page', 
				isHomePage : true, 
				site_id : site.id
			})
		})
		.then(function(){
			actions.fetchUserSitesAndPages(user_id, new_site_id)
		})
})

actions.addPageToCurrentSite.listen(function(title){
	var page = { 
		title : title, 
		isHomePage : false, 
		site_id : currentSiteId
	}
	http.post('/api/pages', page)
		.done(stores.pages.add)
})

actions.removePage.listen(function(page){
	http.del('/api/pages/' + page.id)
		.done(stores.pages.remove);
})



 module.exports = actions;