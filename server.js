var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var makeREST = require('./makeREST');

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));



makeREST(app, '/api/users', [
	{ id : 1, name : 'vasa' },
	{ id : 2, name : 'peta' }
]);

makeREST(app, '/api/sites', [
	{ id : 5, title : 'vasa site1', user_id : 1},
	{ id : 7, title : 'peta site1', user_id : 2 }
]);

makeREST(app, '/api/pages', [
	{ id : 22, 'title' : 'home page', isHomePage : true, site_id : 5 },
	{ id : 23, 'title' : 'home page', isHomePage : true, site_id : 7 }
]);


makeREST(app, '/api/todos', [
	{ id : 22, title : 'learn reflux', completed : false }
]);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});