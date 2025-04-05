import { Navigate, Route, Routes } from "react-router-dom";
import SearchEngine from "../pages/SearchEngine";
import Login from "../pages/authPages/Login";

const RoutesConfig = () => {
	const token = localStorage.getItem("token");

	if (!token) {
		return (
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		);
	}

	window.scroll({ behavior: "smooth", top: 0 });

	return (
		<Routes>
			<Route path="*" element={<Navigate to="/" replace />} />

			<Route path="/" element={<SearchEngine />} />

			<Route path="/search-engine" element={<SearchEngine />} />
		</Routes>
	);
};

export default RoutesConfig;
