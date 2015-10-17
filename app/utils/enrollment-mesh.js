export default function enrollmentMesh(outerSelf) {
  function Enrollment(emberSession, emberStudent, period) {
    this.emberSession = emberSession;
    this.emberStudent = emberStudent;
    this.period = period;
  }

  //best performance at shuffling array from http://jsperf.com/array-shuffle-comparator/5
  Array.prototype.shuffle1 = function() {
    var l = this.length + 1;
    while (l--) {
      var r = ~~(Math.random() * l),
        o = this[r];
      this[r] = this[0];
      this[0] = o;
    }
    return this;
  };

  //exclusive diff
  //from http://stackoverflow.com/questions/1187518/javascript-array-difference
  //returns an array with all elements of the first array that are not in the second array
  //e.g. [1,2,3].diff([3,4,5]) --> [1,2];
  Array.prototype.diff = function(a) {
    //Breaks in IE 8
    return this.filter(function(i) {
      return a.indexOf(i) < 0;
    });
  };

  function loadStudents(outerSelf) {

    function Student(emberStudent) {
      this.emberStudent = emberStudent;
      this.grade = emberStudent.get('grade');
      this.preferences = emberStudent.get('preferences').sortBy('rank').reverse();

      //only students who set preferences get priority
      this.priority = this.preferences.length > 0 ? this.grade : 0;
      this.bumpCount = 0;
      this.proposedEnrollment = null;
      this.deniedEnrollments = [];
      this.enrolled = [];
    }

    var students = [];
    var studentsFromModel = outerSelf.get('students');
    studentsFromModel.forEach(function(s) {
      var newStudent = new Student(s);
      students.push(newStudent);
    });

    return students;
  }

  function resetStudents(students) {
    students.forEach(function(s) {
      s.deniedEnrollments.splice(0, s.deniedEnrollments.length);

      //students who were bumped from their preferences in earlier rounds get preferred placemnet in later rounds.
      s.priority = s.preferences.length > 0 ? s.grade + (s.bumpCount * 3) : 0;

      //preserving some bump count for highly bumped students seemed to produce the best results 
      //through trial and error but could probably be optimized further
      s.bumpCount = s.bumpCount > 4 ? 2 : 0;

      s.enrolled.push(s.proposedEnrollment);
      s.proposedEnrollment = null;

      //students are denied enrollment in sessions they are already enrolled in during a different period
      s.enrolled.forEach(function(e) {
        s.deniedEnrollments.push(e);
      });
    });
  }

  function loadSessions(outerSelf) {
    function Session(emberSession) {
      this.emberSession = emberSession;
      this.sessionName = emberSession.get('sessionName');
      this.capacity = emberSession.get('capacity');
      this.proposedEnrollments = [];
    }
    var sessions = [];
    var sessionsFromModel = outerSelf.get('sessions');
    sessionsFromModel.forEach(function(s) {
      var newSession = new Session(s);
      sessions.push(newSession);
    });
    return sessions;
  }

  function resetSessions(sessions) {
    sessions.forEach(function(s) {
      s.proposedEnrollments.splice(0, s.proposedEnrollments.length);
    });
  }

  function enrollmentsToDB(enrollments, outerSelf) {
    var needed = 0;
    var i;

    for (i = 0; i < enrollments.length; i++) {
      needed += enrollments[i].length;
    }


    var body = [];

    allEnrollments.forEach(function(enrollmentArray) {
      enrollmentArray.forEach(function(enrollment) {

        var enrollmentJSON = {
          'studentId': enrollment.emberStudent.get('id'),
          'sessionId': enrollment.emberSession.get('id'),
          'period': enrollment.period
        };
        body.push(enrollmentJSON);
      });
    });
    Ember.$.ajax({
      method: 'POST',
      url: 'http://artday.azurewebsites.net/api/enrollments/Add',
      data: JSON.stringify(body)
    }).done(function() {
      outerSelf.set('enrollmentSucceeded', true);

      //bubbles from admin/overview/enrollment to be handled in routes/admin 
      outerSelf.send('refreshAdmin');
    });
  }

  function mesh(sessions, students, period) {

    //iterates through sessions that have proposed enrollments and returns an array of enrollments for that period
    function createEnrollments(sessions) {
      var enrollments = [],
        i, s, j, enrollment;
      for (i = 0; i < sessions.length; i++) {
        s = sessions.objectAt(i);
        for (j = 0; j < s.proposedEnrollments.length; j++) {
          enrollment = new Enrollment(s.emberSession, s.proposedEnrollments[j].emberStudent, period);
          enrollments.push(enrollment);
        }
      }
      return enrollments;
    }

    // required by our version of Gale-Shapely Algorithm
    // returns the next unenrolled student if there is one or null
    function freeStudent(students, sessions) {
      function denyEnrolledSessionsForStudent(student) {
        student.enrolled.forEach(function(e) {
          student.deniedEnrollments.push(e);
        });
      }
      var student, i;
      for (i = 0; i < students.length; i++) {
        student = students.objectAt(i);

        // handle a special case that was (rarely) causing errors
        // if a student has no proposed enrollment and has been denied from every session, then that student would be orphaned.
        // for example where a student without preferences is assigned the two least popular sessions during the first two runs through
        // and then is processed late in the last run through, when only the 2 sessions they are already assigned to are available.
        // to handle this special case, we set their denied enrollments to be only those sessions they are enrolled in, 
        // then give them priority over all other students without preferences and try again.  
        // this ensures both no students are orphaned and that no orphan bumps a student who did set their preferences
        if (student.proposedEnrollment === null && student.deniedEnrollments.length === sessions.length) {
          student.deniedEnrollments = [];
          denyEnrolledSessionsForStudent(student);
          student.priority += 1;
          return student;
        }

        // return the next unenrolled student
        if (student.proposedEnrollment === null) {
          return student;
        }
      }
      return null;
    }

    //required by our version of Gale-Shapley
    //returns the best session for a student if their is one
    //a random eligable session in the event of a tie
    //and null if the sessions are all full
    function bestSessionForStudent(student, sessions) {

      function prefNotInDenied(pref, denied) {
        var prefName = pref.get('session.sessionName'),
          i, deniedName;
        for (i = 0; i < denied.length; i++) {
          deniedName = denied[i].sessionName;
          if (prefName === deniedName) {
            return false;
          }
        }
        return true;
      }

      function sessionNameFilter(s) {
        return student.preferences.objectAt(i).get('session.sessionName') === s.sessionName;
      }

      function availableSessions(sessions, prefs, student) {
        var notPreferredSessions = [],
          i, s, j, p;
        for (i = 0; i < sessions.length; i++) {
          s = sessions[i];
          for (j = 0; j < prefs.length; j++) {
            p = prefs[j];
            if (p.get('sessionName') === s.sessionName) {
              break;
            }
          }
          notPreferredSessions.push(s);
        }
        var available = notPreferredSessions.diff(student.deniedEnrollments);
        return available;
      }

      var bestSession = null,
        prefs = student.preferences,
        i, available;

      //go through preferences and grab the first session they are both eligable and prefer
      for (i = 0; i < prefs.length; i++) {
        if (prefNotInDenied(prefs[i], nextStudent.deniedEnrollments)) {
          bestSession = sessions.filter(sessionNameFilter)[0];
        }
      }

      //if there is no such session, or if they did not set their preferences, they get a random session chosen from all available sessions
      if (!bestSession) {
        available = availableSessions(sessions, prefs, student);
        bestSession = available[Math.floor(Math.random() * available.length)];
      }

      return bestSession;
    }

    // Gail-Shapley Algorithm starts here, adopted from Algorithm Design Kleinberg and Tardos
    //
    // because we process students preferences and not the sessions preferences, we are sure
    // students cannot cheat by lying about their preferences, per http://www.columbia.edu/~js1353/pubs/tst-ipco99.pdf
    // pgs 432-438 (students correspond to men in the discussion in the paper)

    // while there is a student nextStudent who is free and hasn't attempted enrollment in every class    

    var nextStudent, bumpedStudent, nextStudentsSession;
    while (true) {

      //choose such a student(nextStudent)
      nextStudent = freeStudent(students, sessions);

      if (nextStudent) {

        //let nextStudentsSession be the highest-ranked session in nextStudents preference list to whom nextStudent has not attempted enrollment
        nextStudentsSession = bestSessionForStudent(nextStudent, sessions);

      } else {

        //if there are no more students, then the algorithm is complete
        break;
      }

      //if there is such a session and there is space in that session
      if (nextStudentsSession && nextStudentsSession.proposedEnrollments.length < nextStudentsSession.capacity) {

        //that student proposes to enroll in that session
        nextStudentsSession.proposedEnrollments.push(nextStudent);
        nextStudent.proposedEnrollment = nextStudentsSession;
        nextStudent.deniedEnrollments.push(nextStudentsSession);

        //otherwise, there is such a session but the session is currently full
      } else if (nextStudentsSession) {

        //if that session prefers the next student to it's least desired student 
        //(index 0 of the sorted array)
        nextStudentsSession.proposedEnrollments.sort(function(a, b) {
          return a.priority - b.priority;
        });
        if (nextStudent.priority > nextStudentsSession.proposedEnrollments[0].priority) {

          //the least desired student is bumped and the next student gets the enrollment
          bumpedStudent = nextStudentsSession.proposedEnrollments[0];
          bumpedStudent.proposedEnrollment = null;
          bumpedStudent.bumpCount += 1;
          nextStudent.proposedEnrollment = nextStudentsSession;
          nextStudent.deniedEnrollments.push(nextStudentsSession);
          nextStudentsSession.proposedEnrollments.shift();
          nextStudentsSession.proposedEnrollments.push(nextStudent);

          //else the session prefers its lowest enrolled member to nextStudent
        } else {

          //the next student is denied enrollment
          nextStudent.bumpCount += 1;
          nextStudent.deniedEnrollments.push(nextStudentsSession);
        }

        //else the total capacity is less than the total number of students.
        //(our app should never enter because we check capacity vs. number of students before giving them the option to enroll)
        //if we wanted to allow less capacity than students, leaving the least preferred to be unenrolled, 
        //then we would not break here, but we don't allow that.
      } else {
        console.warn('not enough total session capacity for every student');
        break;
      }
    }

    //return an array of enrollments for the period
    return createEnrollments(sessions);
  }

  //shuffle students so mesh has no hidden biases
  var students = loadStudents(outerSelf).shuffle1(),
    sessions = loadSessions(outerSelf),
    allEnrollments = [],
    enrollmentsForSinglePeriod, loop;

  //3,2,1
  loop = 4;
  while (--loop) {
    enrollmentsForSinglePeriod = mesh(sessions, students, loop);
    allEnrollments.push(enrollmentsForSinglePeriod);

    //if we are going to loop again, reset students and sessions
    if (loop === 1) {
      break;
    }

    resetStudents(students);
    resetSessions(sessions);
  }

  enrollmentsToDB(allEnrollments, outerSelf);
}