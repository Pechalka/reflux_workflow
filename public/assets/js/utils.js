var $ = require('jquery');

$.ajaxSetup({ cache: false });


var http = {
	get : function(url, q){
		return $.get(url, q);
	},
	post : function(url, data){
		return $.post(url, data)
	},
	del : function(url){
		return $.ajax({
			url : url,
			type : 'DELETE'
		})
	},
	put : function(url ,data){
		return $.ajax({
				url : url,
				type : 'PUT',
				contentType:"application/json",
				data : JSON.stringify(data)
			})
	}
}

var Reflux = require('reflux');
var _ = require('lodash');

var CollectionStore = function(){
	var _collection = [];
	var store = Reflux.createStore({
		getDefaultData : function(){
			return _collection;
		},
		set : function(collection){
			_collection = collection;
			store.trigger(_collection);
			return _collection;
		},
		remove : function(obj){
			_collection = _.reject(_collection, { id : obj.id })
			store.trigger(_collection);
		},
		add : function(obj){
			_collection.push(obj);
			store.trigger(_collection);
			return obj;
		},
		update : function(obj){
			var index = _.findIndex(_collection, {
                id : obj.id
            });
            _collection[index] = obj;
            store.trigger(_collection);
            return obj;
		}
	});
	return store;
}

var ObjectStore = function(defautlValue){
	var _obj = defautlValue || {};

	var store = Reflux.createStore({
		getDefaultData : function(){
			return _obj;
		},
		set : function(obj){
			_obj = obj;
			store.trigger(_obj);
		},
		get : function(){
			return _obj;
		}
	})
	return store;
}

module.exports = {
	http : http,
	CollectionStore : CollectionStore,
	ObjectStore : ObjectStore
}