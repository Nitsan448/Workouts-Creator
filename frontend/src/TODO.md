## Frontend

1. Loading component

2. Pause timer when an exercise uses repetitions

### CSS

1. playWorkout page - Add border to image when in break

2. Move filter and name a bit down in workouts and increase each workout height

## Backend

## Bugs

1. Guest users are never cleaned up, and the cleanup can crash the backend.
   Guests are deleted by a 24 hour setTimeout in routes/auth.js (register):
   - The timer lives in memory, so any server restart within those 24 hours drops it and the guest stays forever.
   - If the guest created any workout or exercise, the DELETE fails on the foreign keys (no ON DELETE CASCADE).
   - That error is thrown inside the async timer callback with nothing catching it, so the unhandled rejection kills the Node process.
   Fix idea: mark guest users (is_guest + created_at) and delete them and their data in one periodic cleanup (or cascade the foreign keys).

2. Exercise images are deleted too early or never.
   - DELETE /routines deletes the exercise's image file even when the exercise is still used by another workout, so the image breaks there.
   - Deleting a workout (or a guest user) deletes only the workout image; images of exercises removed with it stay on disk forever.
   Fix idea: delete an exercise's image only when the exercise row itself is deleted.

3. Missing ownership checks.
   PATCH /routines and POST /workouts/update_routines_order don't call checkIfRowCanBeManipulated,
   so any logged in user can edit or reorder routines in another user's workout by sending its workout_id.
   GET /workouts/:workoutId has the same gap for reading.

4. Break screen in play mode shows placeholder text (PlayingWorkout.js, "Next:" section):
   "{sets} sets of 5 minutes" is hardcoded instead of the next exercise's real set time / repetitions,
   and the description is the literal string "dsa" instead of the exercise description.

## Other

1. Readme file - Add Gif and how to run section.

2. Add an example workout for all new users in the my workouts page.

### Refactoring

# Backlog

### Frontend

1. Add remember me field in sign up

2. Changing an exercise name changes the name of other exercises with the same name (make it create a new exercise)

3. Add sound effect when current activity finished

4. Add prefetching on hovers, etc.

#### CSS

1. Improve mobile querys

2. Add animations

3. Make container margin in width and height the same

4. Make sliders prettier

5. Add icons to editing workout footer buttons

### Backend

1. Remove loop from delete_routine and delete_workout stored procedures

2. Require auth when user enters a page

3. Add tests

4. Add more validations (workout name and description length, etc.)

5. Change CheckIfRowCanBeManipulated method to a better name and use user token instead of id.

### Bugs

### Other

1. Add social media features

2. Add option to choose from current exercises and routines when creating a new exercise.
   Make it impossible to change an exercise name to an already existing exercise.

3. Switch to cloudfront for accessing images from s3 and make them private

4. Setup Deploying through git hub for backend
