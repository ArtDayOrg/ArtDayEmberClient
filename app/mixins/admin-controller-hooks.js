import Ember from 'ember';

export default Ember.Mixin.create({

    adminController: Ember.inject.controller('admin'),
    admin: Ember.computed.reads('adminController')
    
});
