import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['fb-widget'],

  actions: {
    logout: function () {
      this.sendAction('logout');
    }
	}
});
