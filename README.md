# Art-day

This web app manages a special event for a school.  It is used in 3 stages.  First, an admin sets up the site by importing a list of students:

![Student upload image.](screenshots/ImportStudents.png =120x)

Then the admin sets up the possible sessions:

![Create Session Image.](screenshots/CreateSessions.png =120x)

The students then log in and rank their top 6 preferred sessions, by dragging and dropping tiles representing the sessions. 
![Student Set Preferences image](screenshots/Prefs.png =120x)

Once all students set their preferences, the admin sets enrollment.  This runs a customized version of the Gale-Shapley Algorithm, guarenteeing a distribution where no two students would exchange sessions in a single period.  This maximizes happiness for the the highest possible number of students.  This replaces a process where many volunteers would get paper forms from the students, then sit around a table and sort 440 pieces of paper by hand to produce a less than optimal result.  

The students then return to print their schedules:

![Student Schedule Image](screenshots/Schedule.png =120x)

and the admin prints rosters for the instructors of the sessions.

![Roster Image](screenshots/Rosters.png =120x)

## Installation

We are working on making this app generic enough for other schools with similar needs to use.  Coming soon :)

### Contributing

This web app did a great job of handling the task we threw at it.  Several steps are needed to take it to the next level:

* This web app was developed with non-existent requirements for security.  We want to integrate ember-simple-auth to add a layer of security for the admin log in and the master list of students.
* We did not have access to any information about the students except for first name last name and grade.  We would like to support logging in with a unique code (emailed to students if email is provided) or with a studentID #, if that is provided.  This would allow students a layer of security when logging in, and allow the underlying app to be used in scenarios where the users are not trusted.
* There are many opportunities to make our app more generic, including:  
* - supporting user defined dates for the beginning and end of setting preferences
* - creating an easy way to customize many of the hard coded values, such as number of periods, number of preferences to be set, strings, and the schedules displayed.  This item is our next priority.  (The matching algorithm at the heart of the app is already generic and will support arbitrary numbers of preferences and periods.)
