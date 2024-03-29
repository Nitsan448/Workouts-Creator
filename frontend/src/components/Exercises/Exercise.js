import React, { useState } from "react";
import classes from "./Exercise.module.css";
import { getTimeInTimerFormat } from "../../helpers/time";
import { useDeleteRoutineMutation, useUpdateRoutineMutation } from "../../store/apiSlice";
import ExerciseForm from "./ExerciseForm";
import { Draggable } from "react-beautiful-dnd";
import Image from "../UI/Image";
import { useDispatch } from "react-redux";
import { showErrorModal } from "../../store/uiSlice";

function Exercise(props) {
	const dispatch = useDispatch();
	const [editingExercise, setEditingExercise] = useState(false);
	const [deleteRoutine] = useDeleteRoutineMutation();
	const [updateRoutine] = useUpdateRoutineMutation();

	const image = props.image ? `${props.image}` : "";

	async function deleteExerciseHandler() {
		setEditingExercise(false);
		try {
			props.setNumberOfExerciseFormsOpen((numberOfExerciseFormsOpen) => numberOfExerciseFormsOpen - 1);
			await deleteRoutine({ workout_id: props.workoutId, order_in_workout: props.orderInWorkout }).unwrap();
		} catch (error) {
			dispatch(showErrorModal(error.data));
		}
	}

	async function editExerciseHandler(routine) {
		const routineData = new FormData();
		for (var key in routine) {
			routineData.append(key, routine[key]);
		}

		try {
			await updateRoutine(routineData).unwrap();
			toggleExerciseFormOpenState(false);
		} catch (error) {
			dispatch(showErrorModal(error.data));
		}
	}

	function toggleExerciseFormOpenState(startEditing) {
		if (startEditing) {
			setEditingExercise(true);
			props.setNumberOfExerciseFormsOpen((numberOfExerciseFormsOpen) => numberOfExerciseFormsOpen + 1);
		} else {
			setEditingExercise(false);
			props.setNumberOfExerciseFormsOpen((numberOfExerciseFormsOpen) => numberOfExerciseFormsOpen - 1);
		}
	}

	function renderExercise() {
		const exerciseClass = !props.inEditMode ? `${classes.exercise} ${classes.notInButton}` : classes.exercise;
		return props.inEditMode ? (
			<button className={classes.exercise__button} onClick={() => toggleExerciseFormOpenState(true)}>
				{
					<Draggable draggableId={props.routineId.toString()} index={props.orderInWorkout}>
						{(provided) => (
							<div
								className={exerciseClass}
								ref={provided.innerRef}
								{...provided.draggableProps}
								{...provided.dragHandleProps}>
								{renderExerciseInformation()}
							</div>
						)}
					</Draggable>
				}
			</button>
		) : (
			<div className={exerciseClass}>{renderExerciseInformation()}</div>
		);
	}

	function renderExerciseInformation() {
		return (
			<>
				<Image image={image} alt={props.name} borderRight allowImageChange={false} exerciseImage />
				<div className={classes.exerciseInformation}>
					<h3 className={classes.exercise__name}>{props.name}</h3>
					<p className={classes.exercise__Description}>{props.description}</p>
					<div className={classes.routine}>
						{props.sets > 1 ? <h3>{props.sets} Sets</h3> : <h3>{props.sets} Set</h3>}
						<h3>Rest time: {getTimeInTimerFormat(props.restTime)} </h3>
						{props.usingTimer ? (
							<h3>Set Time: {getTimeInTimerFormat(props.setTime)}</h3>
						) : (
							<h3>Repetitions: {props.repetitions}</h3>
						)}
						<h3>Break after exercise: {getTimeInTimerFormat(props.breakAfterExercise)}</h3>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			{editingExercise && props.inEditMode ? (
				<Draggable
					draggableId={props.orderInWorkout.toString()}
					index={props.orderInWorkout}
					isDragDisabled={true}>
					{(provided) => (
						<div ref={provided.innerRef} {...provided.draggableProps}>
							<ExerciseForm
								saveExerciseHandler={editExerciseHandler}
								deleteExerciseHandler={deleteExerciseHandler}
								cancelEditHandler={() => toggleExerciseFormOpenState(false)}
								exerciseImage={image}
								{...props}
							/>
						</div>
					)}
				</Draggable>
			) : (
				renderExercise()
			)}
		</>
	);
}

export default Exercise;
