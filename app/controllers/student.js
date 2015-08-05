import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

    allPrefsSet: function() {

        if (this.get('model.preferences.length') === 6) {
            return true;
        } else {
            return false;
        }}.property('model.preferences.length'),

    actions: {
    	sessionDropped: function (session, ops) {

            function saveThenLog(pref, student) {
                console.log('saving:')
                console.log(pref);
                pref.save().then(function () {
                    console.log('saved!');
                }, function (reason) {
                    console.log('failure: ' + reason);// handle the error
                }); 
                student.save().then(function () {
                    console.log('saved This');
                }, function () {
                    console.log('this failed: ' + reason);
                })}

            var oldPrefs = this.get('model.preferences');

            
            //Dragging a preferred section back to availabale sessions
            if (ops.target.get('rank') === 0) {
                console.log("0: if (ops.target.get('rank') === 0)")
                if (oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length) {
                    var prefToDelete = oldPrefs.filterBy('session.sessionName', session.get('sessionName')).objectAt(0);
                    prefToDelete.destroyRecord();
                }
                return;
            }

            var student = this.get('model');
            var dropSession = session.content;
            var targetPrefRank = ops.target.get('rank');            
            
            //if the session is dragged to a preference that is already set...
            if (oldPrefs.filterBy('rank', targetPrefRank).length) {

                console.log("1: oldPrefs.filterBy('rank', targetPrefRank).length")

                var exit = false;

                //cycle through the set preferences (if they reordered the set prefs by dragging one to a different rank)
                oldPrefs.forEach(function (oldPref) {

                    if (exit) { return; }

                    var oldPrefRank = oldPref.get('rank');
                    
                    //check to see if preferences should be switched
                    if (oldPref.get('session.sessionName') === session.get('sessionName')) {

                        console.log("2: oldPref.get('session.sessionName') === session.get('sessionName')")
                        var targetPref = oldPrefs.filterBy('rank', targetPrefRank).objectAt(0);

                        //switch them
                        targetPref.set('rank', oldPrefRank);
                        saveThenLog(targetPref, student);
                        oldPref.set('rank', targetPrefRank);
                        saveThenLog(oldPref, student);

                        exit = true;
                        return; 
                    }
                });

                if (exit) { return; }

                //otherwise they dragged from the bottom to the top, so replace the target session with the dragged session
                console.log("4: oldPrefs.filterBy('rank', targetPrefRank).length fell through forEach")
                var replacedPref = oldPrefs.filterBy('rank', targetPrefRank).objectAt(0);
                replacedPref.destroyRecord();

                var newPref = this.store.createRecord('preference', {
                    rank: targetPrefRank,
                    student: student,
                    session: session
                });
                saveThenLog(newPref, student);


            } 
            if (oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length) {

                console.log("3: oldPrefs.filterBy('session.sessionName', session.get('sessionName')).length")
                var droppedPref = oldPrefs.filterBy('session.sessionName', dropSession.get('sessionName')).objectAt(0);
                droppedPref.set('rank', targetPrefRank);
                saveThenLog(droppedPref, student);
            } else {
                if (oldPrefs.filterBy('rank', targetPrefRank).length) {

                } else {

                    console.log("5: lastElse")
                    var newPref = this.store.createRecord('preference', {
                        rank: targetPrefRank,
                        student: student,
                        session: session
                    });
                    saveThenLog(newPref, student);
                }
            }},
        
        lockPrefs: function() {
            var thisStudent = this.get('model');
            thisStudent.set('locked', true);
            thisStudent.save();}
    },



    /*
    this property is an array in ranked order where unset preferences are represented 
    by a null element in the array.  rankedOrNullArray[0] is the preference with rank 1 or null.
    Our template wants to cycle through this and display prefs or an empty box when null.
    */
    rankedOrNullPrefsArray: function() {
        var array = this.get('model.preferences');
        var rankedOrNullPrefsArray = [];
        function sortByRank(pref) {
                if (pref.get('rank') === i) {
                    tempPref = pref;
                }
            }
        for (var i = 1; i < 7; i++) {
            var tempPref = 0;
            array.forEach(sortByRank);
            if (tempPref !== 0) {
                rankedOrNullPrefsArray.pushObject(tempPref);
            } else {
                rankedOrNullPrefsArray.pushObject(null);
            }
        }
        return rankedOrNullPrefsArray;
    }.property('model.preferences.@each.rank', 'model.preferences.@each.session'),

    availableSessions: function () {
        var prefs = this.get('model.preferences');
        var unavailableSessionNames = [];
        var availableSessions = [];

        prefs.forEach(function (pref) {
            unavailableSessionNames.pushObject(pref.get('session.sessionName'));
        });


        
        console.log('findAll sessions')
        this.store.peekAll('session').forEach(function (session) {
            if (!unavailableSessionNames.contains(session.get('sessionName'))) {
                    availableSessions.pushObject(session);
                }
            console.log(availableSessions)
        });
        console.log(availableSessions)
        return availableSessions;
        
    }.property('model.preferences.@each.rank', 'model.preferences.@each.session')
}); 