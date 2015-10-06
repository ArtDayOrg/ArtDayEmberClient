import Ember from 'ember';

export function lastItem(params) {
  //current items index
  let index = params[0];

  //index of last item, calculated by subtracting 1 from it's length
  let lastIndex = params[1] - 1;
  return index === total;
}

export default Ember.Helper.helper(lastItem);