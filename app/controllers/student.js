import Ember from 'ember';

export default Ember.Controller.extend({

    appController: Ember.inject.controller('application'),
    app: Ember.computed.reads('appController'),

    descriptionForDisplay: 'Click a session to see details.',

    sessionNameForDisplay: '',

    allPrefsSet: function() {
        return this.get('model.preferences.length') === 6 ? true : false;
    }.property('model.preferences.length'),

    enrolled: function() {
        return this.get('model.enrollments.length') ? true : false;
    }.property('model.enrollments.length'),

    sessionsLoading: function() {
        return this.get('app.model.length') ? false : true;
    }.property('app.model.length'),

    //trick to avoid duplicate animations by collecting arrays in an object than using liquid-with on the object
    bothArrays: function() {
        return {
            rankedOrNullPrefsArray: this.get('rankedOrNullPrefsArray'),
            availableSessions: this.get('availableSessions')
        }
    }.property('rankedOrNullPrefsArray', 'availableSessions'),

    // this property is an array sorted by rank where unset preferences are represented 
    // by a null element in the array.  rankedOrNullArray[0] is the preference with rank 1 or null.
    // Our template wants to cycle through this and display pref tiles or a drop box when null.
    rankedOrNullPrefsArray: function() {

        function sortByRank(pref) {
            if (pref.get('rank') === i) {
                tempPref = pref;
            }
        }

        var array = this.get('model.preferences');
        var rankedOrNullPrefsArray = [];

        if (array) {
            for (var i = 1; i < 7; i++) {
                var tempPref = 0;
                array.forEach(sortByRank);
                if (tempPref !== 0) {
                    rankedOrNullPrefsArray.pushObject(tempPref);
                } else {
                    rankedOrNullPrefsArray.pushObject(null);
                }
            }
        }
        return rankedOrNullPrefsArray;
    }.property('model.preferences.@each.rank', 'model.preferences.@each.session', 'model'),

    availableSessions: function() {

        Array.prototype.shuffle1 = function() {
            var l = this.length + 1;
            while (l--) {
                var r = ~~(Math.random() * l),
                    o = this[r];
                this[r] = this[0];
                this[0] = o;
            }
            return this;
        };

        var prefs = this.get('model.preferences');
        var unavailableSessionNames = [];
        var availableSessions = [];

        prefs.forEach(function(pref) {
            unavailableSessionNames.pushObject(pref.get('session.sessionName'));
        });

        this.get('app.model').forEach(function(session) {
            if (!unavailableSessionNames.contains(session.get('sessionName'))) {
                availableSessions.pushObject(session);
            }
        });
        return availableSessions.shuffle1();

    }.property('model.preferences.@each.session', 'app.model.length', 'app.model', 'model'),

    actions: {

        sessionDropped: function(session, ops) {

            function saveThenLog(pref) {
                pref.save().then(function() {
                    return;
                }, function(reason) {
                    console.error('failure: ' + reason);
                });
            }

            var oldPrefs = this.get('model.preferences');

            //Dragging a preferred section back to availabale sessions
            if (ops.target.target === 0) {
                if (oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length) {
                    var prefToDelete = oldPrefs.filterBy('session.sessionName', session.get('sessionName')).objectAt(0);

                    //source of error when dragging from top to bottom?
                    prefToDelete.destroyRecord();
                }
                return;
            }

            var student = this.get('model');
            var dropSession = session.content;
            var targetPrefRank = ops.target.target;
            var newPref;


            //if the session is dragged to a preference that is already set...
            if (oldPrefs.filterBy('rank', targetPrefRank).length) {

                var exit = false;

                //cycle through the set preferences (they reordered the set prefs by dragging one to a different rank)
                oldPrefs.forEach(function(oldPref) {

                    if (exit) {
                        return;
                    }

                    var oldPrefRank = oldPref.get('rank');

                    //check to see if preferences should be switched
                    if (oldPref.get('session.sessionName') === session.get('sessionName')) {

                        var targetPref = oldPrefs.filterBy('rank', targetPrefRank).objectAt(0);

                        //switch them
                        targetPref.set('rank', oldPrefRank);
                        saveThenLog(targetPref);
                        oldPref.set('rank', targetPrefRank);
                        saveThenLog(oldPref);
                        exit = true;
                        return;
                    }
                });

                if (exit) {
                    return;
                }

                //otherwise they dragged from the bottom to the top, so replace the target session with the dragged session
                var replacedPref = oldPrefs.filterBy('rank', targetPrefRank).objectAt(0);

                //source of error when dragging preference away from prefOrNullArray row?
                replacedPref.destroyRecord();

                newPref = this.store.createRecord('preference', {
                    rank: targetPrefRank,
                    student: student,
                    session: session
                });
                saveThenLog(newPref);
                return;
            }

            //dragging a preferred session to an empty preference rank
            if (oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length) {

                var reRankedPref = oldPrefs.filterBy('session.sessionName', dropSession.get('sessionName')).objectAt(0);
                reRankedPref.set('rank', targetPrefRank);
                saveThenLog(reRankedPref);

                //dragging from the bottom to the empty preference target
            } else {
                newPref = this.store.createRecord('preference', {
                    rank: targetPrefRank,
                    student: student,
                    session: session
                });
                saveThenLog(newPref);
            }
        },

        lockPrefs: function() {
            var thisStudent = this.get('model');
            thisStudent.set('locked', true);
            thisStudent.save();
        },

        changeDescription: function(description, sessionName) {
            this.set('descriptionForDisplay', description);
            this.set('sessionNameForDisplay', sessionName);
        }
    }
});