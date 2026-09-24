-- citext keeps user names and emails case-insensitive, as they were under MySQL's default collation.
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
	user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_name CITEXT NOT NULL,
	email CITEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
);

CREATE TABLE workouts (
	workout_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users (user_id),
	name TEXT NOT NULL,
	description TEXT,
	image TEXT,
	UNIQUE (name, user_id)
);

CREATE TABLE exercises (
	exercise_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users (user_id),
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	image TEXT
);

CREATE TABLE routines (
	routine_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	workout_id INT NOT NULL REFERENCES workouts (workout_id),
	exercise_id INT NOT NULL REFERENCES exercises (exercise_id),
	sets INT NOT NULL,
	time_or_repetitions BOOLEAN NOT NULL DEFAULT false,
	set_time INT,
	repetitions INT,
	rest_time INT NOT NULL DEFAULT 0,
	break_after_routine INT,
	order_in_workout INT NOT NULL,
	-- Deferred so reordering can shift many rows in one UPDATE; Postgres otherwise checks uniqueness row by row.
	UNIQUE (workout_id, order_in_workout) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX ON workouts (user_id);
CREATE INDEX ON exercises (user_id);
CREATE INDEX ON routines (exercise_id);
