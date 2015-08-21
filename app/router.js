import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {  
  this.route('students');
  this.route('student', { path: 'students/:id'});
  this.route('admin', function() {
    this.route('import');
    this.route('students');
    this.route('sessions', function() {
      this.route('session', {path: '/:session_id'});
      this.route('add');
    });
    this.route('overview', function() {
      this.route('sessions');
      this.route('enrollment');
      this.route('students');
    });
  });
}); 