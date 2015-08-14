import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        // return empty model so that fields are not
        // populated from an earlier add.
        return {};
    }
});
