import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  // host: 'http://artday.azurewebsites.net',    
  host: 'http://artday.azurewebsites.net',
  namespace: 'api',
  shouldReloadAll: function() { return false; }
});