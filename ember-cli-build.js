
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
	var app = new EmberApp(defaults);
	app.import('bower_components/bootstrap/dist/js/bootstrap.js');
	app.import('bower_components/bootstrap/dist/css/bootstrap.css');

	return app.toTree();
};