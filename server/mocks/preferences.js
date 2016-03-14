module.exports = function(app) {
  var express = require('express');
  var preferencesRouter = express.Router();

  preferencesRouter.get('/', function(req, res) {
    res.send({
      'preferences': []
    });
  });

  preferencesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  preferencesRouter.get('/:id', function(req, res) {
    res.send({
      'preferences': {
        id: req.params.id
      }
    });
  });

  preferencesRouter.put('/:id', function(req, res) {
    res.send({
      'preferences': {
        id: req.params.id
      }
    });
  });

  preferencesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/preferences', preferencesRouter);
};
