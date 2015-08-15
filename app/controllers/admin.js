import Ember from 'ember';
import FB from 'ember-cli-facebook-js-sdk/fb';

export default Ember.Controller.extend({
    // will add auth later
    isAdmin: true,
    isLoggedIn: function() {
        console.log('inside isLoggedIn method.');
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
          } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            // but has not authenticated your app
          } else {
            // the user isn't logged in to Facebook.
          }
        }, function(error) {
            console.log(error);
        });
    }.property(),
    actions: {
        
    }
});