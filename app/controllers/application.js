import Ember from 'ember';

export default Ember.Controller.extend({

  imagesToPreload: function() {
    var urls = [];
    if (this.get('model.length')) {
      this.get('model').forEach(function(session) {
        var id = session.get('id');
        if (id) {
          var imagePath = 'http://artday.blob.core.windows.net/images/' + id + '.png';
          console.log(imagePath);
          urls.addObject(imagePath);
        }
      })
    }
    return urls
  }.property('model', 'model.length'),

  atIndex: function() {
    if (this.get('currentPath') === 'index') {
      return true;
    } else {
      return false;
    }
  }.property('currentPath')

});