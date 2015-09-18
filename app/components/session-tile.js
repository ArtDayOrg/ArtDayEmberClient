import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {
  classNames: ['session-tile'],

  transparentUrl: "assets/images/transparent.png",

  imageUrl: function() {
    return this.get('isTransparent') ? this.get('transparentUrl') : this.get('imagePath');
  }.property('imagePath', 'isTransparent'),

  click: function() {
    this.sendAction('changeDescription', this.get('item.description'), this.get('item.sessionName'));
  }
});