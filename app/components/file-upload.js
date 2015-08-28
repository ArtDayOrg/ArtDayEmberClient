import Ember from 'ember';

export default Ember.TextField.extend({
  attributeBindings: ['name', 'data-url', 'multiple'],
  tagName: 'input',
  type: 'file',
  multiple: false,
  handleOnChange: function(evt) {
    console.log(evt);
  }  
});