import Ember from 'ember';

export default Ember.Component.extend({

  sortedItems: function () {
    return this.get('items').sortBy('rank').reverse();
  }.property('items'),

  actions: {
    changeDescription: function (description, sessionName) {
      this.sendAction('changeDescription', description, sessionName);
    }
  }
});
