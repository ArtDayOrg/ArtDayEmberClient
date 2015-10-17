import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('student-preferences-row', 'Integration | Component | student preferences row', {
  integration: true
});

var nullArray = [null, null, null, null, null, null];

var fullPrefs = [{
  rank: 1,
  session: {
    sessionName: 'session 1',
    description: 'description 1',
    id: 1
  },
  student: {
    firstName: 'bob'
  }
}, {
  rank: 2,
  session: {
    sessionName: 'session 2',
    description: 'description 2',
    id: 2
  },
  student: {
    firstName: 'bob'
  }
}, {
  rank: 3,
  session: {
    sessionName: 'session 3',
    description: 'description 3',
    id: 3
  },
  student: {
    firstName: 'bob'
  }
}, {
  rank: 4,
  session: {
    sessionName: 'session 4',
    description: 'description 4',
    id: 4
  },
  student: {
    firstName: 'bob'
  }
}, {
  rank: 5,
  session: {
    sessionName: 'session 5',
    description: 'description 5',
    id: 5
  },
  student: {
    firstName: 'bob'
  }
}, {
  rank: 6,
  session: {
    sessionName: 'session 6',
    description: 'description 6',
    id: 6
  },
  student: {
    firstName: 'bob'
  }
}];

var mixedArray = fullPrefs.slice(0, 3);
mixedArray.push(null);
mixedArray.push(null);
mixedArray.push(null);

var fullTest = function(numTimes, testFunc) {
  return function() {
    for (var i = 1; i < numTimes + 1; i += 1) {
      testFunc(i);
    }
  };
};

test('renders null ok', function(assert) {

  var nullRanksTest = fullTest(6, function(rank) {
    assert.equal(self.$('#rank' + rank).text().trim(), rank, 'null array renders a pref drop target with rank ' + rank);
  });

  var self = this;

  assert.expect(6);

  this.set('rankedOrNullPrefsArray', nullArray);

  this.render(hbs `{{student-preferences-row items=rankedOrNullPrefsArray 
    sessionDropped='sessionDropped'}}`);

  nullRanksTest();
});

test('renders prefs set ok', function(assert) {
  var self = this;
  var prefsSetTest = fullTest(6, function(rank) {
    assert.equal(self.$('#name' + rank).text().trim(), 'session ' + rank, 'pref ' + rank + ' session ok');
    assert.equal(self.$('#imageUrl' + rank).attr('src'), 'assets/images/' + rank + '.png', 'image path ' + rank + ' ok');
    self.on('outerAction', function(description) {
      assert.equal(description, 'description ' + rank, 'pref ' + rank + ' sends description ok');
    });
    $('#name' + rank).click();
  });

  assert.expect(18);

  this.set('rankedOrNullPrefsArray', fullPrefs);

  this.render(hbs `{{student-preferences-row items=rankedOrNullPrefsArray changeDescription='outerAction' 
    sessionDropped='sessionDropped'}}`);

  prefsSetTest();
});



test('renders mixed array ok', function(assert) {
  var self = this;

  var mixedPrefsAndNullTest = fullTest(6, function(rank) {
    if (self.$().find('#name' + rank).text().trim() === '') {
      assert.equal(self.$('#rank' + rank).text().trim(), rank, 'pref ' + rank + ' drop target ok');
    } else {
      assert.equal(self.$('#name' + rank).text().trim(), 'session ' + rank, 'pref ' + rank + ' session ok');
    }
  });
  assert.expect(6);

  this.set('rankedOrNullPrefsArray', mixedArray);

  this.render(hbs `{{student-preferences-row items=rankedOrNullPrefsArray changeDescription='outerAction' 
    sessionDropped='sessionDropped'}}`);

  mixedPrefsAndNullTest();
});

test('responds to array change OK', function(assert) {
  var self = this;
  var mixedPrefsAndNullTest = fullTest(6, function(rank) {
    if (self.$().find('#name' + rank).text().trim() === '') {
      assert.equal(self.$('#rank' + rank).text().trim(), rank, 'pref ' + rank + ' drop target ok');
    } else {
      assert.equal(self.$('#name' + rank).text().trim(), 'session ' + rank, 'pref ' + rank + ' session ok');
    }
  });

  assert.expect(12);

  this.set('rankedOrNullPrefsArray', mixedArray);

  this.render(hbs `{{student-preferences-row items=rankedOrNullPrefsArray changeDescription="outerAction" 
    sessionDropped="sessionDropped"}}`);

  mixedPrefsAndNullTest();

  //copy
  var changedMixedArray = mixedArray.slice(0);
  changedMixedArray[0] = null;
  changedMixedArray[5] = {
    rank: 6,
    session: {
      sessionName: 'session 6',
      description: 'description 6',
      id: 6
    },
    student: {
      firstName: 'bob'
    }
  };

  this.set('rankedOrNullPrefsArray', changedMixedArray);

  mixedPrefsAndNullTest();
});

test('drag and drop ok', function(assert) {
  var self = this;
  var mixedPrefsAndNullTest = fullTest(6, function(rank) {
    if (self.$().find('#name' + rank).text().trim() === '') {
      assert.equal(self.$('#rank' + rank).text().trim(), rank, 'pref ' + rank + ' drop target ok');
    } else {
      assert.equal(self.$('#name' + rank).text().trim(), 'session ' + rank, 'pref ' + rank + ' session ok');
    }
  });
  var draggedItem = $('#name3'),
    dropZone = $('#rank4'),
    dragStartEvent = $.Event('dragStart'),
    dropEvent = $.Event('drop');



  assert.expect(12);

  this.set('rankedOrNullPrefsArray', mixedArray);

  this.render(hbs `{{student-preferences-row items=rankedOrNullPrefsArray changeDescription='outerAction' 
    sessionDropped='sessionDropped'}}`);

  mixedPrefsAndNullTest();

  this.on('outerAction', function(session, ops) {
    console.log('dropped');
  });

  draggedItem.trigger(dragStartEvent);
  dropZone.trigger(dropEvent);
  draggedItem.trigger('dragend');

  mixedPrefsAndNullTest();

});