import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    sessionDropped: function(session, ops) {
      this.sendAction('sessionDropped', session, ops);
    },

    changeDescription: function(description, sessionName) {
      this.sendAction('changeDescription', description, sessionName);
    }
  }
});