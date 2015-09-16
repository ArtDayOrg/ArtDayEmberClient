import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:student', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('controller properly backs tooltip', function(assert) {
  var controller = this.subject();

  assert.expect(4)

  assert.equal(controller.get('descriptionForDisplay'), 'Click a session to see details.', 'descriptionForDisplay initializes to correct default');
  assert.equal(controller.get('sessionNameForDisplay'), '', 'sessionNameForDisplay  initializes to empty');

  var description = 'description for session';
  var sessionName = 'Name of Session';

  Ember.run(function () {
    controller.send('changeDescription', description, sessionName);
  });

  assert.equal(controller.get('descriptionForDisplay'), description, 'changeDescription updates description');
  assert.equal(controller.get('sessionNameForDisplay'), sessionName, 'changeDescription updates session name');
});

test('allPrefsSet ok', function(assert) {
  var controller = this.subject();

  assert.expect(2);

  Ember.run(function () {
    controller.set('model', Ember.Object.create({preferences: []}));
  });
  
  assert.notOk(controller.get('allPrefsSet'), 'allPrefsSet false when no prefs');

  Ember.run(function () {
    controller.set('model', Ember.Object.create({preferences: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}]}));
  });

  assert.ok(controller.get('allPrefsSet'), 'allPrefsSet true with six prefs');
});