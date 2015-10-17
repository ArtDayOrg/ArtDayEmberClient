import DS from 'ember-data';

export default DS.Model.extend({
  rank: DS.attr('number'),
  session: DS.belongsTo('session', {
    async: true
  }),
  student: DS.belongsTo('student', {
    async: true
  }),

  toStringExtension: function() {
    return 'Student: ' + this.get('student.firstName') + ' ' + this.get('student.lastName') +
      ' ranks ' + this.get('session.sessionName') + ' #' + this.get('rank');
  }
});