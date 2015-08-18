import DS from 'ember-data';

export default DS.Model.extend({
	sessionName: DS.attr('string'),
	instructorName: DS.attr('string'),
	capacity: DS.attr('number'),
	description: DS.attr('string'),
	location: DS.attr('string'),
  preferences: DS.hasMany('preference', {async: true}),
  enrollments: DS.hasMany('enrollment', {async: true}),
  imageUrl: DS.attr('string'),

  toStringExtension: function() {
  	return "sessionName: " + this.get('sessionName');
  }
});