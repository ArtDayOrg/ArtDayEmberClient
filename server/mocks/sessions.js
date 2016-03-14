module.exports = function(app) {
  var express = require('express');
  var sessionsRouter = express.Router();

  sessionsRouter.get('/', function(req, res) {
    res.send({
      'sessions': [{
        id: 2,
        capacity: 25,
        description: "Join us in the doughnut making class as we walk you through the doughnut making process. ",
        instructorName: "Don Tremblay",
        sessionName: "Doughnuts",
        location: "151",
        instructions: "",
        preferences: [],
        enrollments: []
      }, {
        id: 7,
        capacity: 20,
        description: "Improv is spontaneous, entertaining and fun. But like all great things, you’ll have to see it first hand to fully experience and appreciate it. Join us to learn about Improv techniques. ",
        instructorName: "Mike Christensen",
        sessionName: "Improv",
        location: "146",
        instructions: "",
        preferences: [],
        enrollments: []
      }, {
        id: 8,
        capacity: 20,
        description: "More people stick with Zumba than any other workout. Come find out why!",
        instructorName: "April Quedado",
        sessionName: "Zumba",
        location: "Lyceum",
        instructions: "Wear loose fitting clothes.",
        preferences: [],
        enrollments: []
      }, {
        id: 9,
        capacity: 20,
        description: "Stage combat is a specialized technique in theatre designed to create the illusion of physical combat without causing harm to the performers. It is employed in live stage plays as well as operatic and ballet productions. Join us to learn about the techniques.",
        instructorName: "Kristina S Rowell",
        sessionName: "Stage Combat",
        location: "160",
        instructions: "",
        preferences: [],
        enrollments: []
      }, {
        id: 10,
        capacity: 20,
        description: "Learn the wonderful world of authentic French crêpes… ",
        instructorName: "Frederic Francois",
        sessionName: "Crepes",
        location: "140",
        instructions: "",
        preferences: [],
        enrollments: []
      }, {
        id: 13,
        capacity: 20,
        description: "Learn the basic techniques of Mehndi; a gorgeous ceremonial art form of India.",
        instructorName: "Balbi Senapati",
        sessionName: "Indian Henna",
        location: "Atrium (between 140/139)",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 18,
        capacity: 20,
        description: "Learn authentic Bollywood dance with combination of fitness to give you a fabulous power packed hour of fun, dance, and laughter. ",
        instructorName: "Neethasumana Tuluri",
        sessionName: "Bollywood Dance",
        location: "170",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 19,
        capacity: 20,
        description: "Learn the basics of Hawaiian Lei Making; you’ll create your own unique work of art and feel as though you’ve been transported to the islands!",
        instructorName: "Malia Steeb",
        sessionName: "Hawaiian Leis",
        location: "134",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 21,
        capacity: 10,
        description: "Learn the basics of drumming and rhythm. Try out various Drums such as Djembes, Ashikos, Talking Drums, Djun djuns, Doumbeks, Cajons, etc. ",
        instructorName: "Mr. Eric Samse",
        sessionName: "Everyone's a Drummer",
        location: "133-Henry",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2089,
        capacity: 30,
        description: "Learn how to make chocolate, use chocolate molds and create professional chocolate recipes. ",
        instructorName: "Megan Valdee",
        sessionName: "Chocolate",
        location: "152-Nelson",
        instructions: "",
        preferences: [],
        enrollments: []
      }, {
        id: 2090,
        capacity: 20,
        description: "Learn the basic technique of ink stamping, you’ll carve your own South American mask themed stamp and use inks to transfer that stamp to create a unique work of art.",
        instructorName: "Julia Piterkina",
        sessionName: "South American Ink Stamp",
        location: "169",
        instructions: "Wear old clothes you don't mind getting stained, or bring a smock; the inks may stain clothing.",
        preferences: [],
        enrollments: []
      }, {
        id: 2091,
        capacity: 20,
        description: "This class will teach the basics of repoussé, the art form of embossing metal to create a relief. The art designs will be based on African animals.",
        instructorName: "Suhita Sengupta",
        sessionName: "African Animal Tin Engraving",
        location: "165",
        instructions: "",
        preferences: [],
        enrollments: []
      }, {
        id: 2092,
        capacity: 40,
        description: "Come experience the beautiful art form of scroll making using Chinese Lettering and painting. You will learn basic techniques that will allow you to create a masterful work of art.",
        instructorName: "Eppie Garfield/Jian Liang",
        sessionName: "Chinese Calligraphy ",
        location: "156",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2093,
        capacity: 20,
        description: "Learn basic digital photography techniques and learn what an amazing art form photography can truly be!",
        instructorName: "Dave Culver",
        sessionName: "American Digital Photography",
        location: "166",
        instructions: "Please bring either a camera or cell phone for taking photos.",
        preferences: [],
        enrollments: []
      }, {
        id: 2094,
        capacity: 20,
        description: "Learn basic techniques that allow you to transfer your printed images to any surface! Your finished artwork will be based on images from the Caribbean islands.",
        instructorName: "Monica Mann",
        sessionName: "Caribbean Image Transfer",
        location: "132",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2095,
        capacity: 20,
        description: "Experience the wonder and excitement of 19th century Europe – the joie de vivre! Create a fantastic travel poster for your favorite European country using the style of Henri de Toulouse-Lautrec!",
        instructorName: "Wendy Choy",
        sessionName: "European Travel Posters",
        location: "157",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2096,
        capacity: 20,
        description: "Using thin gauge wire, create a unique small scale map that will be collaboratively connected to your fellow student’s artwork! The oversized piece will feature multiple wire maps and will become a permanent fixture at ICS.",
        instructorName: "Fin Lee",
        sessionName: "Collaborative Wire Maps",
        location: "Atrium (outside 145/146)",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2097,
        capacity: 20,
        description: "Create a unique and wearable piece of art based on the beautiful artwork of the Australian Aboriginal people. Will require you to bring a t-shirt for your project!",
        instructorName: "Janaki Tirumala",
        sessionName: "Australian Aboriginal Fabric ",
        location: "145",
        instructions: "Bring a PLAIN t-shirt of any color to use in creating your project.",
        preferences: [],
        enrollments: []
      }, {
        id: 2098,
        capacity: 25,
        description: "Enjoy street foods and music from India! Part Demo, Part Hands On. Lots of tasting and lots of fun. Mango Lassi (a sweet drink), Papadi Chaat (savory Indian nachos) and a dessert! Vegan with Gluten & Nuts.",
        instructorName: "Vandana Shah",
        sessionName: "Indian Cooking",
        location: "139",
        instructions: "This class includes items with Gluten and Nuts. ",
        preferences: [],
        enrollments: []
      }, {
        id: 2100,
        capacity: 20,
        description: "Hip Hop is a high energy type of dance, originating from funk and street dance. The classes focus on different stylized techniques, rhythm, and isolations. Join us to to engage in freestyle to help build style and confidence. ",
        instructorName: "Ms. Hanna Wintrode",
        sessionName: "Hip Hop Dance",
        location: "161",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2101,
        capacity: 16,
        description: "Have fun learning how to cook delicious food from around the Mediterranean Sea.",
        instructorName: "Salwa Canner",
        sessionName: "Mediterranean Cooking",
        location: "154",
        instructions: null,
        preferences: [],
        enrollments: []
      }, {
        id: 2102,
        capacity: 20,
        description: " Learn fundamental Yoga postures to develop flexibility, strength, focus and relaxation. ",
        instructorName: "Thereza Howling",
        sessionName: "The Art Of Teen Yoga",
        location: "149",
        instructions: "Wear loose fitting clothes.",
        preferences: [],
        enrollments: []
      }]
    });
  });

  sessionsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  sessionsRouter.get('/:id', function(req, res) {
    res.send({
      'sessions': {
        id: req.params.id
      }
    });
  });

  sessionsRouter.put('/:id', function(req, res) {
    res.send({
      'sessions': {
        id: req.params.id
      }
    });
  });

  sessionsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/sessions', sessionsRouter);
};