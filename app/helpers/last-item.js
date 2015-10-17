import Ember from 'ember';

export function lastItem(params) {
  //current items index
  var index = params[0];

  //index of last item, calculated by subtracting 1 from it's length
  var lastIndex = params[1] - 1;
  return index === lastIndex;
}

export default Ember.Helper.helper(lastItem);