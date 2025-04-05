import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type USER = {
    id: string; 
    name: string;
    email: string;
    role: string[];
}

interface AuthProviderContextType {
	user: USER;
	setUserDetails: (userDetails: USER) => void;
	handleLogout: () => void;
	loading: boolean;
	fetchUserDetails: () => void;
	setIsVisibleLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
	isVisibleLogoutModal: boolean;
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(
	undefined
);

export const useAuth = () => {
	const context = useContext(AuthProviderContext);
	if (!context) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem("token");

	const [loading, setLoading] = useState<boolean>(false);
	const [userDetails, setUserDetails] = useState<USER | null>(null);
	const [isVisibleLogoutModal, setIsVisibleLogoutModal]= useState<boolean>(false)

	const navigate = useNavigate();

	const fetchUserDetails = async () => {
		setLoading(true);

		try {
			//const { data } = await USER_SERVICES.getCurrentUserDetails();

			// if (!data || data.roles?.length === 0) {
			// 	throw new Error("No data found for this user");
			// }

			// setUserDetails(data);
		} catch (error) {
			console.log("Unable to fetch userDetails", error);
			handleLogout();
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token && !userDetails?.role) {
			fetchUserDetails();
		}
	}, [token]);

	const handleLogout = () => {
		localStorage.clear();
		setUserDetails(null);
		navigate("/login", { replace: true });
		setIsVisibleLogoutModal(false);
	};

	return (
		<AuthProviderContext.Provider
			value={{
				user: userDetails || ({} as USER),
				setUserDetails,
				handleLogout,
				loading,
				fetchUserDetails,
				setIsVisibleLogoutModal,
				isVisibleLogoutModal,
			}}
		>
			{children}
		</AuthProviderContext.Provider>
	);
};
