import Ember from 'ember';

export default Ember.Controller.extend({
    allPrefsSet: function() {
        if (this.get('model.preferences.length') === 6) {
            return true;
        } else {
            return false;
        }
    }.property('model.preferences.length'),

    actions: {
    	sessionDropped: function (session, ops) {

            function saveThenLog() {}

            var oldPrefs = this.get('model.preferences');
            
            //drop a preferred session back into availableSessions
            if (ops.target.get('rank') === 0) {
                if (oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length) {
                    var prefToDelete = oldPrefs.filterBy('session.sessionName', session.get('sessionName')).objectAt(0);
                    prefToDelete.destroyRecord();
                }
                return;
            }

            var student = this.get('model');
            var self = this;
            var dropSession = session.content;
            var oldPrefs = this.get('model.preferences');
            var targetPrefRank = ops.target.get('rank');            
            
            //if the dropped session is in the preferences...
            if (oldPrefs.filterBy('rank', targetPrefRank).length) {

                var exit = false;

                //cycle through the preferences 
                oldPrefs.forEach(function (oldPref) {

                    if (exit) {
                        return;
                    }

                    var oldPrefSessionName = oldPref.get('session.sessionName');
                    var oldPrefRank = oldPref.get('rank');
                    var newPrefSessionName = oldPrefs.filterBy('rank', targetPrefRank).get('session.sessionName');
                    var targetPref = oldPrefs.filterBy('rank', targetPrefRank).objectAt(0);
                    
                    //check to see if preferences should be switched
                    if (oldPref.get('session.sessionName') === session.get('sessionName')) {

                        //switch them
                        targetPref.set('rank', oldPrefRank);
                        targetPref.save().then(function () {
                            console.log('saved!');
                        }, function (reason) {
                            console.log('failure: ' + reason);// handle the error
                        }); 

                        oldPref.set('rank', targetPrefRank);
                        oldPref.save().then(function () {
                            console.log('saved!');
                        }, function (reason) {
                            console.log('failure: ' + reason);// handle the error
                        }); 

                        exit = true;
                        return; 
                    }
                });
            } 

            console.log(session);
            if (oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length) {
                var droppedPref = oldPrefs.filterBy('session.sessionName', dropSession.get('sessionName')).objectAt(0);
                droppedPref.set('rank', targetPrefRank);
                droppedPref.save().then(function () {
                    console.log('saved!');
                }, function (reason) {
                    console.log('failure: ' + reason);// handle the error
                }); 
            } else {

                if (oldPrefs.filterBy('rank', targetPrefRank).length) {
                    var replacedPref = oldPrefs.filterBy('rank', targetPrefRank).objectAt(0);
                    replacedPref.set('session', session);

                    replacedPref.save().then(function () {
                        console.log('saved!');
                    }, function (reason) {
                        console.log('failure: ' + reason);// handle the error
                    }); 
                } else {

                    var newPref = this.store.createRecord('preference', {
                        rank: targetPrefRank,
                        student: student,
                        session: session
                    });

                    newPref.save().then(function () {
                        console.log('saved!');
                    }, function (reason) {
                        console.log('failure: ' + reason);// handle the error
                    }); 
                }
            }
    	},
        
        lockPrefs: function() {
            var thisStudent = this.get('model');
            thisStudent.set('locked', true);
            thisStudent.save();
        }
    },

    /*
    this property is an array in ranked order where unset preferences are represented 
    by a null element in the array.  

    rankedOrNullArray[0] is the preference with rank 1 or null, 
    depending on if it has been set 
    */
    rankedOrNullArray: function() {
        var array = this.get('model.preferences');
        var rankedOrNullArray = [];
        function sortByRank(pref) {
                if (pref.get('rank') === i) {
                    tempPref = pref;
                }
            }
        for (var i = 1; i < 7; i++) {
            var tempPref = 0;
            array.forEach(sortByRank);
            if (tempPref !== 0) {
                rankedOrNullArray.pushObject(tempPref);
            } else {
                rankedOrNullArray.pushObject(null);
            }
        }
        return rankedOrNullArray;
    }.property('model.preferences.@each.rank', 'model.preferences.@each.session'),

    sessions: function (key, value, oldValue) {
        var prefs = this.get('model.preferences');
        var unavailableSessionNames = [];
        var availableSessions = [];
        var self = this;

        prefs.forEach(function (pref) {
            unavailableSessionNames.pushObject(pref.get('session.sessionName'));
        });
        
        var promise = this.store.findAll('session').then(function (result) {
            result.forEach(function (session) {
                if (!unavailableSessionNames.contains(session.get('sessionName'))) {
                    availableSessions.pushObject(session);
                }
            })
            return availableSessions;    
        })

        return DS.PromiseArray.create({
            promise: promise
        });

    }.property('model.preferences.@each.rank', 'model.preferences.@each.session')
}); 