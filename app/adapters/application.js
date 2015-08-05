import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host: 'http://localhost:51773',    
	namespace: 'api',
    shouldReloadAll: function() { return false; }
});