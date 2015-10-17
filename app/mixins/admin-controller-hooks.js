import Ember from 'ember';

//TO-DO: This is unidiomatic and should be redone by delegating admin verification to a service.  

export default Ember.Mixin.create({

  adminController: Ember.inject.controller('admin'),
  admin: Ember.computed.reads('adminController')

});