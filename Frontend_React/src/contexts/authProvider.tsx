import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type USER = {
	id: string;
	name: string;
	email: string;
	role: string[];
};

interface AuthProviderContextType {
	userRole: string;
	user: USER;
	setUserDetails: (userDetails: USER) => void;
	handleLogout: () => void;
	loading: boolean;
	fetchUserDetails: () => void;
	setIsVisibleLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
	isVisibleLogoutModal: boolean;
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined);

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
	const [isVisibleLogoutModal, setIsVisibleLogoutModal] = useState<boolean>(false);

	const navigate = useNavigate();

	const fetchUserDetails = async () => {
		setLoading(true);

		try {
			// Simulate a delay of 5 seconds
			setTimeout(() => {
				const dummyUser: USER = {
					id: "12345",
					name: "Vishal Mewada",
					email: "vishalmewada9826@gmail.com",
					role: ["admin"],
				};

				localStorage.setItem("token", "dummy_token_12345");
				setUserDetails(dummyUser);
				setLoading(false);
			}, 5000);
		} catch (error) {
			console.log("Unable to fetch userDetails", error);
			handleLogout();
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
				userRole: userDetails?.role?.[0] as string,
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
