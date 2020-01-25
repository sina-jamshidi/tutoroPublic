# Tutoro

Tutoro is an open source peer tutor matching service made with Django-React-Redux-PostgresSQL.

![Tech stack](https://i.imgur.com/Fg7tWTy.png)

I made this project as an exercise in full stack development. I tried to mostly implement features manually to learn more about them. For example, while I used Django's built-in password reset email system, I implemented my own email verification flow - complete from model to api to frontend.

The idea behind this project was to enable easier and more organized connection between students who can help each other. Right now students are finding tutors from craigslist, or flyers across campus, or by going on department specific discords. Tutoro is school specific and only allows certain email addresses to sign up, so that it is focused on the peer tutoring community.

## Current State:

The app is currently in the MVP state. Functions include:

[X] Authentication system complete (registration, email verification, login, change password, reset password)

[X] Each user can add courses they can tutor, and add courses they need to be tutored in

[X] Each user can see other users that match the courses they can tutor or need to be tutored in

[X] User can filter matching results by course

[X] Signup is restricted to a specific school (in this case my school: Simon Fraser University)

[X] Backend tracks when a user requests the email of another user (this will be used for analytics, and for future features such as verifying reviews)



## Planned Features:

Some of these are smaller than others. I will be working on this part time.

### Shorter Term Features:

[] Allow tutors to edit course price without having to remove a course and re-add it

[] Sort match results (group results even when not filtered)

[] Clean up code and comments

[] Add autocomplete to adding courses to profile

[] Get help with ui/ux and overall design (I am definitely not a designer)



### Longer Term Goals:

[] Implement a review system for tutors

​	[] Will require public user profiles

​	[] Would be nice to review tutors in multiple categories (knowledge, teaching ability, personable etc)

[] Consult for more ui/ux changes, eg. if same person can tutor you in two courses, show as one result?



### Possibilities For The Future:

[] Implement in app messaging

[] Implement in app scheduling

[] Allow for subscription model? (If you want to tutor, you pay a small fee for a semester for matching/messaging/scheduling)	



## Development:

If you would like to try this out, or perhaps set it up for your own school, clone the repo first.

For development you want to make a few changes:

- In `tutoroProject/tutoroProject/settings.py`:
  - set `Debug=True`
  - comment out `'URL': os.environ['DATABASE_URL']` and `DATABASES['default']=...`
  - uncomment the following fields in `DATABASES = {}`: `'NAME', 'USER', 'PASSWORD', 'HOST', PORT'`
  - I set the project up with Postgres, read more about how to set it up [here]( https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-14-04 ) and [here]( https://medium.com/agatha-codes/painless-postgresql-django-d4f03364989 ). Alternatively you can switch back to SQLite for local development by changing your database settings as seen [here]( https://riptutorial.com/django/example/17420/sqlite ).
- You must also make sure to set up your environment variables to match the `os.environ` calls in the settings. You will learn about some of those parameters in the tutorials above, and you can look [here]( https://hackernoon.com/how-to-use-environment-variables-keep-your-secret-keys-safe-secure-8b1a7877d69c).
- I recommend using a python virtual environment. I used [pipenv]( https://github.com/pypa/pipenv ). You can then use `pipenv shell` to start the virtual environment in the root folder and use `pipenv install` to automatically install all packages in the `pipfile`. 
- You will also need `npm`. run `npm install` from the root folder to install the node modules.
- Finally! You're ready! I recommend having two terminals open. One will run your django server from the folder `tutoroProject/tutoroProject` by running `python manage.py runserver`
- From the other terminal you will run from the root directory: `npm run dev`
- The site should be open on `localhost:8000`!