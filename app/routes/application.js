import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.findAll('session');
  },

  setupController: function (controller, model) {
      controller.set('model', model);
  }
});
