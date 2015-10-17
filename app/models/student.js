import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  grade: DS.attr('number'),
  locked: DS.attr('boolean'),
  preferences: DS.hasMany('preference', {
    async: true
  }),
  enrollments: DS.hasMany('enrollment', {
    async: true
  }),

  toStringExtension: function() {
    return 'Student: ' + this.get('firstName') + ' ' + this.get('lastName');
  }
});