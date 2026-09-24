const database = require("../database");
module.exports = class Routine {
	static findByWorkoutIdAndOrderInWorkout(workoutId, orderInWorkout) {
		const query =
			"SELECT * FROM exercises INNER JOIN routines on routines.exercise_id = exercises.exercise_id WHERE routines.workout_id = $1 AND routines.order_in_workout = $2";
		return database.query(query, [workoutId, orderInWorkout]);
	}

	// Reuses the user's existing exercise with the same name, so its image is stored only once.
	static addRoutine(routine) {
		return database.transaction(async (client) => {
			const existingExercise = await client.query(
				"SELECT exercise_id FROM exercises WHERE user_id = $1 AND name = $2",
				[routine.userId, routine.name]
			);
			const exercise =
				existingExercise.rows[0] ??
				(
					await client.query(
						"INSERT INTO exercises (user_id, name, description, image) VALUES ($1, $2, $3, $4) RETURNING exercise_id",
						[routine.userId, routine.name, routine.description, routine.image]
					)
				).rows[0];

			await client.query(
				`INSERT INTO routines (workout_id, exercise_id, sets, time_or_repetitions, set_time,
					repetitions, rest_time, break_after_routine, order_in_workout)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
				[
					routine.workoutId,
					exercise.exercise_id,
					routine.sets,
					routine.timeOrRepetitions,
					routine.setTime,
					routine.repetitions,
					routine.restTime,
					routine.breakAfterRoutine,
					routine.orderInWorkout,
				]
			);
		});
	}

	static updateRoutine(routine) {
		return database.transaction(async (client) => {
			await client.query(
				`UPDATE exercises SET name = $1, description = $2, image = $3
				WHERE user_id = $4 AND exercise_id = (
					SELECT exercise_id FROM routines WHERE workout_id = $5 AND order_in_workout = $6)`,
				[routine.name, routine.description, routine.image, routine.userId, routine.workoutId, routine.orderInWorkout]
			);
			await client.query(
				`UPDATE routines SET sets = $1, time_or_repetitions = $2, set_time = $3, repetitions = $4,
					rest_time = $5, break_after_routine = $6
				WHERE workout_id = $7 AND order_in_workout = $8`,
				[
					routine.sets,
					routine.timeOrRepetitions,
					routine.setTime,
					routine.repetitions,
					routine.restTime,
					routine.breakAfterRoutine,
					routine.workoutId,
					routine.orderInWorkout,
				]
			);
		});
	}

	static deleteRoutine(workoutId, orderInWorkout) {
		return database.transaction(async (client) => {
			const deletedRoutines = await client.query(
				"DELETE FROM routines WHERE workout_id = $1 AND order_in_workout = $2 RETURNING exercise_id",
				[workoutId, orderInWorkout]
			);
			await Routine.deleteOrphanExercises(
				client,
				deletedRoutines.rows.map((routine) => routine.exercise_id)
			);
			await client.query(
				"UPDATE routines SET order_in_workout = order_in_workout - 1 WHERE workout_id = $1 AND order_in_workout > $2",
				[workoutId, orderInWorkout]
			);
		});
	}

	static deleteOrphanExercises(client, exerciseIds) {
		return client.query(
			`DELETE FROM exercises WHERE exercise_id = ANY($1)
			AND NOT EXISTS (SELECT 1 FROM routines WHERE routines.exercise_id = exercises.exercise_id)`,
			[exerciseIds]
		);
	}
};
