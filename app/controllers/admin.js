import Ember from 'ember';

export default Ember.Controller.extend({
    isAdmin: false,
    actions: {
        login: function () {
            Ember.$("#message").hide();
            if (Ember.$('#pw').val() === 'password') {
                this.set('isAdmin', true);                
            } else {
                Ember.$("#message").show();
            }
        }
    }
});