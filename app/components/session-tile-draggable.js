import Ember from 'ember';

export default Ember.Component.extend({

  isTransparent: false,

  dragStart: function() {
    console.log('test');
    this.set('isTransparent', true);
  },

  dragEnd: function() {
    this.set('isTransparent', false);
  }

});