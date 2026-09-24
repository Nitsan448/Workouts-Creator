import useTimer from "../../hooks/use-timer";
import { getTimeInMinutesAndSeconds, getTimeInTimerFormat } from "../../helpers/time";
import { useCallback, useState, useEffect, Fragment } from "react";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import classes from "./PlayingWorkout.module.css";
import Image from "../UI/Image";
import { useMediaQuery } from "react-responsive";

const Activity = {
	InSet: "InSet",
	Resting: "Resting",
	Break: "Break",
};

function PlayingWorkout(props) {
	const navigate = useNavigate();
	const exercises = props.workout.routines;
	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

	const [currentSet, setCurrentSet] = useState(1);
	const [currentActivity, setCurrentActivity] = useState(Activity.InSet);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [workoutFinished, setWorkoutFinished] = useState(false);

	const currentExercise = exercises[currentExerciseIndex];
	const usingTimer = currentExercise.time_or_repetitions;
	const lastSet = currentSet === +currentExercise.sets;

	const getNewTimerTime = useCallback(() => {
		if (currentActivity === Activity.InSet) {
			return getTimeInMinutesAndSeconds(currentExercise.set_time);
		} else if (currentActivity === Activity.Resting) {
			return getTimeInMinutesAndSeconds(currentExercise.rest_time);
		} else {
			return getTimeInMinutesAndSeconds(currentExercise.break_after_routine);
		}
	}, [currentActivity, currentExercise]);

	const initialTimerTime = getNewTimerTime();
	const timer = useTimer(initialTimerTime, activityFinishedHandler, !usingTimer);

	useEffect(() => {
		function setNewTimerTime() {
			const newTimerTime = getNewTimerTime();
			timer.setTime(newTimerTime);
		}
		setNewTimerTime();
		//TODO: pause timer if the exercise uses repetitions
	}, [getNewTimerTime, currentSet]); // eslint-disable-line react-hooks/exhaustive-deps

	function activityFinishedHandler() {
		const exerciseFinished = currentActivity !== Activity.Resting && lastSet;

		const goToBreak =
			exerciseFinished && currentActivity !== Activity.Break && currentExercise.break_after_routine > 0;

		if (goToBreak) {
			setCurrentActivity(Activity.Break);
		} else if (exerciseFinished) {
			finishExercise();
		} else {
			updateCurrentSetState();
		}
	}

	function finishExercise() {
		if (currentActivity !== Activity.Break && currentExercise.break_after_routine > 0) {
			setCurrentActivity(Activity.Break);
		} else if (currentExerciseIndex < exercises.length - 1) {
			goToNextExercise();
		} else {
			setWorkoutFinished(true);
		}
	}

	function goToNextExercise() {
		setCurrentExerciseIndex(currentExerciseIndex + 1);
		setCurrentSet(1);
		setCurrentActivity(Activity.InSet);
	}

	function goToPreviousExercise() {
		if (currentActivity === Activity.Break) {
			setCurrentActivity(Activity.InSet);
			setCurrentSet(1);
		} else if (currentExerciseIndex !== 0) {
			setCurrentExerciseIndex(currentExerciseIndex - 1);
			setCurrentSet(1);
			setCurrentActivity(Activity.InSet);
		}
	}

	function updateCurrentSetState() {
		if (currentActivity === Activity.InSet && currentExercise.rest_time > 0) {
			setCurrentActivity(Activity.Resting);
		} else if (currentActivity === Activity.InSet && currentExercise.rest_time === 0) {
			setCurrentSet(currentSet + 1);
		} else {
			setCurrentActivity(Activity.InSet);
			setCurrentSet(currentSet + 1);
		}
	}

	function setSwitchHandler(change) {
		const newSet = currentSet + change;
		const isValidSet = newSet <= currentExercise.sets && newSet > 0;

		if (isValidSet) {
			setCurrentSet(newSet);
		}
	}

	let itemsShown = 0;
	const maxItemsShown = isTabletOrMobile ? 1 : 3;

	function getNextExerciseAndBreaks(routine, index) {
		const showExercise = index > currentExerciseIndex;
		if (showExercise) {
			itemsShown++;
		}

		const currentBreak = currentActivity === Activity.Break && index === currentExerciseIndex;
		const showBreak = routine.break_after_routine > 0 && itemsShown < maxItemsShown && !currentBreak;
		if (showBreak) {
			itemsShown++;
		}

		const showWellDone = itemsShown < maxItemsShown && index === exercises.length - 1;

		return (
			<Fragment key={index}>
				{showExercise && (
					<div className={classes.upNext__exercise}>
						<Image image={routine.image} borderRight exerciseImage />
						<div>
							<p className={classes.upNext__name}>{routine.name}</p>
							<p className={classes.upNext__timeOrSets}>{routine.sets} sets</p>
						</div>
					</div>
				)}
				{showBreak && (
					<div className={classes.upNext__break}>
						<p className={classes.upNext__name}>Break</p>
						<p className={classes.upNext__timeOrSets}>
							{getTimeInTimerFormat(routine.break_after_routine)}
						</p>
					</div>
				)}
				{showWellDone && (
					<div className={classes.upNext__wellDone}>
						<p className={classes.upNext__wellDoneTitle}>Well done!</p>
					</div>
				)}
			</Fragment>
		);
	}

	function renderPlayingExercise() {
		return (
			<div className={classes.playingExercise}>
				{/* <div className={classes.playingExercise__image}> */}
				<Image borderRight image={currentExercise.image} exerciseImage={true} />
				{/* </div> */}

				{renderExerciseInformation()}

				{renderExerciseState()}
			</div>
		);
	}

	function renderExerciseInformation() {
		const activityText = currentActivity === Activity.InSet ? getCurrentSetText() : "Resting";

		return (
			<div className={classes.playingExercise__exerciseInformation}>
				<h1 className={classes.playingExercise__exerciseName}>
					{currentExercise.name} / {activityText}
				</h1>
				{currentExercise.rest_time > 0 && (
					<h3 className={classes.playingExercise__exerciseBreakBetweenSets}>
						Rest between sets: {getTimeInTimerFormat(currentExercise.rest_time)}min
					</h3>
				)}
				{!isTabletOrMobile && (
					<p className={classes.playingExercise__exerciseDescription}>{currentExercise.description}</p>
				)}
			</div>
		);
	}

	function renderExerciseState() {
		return (
			<div className={classes.playingExercise__exerciseState}>
				{usingTimer ? (
					<h1 className={classes.playingExercise__timer}>
						{timer.minutes}:{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
					</h1>
				) : (
					<h1 className={classes.playingExercise__timer}>{props.repetitions}Reps</h1>
				)}
				<div className={classes.playingExercise__sets}>
					<button className={classes.previousSet} onClick={() => setSwitchHandler(-1)} />
					<p>
						Set {currentSet}/{currentExercise.sets}
					</p>
					<button className={classes.nextSet} onClick={() => setSwitchHandler(1)} />
				</div>

				<div className={classes.nextButton}>
					<Button color="orange" text="Next" onClick={activityFinishedHandler} />
				</div>
			</div>
		);
	}

	function renderBreak() {
		const nextExercise = exercises[currentExerciseIndex + 1];
		return (
			<div className={classes.break}>
				<div className={classes.break__breakInformation}>
					<h1 className={classes.breakTitle}>Break</h1>
					<h1 className={classes.breakTimer}>
						{timer.minutes}:{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
					</h1>

					<div className={classes.break__nextButton}>
						<Button color="orange" text="Skip" onClick={activityFinishedHandler} />
					</div>
				</div>
				{currentExerciseIndex + 1 < exercises.length && !isTabletOrMobile && (
					<Image exerciseImage image={nextExercise.image}>
						<h2 className={classes.nextExerciseName}>Next: {nextExercise.name}</h2>
						<p className={classes.nextExerciseSets}>{nextExercise.sets} sets of 5 minutes</p>
						<p className={classes.nextExerciseDescription}>dsa</p>
					</Image>
				)}
			</div>
		);
	}

	function getCurrentSetText() {
		const suffix = currentSet === 1 ? "st" : currentSet === 2 ? "nd" : "rd";
		return `${currentSet}${suffix} set`;
	}

	const toggleTimerStateClass = timer.paused ? classes.playTimer : classes.pauseTimer;

	return (
		<>
			{workoutFinished ? (
				<div className={classes.workoutFinished}>
					<div>
						<h1 className={classes.workoutFinished__title}>Well done!</h1>
						{/* <p>see you next time :)</p> */}
					</div>
					<div className={classes.workoutFinished__backToHomePageButton}>
						<Button color="orange" onClick={() => navigate("/workouts")} text="Back to home page" />
					</div>
				</div>
			) : (
				<div id="playingWorkout" className={classes.mainContainer}>
					{currentActivity === Activity.Break
						? renderBreak()
						: renderPlayingExercise(currentExerciseIndex, true)}

					{/* TODO: change utility class name */}
					<div className={classes.utility}>
						{isTabletOrMobile ? (
							<>
								<div className={classes.utilityButtons}>
									<button
										className={classes.previousExercise}
										onClick={goToPreviousExercise}></button>

									<button className={classes.nextExercise} onClick={finishExercise}></button>
								</div>

								<button
									className={toggleTimerStateClass}
									onClick={() => {
										timer.togglePausedState();
									}}></button>
							</>
						) : (
							<div className={classes.utilityButtons}>
								<button className={classes.previousExercise} onClick={goToPreviousExercise}></button>

								<button
									className={toggleTimerStateClass}
									onClick={() => {
										timer.togglePausedState();
									}}></button>
								<button className={classes.nextExercise} onClick={finishExercise}></button>
							</div>
						)}
						<div className={classes.upNext}>
							<p className={classes.upNext__title}>Up next:</p>
							{exercises.map(
								(routine, index) =>
									index >= currentExerciseIndex &&
									itemsShown < maxItemsShown &&
									getNextExerciseAndBreaks(routine, index)
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default PlayingWorkout;
