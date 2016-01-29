module.exports = function(app) {
  var express = require('express');
  var enrollmentsRouter = express.Router();

  enrollmentsRouter.get('/', function(req, res) {
    res.send({
      'enrollments': []
    });
  });

  enrollmentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  enrollmentsRouter.get('/:id', function(req, res) {
    res.send({
      'enrollments': {
        id: req.params.id
      }
    });
  });

  enrollmentsRouter.put('/:id', function(req, res) {
    res.send({
      'enrollments': {
        id: req.params.id
      }
    });
  });

  enrollmentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/enrollments', enrollmentsRouter);
};
