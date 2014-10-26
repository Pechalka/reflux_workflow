var _ = require('lodash');

var fix_str = function(q){
	var r = {};

	for(var key in q){
		var n = parseInt(q[key]);
		if (q[key]==='true' || q[key]==='false'){
			r[key] = q[key] === 'true'; 
		} else {
			if (!isNaN(n)){
				r[key] = n;
			} else {
				r[key] = q[key];
			}	
		}
		
	}

	return r;
}

var makeREST = function(app, url, default_items){
	var collection = [];
	if (default_items){
		collection = collection.concat(default_items)
	}
	console.log(collection);

	app.get(url, function(req, res){
		

		if (req.query && req.query._){
			delete req.query._;
		}

		if (req.query && Object.keys(req.query).length > 0){
			var q = fix_str(req.query);
			console.log(q);
			var results = _.filter(collection, q);
			res.json(results);
		} else
			res.json(collection);
	})

	app.get(url + '/:id', function(req, res){
		var id = req.params.id;

		var index = -1;

		for (var i = 0; i < collection.length; i++) {
			if (collection[i].id == id){
				index = i;
				break;
			}
		};
		if (index != -1){
			res.json(collection[index]);
		} else
			res.send(404);
	})

	app.post(url, function(req, res){
		var data = fix_str(req.body); //TODO : use type in declaration

		var max = 0;
		collection.forEach(function(f){
			if (f.id > max) max = f.id;
		})

		data.id = ++max; 
		collection.push(data);
		res.json(data);
	});

	app.delete(url + '/:id', function(req, res){
		var id = req.params.id;

		var index = -1;

		for (var i = 0; i < collection.length; i++) {
			if (collection[i].id == id){
				index = i;
				break;
			}
		};
		var obj = null;
		if (index != -1){
			obj = collection.splice(index, 1)[0];
		}

		res.json(obj);
	});


	app.put(url + '/:id', function(req, res){
		var id = req.params.id;

		var index = -1;

		for (var i = 0; i < collection.length; i++) {
			if (collection[i].id == id){
				index = i;
				break;
			}
		};
		if (index != -1){
			collection[index] = req.body;
			collection[index].id = parseInt(id);
		}

		res.json('ok');
	});	
}

module.exports = makeREST;