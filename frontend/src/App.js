import { Routes, Route, Navigate } from "react-router-dom";
import Workout from "./pages/Workout";
import Workouts from "./pages/Workouts";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NavigationHeader from "./components/Layout/NavigationHeader";
import ErrorModal from "./components/Modals/ErrorModal";
import Welcome from "./pages/Welcome";

function App() {
	return (
		<>
			<NavigationHeader />
			<ErrorModal />
			<main>
				<Routes>
					<Route path="/" element={<Navigate replace to="/welcome" />} />

					<Route path="/welcome" element={<Welcome />} />

					<Route path="/register" element={<Register />} />

					<Route path="/login" element={<Login />} />

					<Route path="/workouts" element={<Workouts />} />

					<Route path="/workouts/:workoutId" element={<Workout />} />

					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</>
	);
}

export default App;
