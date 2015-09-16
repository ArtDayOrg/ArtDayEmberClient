var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  defaults.fingerprint = {enabled: false};
  defaults.minifyCSS = {enabled: false};
  defaults.minifyJS = {enabled: false};
	var app = new EmberApp(defaults);
	app.import('bower_components/bootstrap/dist/js/bootstrap.js');
	app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/ember-droplet/dist/ember-droplet.min.js');
	return app.toTree();
};