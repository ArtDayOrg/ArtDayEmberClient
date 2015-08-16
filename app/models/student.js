import DS from 'ember-data';

export default DS.Model.extend({
    firstname: DS.attr('string'),
    lastname: DS.attr('string'),
    grade: DS.attr('number'),
    locked: DS.attr('boolean'),
    preferences: DS.hasMany('preference', {async: true}),
    enrollments: DS.hasMany('enrollment', {async: true}),


    toStringExtension: function() {
  		return "Student: " + this.get('firstname') + ' ' + this.get('lastname');
  	}
});
