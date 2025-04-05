import { Navigate, Route, Routes } from "react-router-dom";
import SearchEngine from "../pages/SearchEngine";
import Login from "../pages/authPages/Login";
import SearchEngineUpload from "../pages/SearchEngineUpload";

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
			<Route path="*" element={<Navigate to="/search-engine" replace />} />

			<Route path="/" element={<Navigate to="/search-engine" replace />} />

			<Route path="/search-engine" element={<SearchEngine />} />

			<Route path="/search-engine/upload" element={<SearchEngineUpload />} />
		</Routes>
	);
};

export default RoutesConfig;
