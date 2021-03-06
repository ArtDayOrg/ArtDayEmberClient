import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['student-selector'],

  becomeFocused: function() {
    this.$('.input').focus();
  }.on('didInsertElement'),

  actions: {
    processKeyUp: function(value) {
      this.sendAction('processKeyUp', value);
    },
    unlock: function(student) {
      this.sendAction('unlock', student);
    },
    deleteStudent: function(student) {
      var areTheySure = confirm('Delete student ' + student.get('firstName') + ' ' + student.get('lastName') + '.  This is not reversable');
      if (areTheySure) {
        student.destroyRecord();
      } else {
        console.log('Delete cancelled.');
      }
    }
  }
});