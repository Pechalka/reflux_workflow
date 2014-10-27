var utils = require('./utils')
	, CollectionStore = utils.CollectionStore
	, ObjectStore   = utils.ObjectStore;






module.exports = {
	users : CollectionStore(),
	user : ObjectStore({ name : ''}),

	site : ObjectStore({ title : '---' }),
	sites : CollectionStore(),

	pages : CollectionStore(),

	todos : CollectionStore()
}