import DS from 'ember-data';

export default DS.Model.extend({

  period: DS.attr('number'),
  session: DS.belongsTo('session', {
    async: true
  }),
  student: DS.belongsTo('student', {
    async: true
  }),

  toStringExtension: function() {
    return 'Student: ' + this.get('student.firstName') + ' ' + this.get('student.lastName') +
      ' has ' + this.get('session.sessionName') + ' during period ' + this.get('period');
  }

});