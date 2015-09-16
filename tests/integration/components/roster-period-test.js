import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('roster-period', 'Integration | Component | roster-period', {
  integration: true
});

test('roster period shows period and enrollments correctly', function(assert) {
  assert.expect(2);
  var period = 1; 

  var e = [{student: {firstName: 'Joe', lastName: 'Forsmann', grade: 6, locked: false}, period: 1, session: {}},
           {student: {firstName: 'Joe2', lastName: 'Forsmann2', grade: 7, locked: true}, period: 1, session: {}},
           {student: {firstName: 'Joe3', lastName: 'Forsmann3', grade: 8, locked: false}, period: 1, session: {}}
          ];

  this.set('period', period);
  this.set('enrollments', e);

  this.render(hbs`{{roster-period period=period item=enrollments}}`);

  assert.equal(this.$('#periodText').text().trim(), 'Period: 1', 'Period text displays correctly');

  var rows = this.$().find('.nextline');
  assert.equal(rows.length, 3, 'correct number of students rendered in roster');
});