import React, { useState } from "react";
import ExerciseForm from "./ExerciseForm";
import { useAddRoutineMutation } from "../../store/apiSlice";
import classes from "./NewExercise.module.css";

function NewExerciseForm(props) {
	const [isFormOpen, setIsFormOpen] = useState(false);

	const [addRoutine] = useAddRoutineMutation();

	async function addExerciseHandler(routine, resetForm) {
		const routineData = new FormData();
		for (var key in routine) {
			routineData.append(key, routine[key]);
		}

		try {
			await addRoutine(routineData);
			resetForm();
			setIsFormOpen(false);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			{isFormOpen ? (
				<ExerciseForm
					saveExerciseHandler={addExerciseHandler}
					cancelEditHandler={() => setIsFormOpen(false)}
					deleteExerciseHandler={() => setIsFormOpen(false)}
					{...props}
				/>
			) : (
				<button className={classes.newExerciseButton} onClick={() => setIsFormOpen(true)}>
					<div className={classes.newExerciseButton__addExercise}></div>
				</button>
			)}
		</div>
	);
}

export default NewExerciseForm;
