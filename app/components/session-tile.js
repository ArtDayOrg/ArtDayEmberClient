import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {
  classNames: ['session-tile'],

  click: function() {
    this.sendAction('changeDescription', this.get('item.description'), this.get('item.sessionName'));
  }
});