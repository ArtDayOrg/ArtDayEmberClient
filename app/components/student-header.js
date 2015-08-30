import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['student'],

  actions: {
    lockPrefs: function () {
      this.sendAction('lockPrefs');
    }
  }
});
