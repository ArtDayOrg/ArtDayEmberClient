import FB from 'ember-cli-facebook-js-sdk/fb';

export default {
  name: 'fb',
  initialize: function() {
    return FB.init({
      appId: '491786194317658',
      version: 'v2.3',
      xfbml: true
    });
  }  
};