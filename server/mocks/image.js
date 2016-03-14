module.exports = function(app) {
  var express = require('express');
  var imageRouter = express.Router();

  imageRouter.get('/', function(req, res) {
    res.send({
      'image': []
    });
  });

  imageRouter.post('/', function(req, res) {
    console.log('hi guys image posted');
    res.status(201).end();
  });

  imageRouter.get('/:id', function(req, res) {
    res.send({
      'image': {
        id: req.params.id
      }
    });
  });

  imageRouter.put('/:id', function(req, res) {
    res.send({
      'image': {
        id: req.params.id
      }
    });
  });

  imageRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/image', imageRouter);
};