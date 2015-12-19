/*global FB, $ */
import Ember from 'ember';
import enrollmentMesh from '../utils/enrollment-mesh';

export default Ember.Controller.extend({

    //currentPath
    appController: Ember.inject.controller('application'),
    app: Ember.computed.reads('appController'),

    //facebook login
    isAdmin: false,
    adminName: null,
    userImageUrl: null,

    //enrollment
    enrollmentBegan: false,
    enrollmentSucceeded: false,
    enrollmentFailed: false,

    isEnrolled: function() {
        return (this.get('enrollment.length') > 0);
    }.property('enrollment.length'),

    hasSetPrefs: function() {
        var count = 0;
        var students = this.get('students');
        students.forEach(function(s) {
            if (s.get('preferences.length') > 0) {
                count += 1;
            }
        });
        return count;
    }.property('students.@each.preferences'),

    totalCapacity: function() {
        var count = 0;
        var sessions = this.get('sessions');
        sessions.forEach(function(s) {
            var value = parseInt(count);
            count = value + parseInt(s.get('capacity'));
        });
        return count;
    }.property('sessions.@each.capacity', 'sessions.length'),

    enrollmentAvailable: function() {
        if (this.get('totalCapacity') >= this.get('students.length')) {
            return true;
        }
        return false;
    }.property('totalCapacity', 'students.length'),

    atAdminIndex: function() {
        if (this.get('app.currentPath') === 'admin.index') {
            return true;
        } else {
            return false;
        }
    }.property('app.currentPath'),

    actions: {

        login: function() {

            $('#loginError').hide();
            var self = this;

            FB.login(function(response) {
                if (response.status === 'connected') {

                    var adminList = ['forsmann@frontier.com', 'brian.spencer.king@gmail.com'];

                    FB.api('/me?fields=name,email,picture', function(response) {

                        if ($.inArray(response.email, adminList) !== -1) {
                            self.set('isAdmin', true);
                            self.set('adminName', response.name);
                            self.set('userImageUrl', response.picture.data.url);
                            self.transitionToRoute('admin');
                        } else {

                            // user is logged in, but NOT an admin.
                            self.set('isAdmin', false); // should already be false.
                            $('#loginError').show();
                            FB.logout();
                        }
                    });
                }
            }, {
                scope: 'public_profile,email'
            });
        },

        logout: function() {
            var self = this;
            FB.logout(function() {
                self.set('isAdmin', false);
            });
        },

        enroll: function() {
            var outerSelf = this;
            this.set('enrollmentBegan', true);
            enrollmentMesh(outerSelf);
        }
    }
});