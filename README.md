# Workouts-Creator

## Important Note:

This is an old project, there are things I would do differently if I were to do it today.

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Overview

![Screenshot 2023-03-09 204055](https://user-images.githubusercontent.com/51084989/224123814-ab632d2a-43e7-4242-837d-38362820964e.jpg)


**A web application where users can easily create highly customizable workouts, edit, and play them.**

#### Frontend

The Frontend uses redux and rtk querys to send requests to the backend, handle and cache the response data.

#### Backend

The backend is a REST API designed in the following way: <br /> 
Models send querys to the database. <br />
Routes parse requests, use the models to interact with the database, and return a response. <br /> 

The database structure is the following:

| users         | workouts       | exercises   |  routines  |
|:-------------:|:--------------:|:-----------:|:----------:|
| user_id       | workout_id     | exercise_id | routine_id
| user_name     | user_id        | user_id     | exercise_id
| password      | name           | name        | workout_id
|               | description    | description | sets
|               | image          | image       | time_or_repetitions
|               |                |             | set_time
|               |                |             | repetitions
|               |                |             | rest_time
|               |                |             | break_after_routine
|               |                |             | order_in_workout

Exercise information is split into two parts: <br />
Exercise data - constant data that remains the same whenever the exercise appears <br /> 
Routine data - dynammic data that may be different every time the exercise appears.

The database is structured this way to avoid data duplication - when the user uses the same exercise a few times in different workouts, <br />
but with a different number of sets and repetitions in each one,<br /> some of it's data (and specifically the image) is only saved once.

![Screenshot 2023-03-06 151936](https://user-images.githubusercontent.com/51084989/223122694-f282fc12-3d88-48b7-a1e3-d03a4e8b7c38.jpg)

<!-- TODO: Add a screenshot of the live project. --> 

### Built With

#### Frontend

Javascript 1.5, React 18.2, CSS3.

Main libraries used: <br /> 
react-router-dom 6.4, react-redux 8.0, react-hook-form 7.41, react-beautiful-dnd 13.1

#### Backend

Javascript 1.5, Node.js 16.15, MySQL 8.0.

Main libraries used: <br /> 
express 4.18, aws-sdk 2.1309, multer 1.4, mysql2 2.3

#### Deployment

AWS amplify (frontend), elastic beanstalk (backend), RDS (MySQL database) and S3 buckets (For saving uploaded images).

I previously used AWS's free tier to deploy the website for free for the one year.
I have decided to take it down after that year due to the costs being too high.

## Features

* User system, each user has his own workouts and exercises.
* Workout creation system allowing users to easily create, edit and play custom workouts.
* Drag and drop functionality for rearanging exercises within a workout.
* Image uploading.
* A Timer to automatically switch between sets, exercises and rest periods when playing a workout, <br />
and additional options for the user, such as finishing a set/exercise and pausing the timer.

#### Vision

* Social media features: Sharing workouts, workouts feed, favorite workouts from other users, etc.

## Contact

[LinkedIn](https://www.linkedin.com/in/nitsan-caduri/)

nitsan447@gmail.com

## Acknowledgements

Completing the following courses greatly improved my understanding and knowledge of the tools used in this project:

https://www.youtube.com/watch?v=OXGznpKZ_sA&ab_channel=freeCodeCamp.org

https://www.udemy.com/course/nodejs-the-complete-guide/

https://www.udemy.com/course/react-the-complete-guide-incl-redux/
