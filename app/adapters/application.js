import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host: 'http://artday.azurewebsites.net',    
	namespace: 'api',
    shouldReloadAll: function() { return false; }
});