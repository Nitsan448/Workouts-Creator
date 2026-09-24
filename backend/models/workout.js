const database = require("../database");
const Routine = require("./routine");

module.exports = class Workout {
	static findById(workoutId) {
		const query = "SELECT * FROM workouts WHERE workout_id = $1";
		return database.query(query, [workoutId]);
	}

	static findByName(workoutName) {
		const query = "SELECT * FROM workouts WHERE name = $1";
		return database.query(query, [workoutName]);
	}

	static getWorkouts(userId) {
		const query = "SELECT * FROM workouts WHERE user_id = $1";
		return database.query(query, [userId]);
	}

	static addWorkout(workout) {
		const query =
			"INSERT INTO workouts (name, description, user_id, image) VALUES ($1, $2, $3, $4) RETURNING workout_id";
		return database.query(query, [workout.name, workout.description, workout.userId, workout.image]);
	}

	static deleteWorkout(workoutId) {
		return database.transaction(async (client) => {
			const deletedRoutines = await client.query(
				"DELETE FROM routines WHERE workout_id = $1 RETURNING exercise_id",
				[workoutId]
			);
			await Routine.deleteOrphanExercises(
				client,
				deletedRoutines.rows.map((routine) => routine.exercise_id)
			);
			await client.query("DELETE FROM workouts WHERE workout_id = $1", [workoutId]);
		});
	}

	static updateWorkout(workout) {
		const query = "UPDATE workouts SET name=$1, description=$2, image=$3 WHERE workout_id=$4";
		return database.query(query, [workout.name, workout.description, workout.image, workout.workoutId]);
	}

	static updateRoutinesOrder(workoutId, oldRoutineIndex, newRoutineIndex) {
		const query = `UPDATE routines SET order_in_workout = CASE
				WHEN order_in_workout = $2::int THEN $3::int
				WHEN $2::int < $3::int THEN order_in_workout - 1
				ELSE order_in_workout + 1
			END
			WHERE workout_id = $1 AND order_in_workout BETWEEN LEAST($2::int, $3::int) AND GREATEST($2::int, $3::int)`;
		return database.query(query, [workoutId, oldRoutineIndex, newRoutineIndex]);
	}

	static getRoutines(workoutId) {
		const query =
			"SELECT * FROM routines INNER JOIN exercises ON routines.exercise_id=exercises.exercise_id WHERE workout_id=$1 ORDER BY order_in_workout";
		return database.query(query, [workoutId]);
	}
};
