module.exports = function(app) {
  var express = require('express');
  var studentsRouter = express.Router();

  studentsRouter.get('/', function(req, res) {
    res.send({
      'students': [{
        "id": 1,
        "firstName": "BRIAN",
        "lastName": "KING",
        "grade": 12,
        "locked": false,
        "preferences": [],
        "enrollments": []
      }, {
        "id": 2,
        "firstName": "JOE",
        "lastName": "FORSMANN",
        "grade": 12,
        "locked": false,
        "preferences": [],
        "enrollments": []
      }]
    });
  });

  studentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  studentsRouter.get('/:id', function(req, res) {
    res.send({
      'students': {
        id: req.params.id
      }
    });
  });

  studentsRouter.put('/:id', function(req, res) {
    res.send({
      'students': {
        id: req.params.id
      }
    });
  });

  studentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/students', studentsRouter);
};