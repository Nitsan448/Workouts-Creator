const express = require("express");
const { checkIfRowCanBeManipulated } = require("../helpers/validation");
const Routine = require("../models/routine");
// const { validateNameIsNotEmpty, validateWorkoutPost, validate } = require("../middleware/validation");
const fileHelper = require("../helpers/file");

const router = express.Router();

router.post("/", async (req, res, next) => {
	const image = req.files.length === 0 ? null : req.files[0].path;
	const routine = getRoutineFromRequest(req, image);
	try {
		await Routine.addRoutine(routine);
		res.status(201).json("Routine added");
	} catch (error) {
		console.log(error.message);
		res.status(500).json("Could not create Routine");
	}
});

function getRoutineFromRequest(req, image) {
	return {
		userId: req.userId,
		name: req.body.name,
		description: req.body.description,
		image: image,
		workoutId: req.body.workout_id,
		sets: req.body.sets,
		timeOrRepetitions: req.body.time_or_repetitions !== undefined && req.body.time_or_repetitions ? 1 : 0,
		setTime: req.body.set_time === undefined ? 0 : req.body.set_time,
		repetitions: req.body.repetitions === undefined ? 0 : req.body.repetitions,
		restTime: req.body.rest_time,
		breakAfterRoutine: req.body.break_after_routine,
		orderInWorkout: req.body.order_in_workout,
	};
}

router.patch("/", async (req, res, next) => {
	try {
		const [oldRoutine] = await Routine.findByWorkoutIdAndOrderInWorkout(
			req.body.workout_id,
			req.body.order_in_workout
		);

		let image;
		if (req.files.length === 0) {
			image = oldRoutine[0].image;
		} else if (oldRoutine[0].image) {
			fileHelper.deleteFile(oldRoutine[0].image);
			image = req.files[0].path;
		} else {
			image = req.files[0].path;
		}
		const routine = getRoutineFromRequest(req, image);

		await Routine.updateRoutine(routine);
		res.status(201).json("Routine edited");
	} catch (error) {
		console.log(error.message);
		res.status(500).json("Could not edited Routine");
	}
});

router.delete("/:workoutId/:orderInWorkout", async (req, res, next) => {
	try {
		const [routine] = await Routine.findByWorkoutIdAndOrderInWorkout(
			req.params.workoutId,
			req.params.orderInWorkout
		);
		checkIfRowCanBeManipulated(routine, req.userId);

		if (routine[0].image) {
			fileHelper.deleteFile(routine[0].image);
		}

		await Routine.deleteRoutine(req.params.workoutId, req.params.orderInWorkout, req.userId);
		res.status(200).json("Routine deleted");
	} catch (error) {
		console.log(error.message);
		res.status(500).json("Could not delete routine");
	}
});

module.exports = router;
