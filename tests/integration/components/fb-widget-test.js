import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fb-widget', 'Integration | Component | facebook widget', {
  integration: true
});

test('adminName and imageUrl show up correctly', function(assert) {

  assert.expect(2);

  var adminName = 'Joe';
  var imageUrl = 'http://test.com/img.jpg';

  this.set('adminName', adminName);
  this.set('userImageUrl', imageUrl);

  this.render(hbs `{{fb-widget adminName=adminName userImageUrl=userImageUrl}}`);

  assert.equal(this.$().find('#fbImageUrl').attr('src'), imageUrl, 'image path ok');
  assert.equal(this.$().find('#adminName').text().trim(), adminName, 'admin name renders');

});

test('logout action works', function(assert) {
  assert.expect(2);

  this.render(hbs `{{fb-widget logout='logoutClicked'}}`);

  var $button = this.$('#logoutButton');
  assert.equal($button.length, 1, 'logout button exists');

  this.on('logoutClicked', function() {
    assert.equal(1, 1);
  });

  $button.click();

});