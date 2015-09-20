import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {

  isTransparent: false,

  transparentUrl: "assets/images/transparent.png",

  imageUrl: function() {
    return this.get('isTransparent') ? this.get('transparentUrl') : this.get('imagePath');
  }.property('imagePath', 'isTransparent'),

  drag: function() {
    this.set('isTransparent', true);
  },

  dragEnd: function() {
    this.set('isTransparent', false);
  },

  drop: function() {
    this.set('isTransparent', false);
  },

  actions: {
    changeDescription: function(description, sessionName) {
      this.sendAction('changeDescription', description, sessionName);
    }
  }

});