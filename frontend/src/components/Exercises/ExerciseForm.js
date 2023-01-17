import React, { useState, useEffect } from "react";
import classes from "./ExerciseForm.module.css";
import { isPositiveNumber } from "../../helpers/helpers";
import { useForm } from "react-hook-form";
import { getTimeInSeconds, getTimeInTimerFormat } from "../../helpers/time";
import { useDeleteRoutineMutation } from "../../store/apiSlice";

function ExerciseForm(props) {
	const [image, setImage] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	function onImageUpload(event) {
		setImage(...event.target.files);
	}

	useEffect(() => {
		if (image) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image]);

	const [deleteRoutine] = useDeleteRoutineMutation();

	async function onDeleteClicked() {
		try {
			await deleteRoutine({ workout_id: props.workoutId, order_in_workout: props.orderInWorkout }).unwrap();
		} catch (error) {
			console.log(error.message);
		}
	}

	function validateTimeInput(value) {
		if (value.split(":").length !== 2) {
			return false;
		}
		const [minutes, seconds] = value.split(":");
		return isPositiveNumber(minutes) && isPositiveNumber(seconds) && seconds < 60 && minutes < 60;
	}

	function saveRoutine(data) {
		const routine = {
			workout_id: +props.workoutId,
			name: data.name,
			description: data.description,
			sets: data.sets,
			time_or_repetitions: 1,
			set_time: getTimeInSeconds(data.setTime),
			repetitions: 10,
			rest_time: getTimeInSeconds(data.restTime),
			break_after_routine: getTimeInSeconds(data.breakAfterExercise),
			order_in_workout: props.orderInWorkout,
		};
		props.saveExerciseHandler(routine, reset);
	}

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm({
		defaultValues: {
			setTime: props.setTime ? getTimeInTimerFormat(props.setTime) : "00:00",
			repetitions: props.repetitions ? props.setTime : 10,
			restTime: props.restTime ? getTimeInTimerFormat(props.restTime) : "00:00",
			breakAfterExercise: props.breakAfterExercise ? getTimeInTimerFormat(props.breakAfterExercise) : "00:00",
			sets: props.sets ? props.sets : 1,
			name: props.name ? props.name : "",
			description: props.description ? props.description : "",
		},
	});

	return (
		<>
			<form className={classes.form} onSubmit={handleSubmit(async (data) => saveRoutine(data))}>
				<label htmlFor="image-upload" className={classes.form__image}>
					{!image && "Add image"}
					<input id="image-upload" type="file" onChange={onImageUpload} accept=".jpg, .jpeg, .png" />
					{image && <img src={imageUrl} alt="Exercise" width={"200"} height={"200"} />}
				</label>
				<div className={classes.form__exercise}>
					<input
						type="text"
						placeholder="Exercise name"
						className={errors.name ? "invalidInput" : ""}
						{...register("name", { required: true })}
					/>
					{errors.name && <p className={"invalidParagraph"}>Can not be empty</p>}
					<textarea placeholder="Description" {...register("description")} />
				</div>
				<div className={classes.form__routine}>
					<label htmlFor="sets">Number of sets:</label>
					<input
						type="number"
						className={errors.sets ? "invalidInput" : ""}
						{...register("sets", {
							required: true,
							min: 1,
						})}
					/>
					{errors.sets && <p className={"invalidParagraph"}>Must be larger than 0</p>}
				</div>
				<div className={classes.form__routine}>
					<label htmlFor="restTime">Break between sets:</label>
					<input
						type="text"
						className={errors.restTime ? "invalidInput" : ""}
						{...register("restTime", {
							required: true,
							validate: (value) => validateTimeInput(value),
						})}
					/>
					{errors.restTime && <p className={"invalidParagraph"}>Must be in xx:xx format</p>}
				</div>
				<div className={classes.form__repsOrSets}>
					<div className={classes.form__routine}>
						<label htmlFor="repetitions">Repetitions:</label>
						<input
							type="number"
							className={errors.repetitions ? "invalidInput" : ""}
							{...register("repetitions", {
								required: true,
								min: 1,
							})}
						/>
						{errors.repetitions && <p className={"invalidParagraph"}>Must be larger than 0</p>}
					</div>
					<div className={classes.form__orImage}></div>
					<div className={classes.form__routine}>
						<label htmlFor="setTime">Set time:</label>
						<input
							type="text"
							className={errors.setTime ? "invalidInput" : ""}
							{...register("setTime", {
								required: true,
								validate: (value) => validateTimeInput(value),
							})}
						/>
						{errors.setTime && <p className={"invalidParagraph"}>Must be in xx:xx format</p>}
					</div>
				</div>
				<div className={classes.form__routine}>
					<label htmlFor="setTime">Break after exercise:</label>
					<input
						type="text"
						className={errors.breakAfterExercise ? "invalidInput" : ""}
						{...register("breakAfterExercise", {
							required: true,
							validate: (value) => validateTimeInput(value),
						})}
					/>
					{errors.breakAfterExercise && <p className={"invalidParagraph"}>Must be in xx:xx format</p>}
				</div>
				<button className={classes.form__checkmark} />
				<button type="button" className={classes.form__deleteButton} onClick={props.deleteExerciseHandler} />
				<button type="button" className={classes.form__cancelButton} onClick={props.cancelEditHandler} />
			</form>
		</>
	);
}

export default ExerciseForm;