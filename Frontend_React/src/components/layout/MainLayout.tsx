import {
	DashboardOutlined,
	LoadingOutlined,
	LogoutOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Spin, theme } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authProvider";
import RoutesConfig from "../../routes/routes";


const { Header, Content } = Layout;

Spin.setDefaultIndicator(
	<div>
		<LoadingOutlined style={{ fontSize: 24 }} />
	</div>
);

const MainLayout = () => {
	const token = localStorage.getItem("token");

	const { user, handleLogout } = useAuth();

	const [updatePassword, setUpdatePassword] = useState<boolean>(false);

	const navigate = useNavigate();
	const location = useLocation();

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const menuItems = [
		{
			label: "Dashboard",
			icon: <DashboardOutlined />,
			onClick: () => navigate("/search-engine"),
			path: "/search-engine",
		},
		
		{
			label: "Logout",
			icon: <LogoutOutlined />,
			onClick: () => {
				handleLogout();
			},
		},
	].map((i, idx) => ({ key: idx, ...i }));

    const profileDropdownItems = [
			{
			label: "Logout",
			icon: <LogoutOutlined />,
			onClick: () => {
				handleLogout();
			},
		},
	].map((i, idx) => ({ key: idx, ...i }));

	const activeItem = menuItems.find(i => i.path === location.pathname)?.key;

	// login layout
	if (!token) {
		return (
			<Content className="w-full h-screen bg-gray-100">
				<RoutesConfig />
			</Content>
		);
	}

	// splash screen
	if (token ) {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<img
					src="/logo.png"
					className="select-none h-[4rem] animate-pulse"
				/>
			</div>
		);
	}

	return (
		<Layout className="min-h-screen">
			<Header className="flex items-center justify-between px-6">
				<img src="/assets/logo.png" className="select-none h-[5rem]" />

				{menuItems.length > 1 && (
					<Menu
						theme="dark"
						selectedKeys={[`${activeItem}`]}
						mode="horizontal"
						items={menuItems}
						style={{
							alignItems: "center",
							justifyContent: "center",
						}}
						className="w-1/3 select-none lg:w-9/12"
					/>
				)}

				<Dropdown
					overlayStyle={{ zIndex: 2300 }}
					menu={{
						items: profileDropdownItems,
					}}
					trigger={["click"]}
					placement="topRight"
				>
					<Button
						style={{
							verticalAlign: "middle",
						}}
						shape="round"
						icon={<UserOutlined />}
						className="ml-4 text-gray-300 bg-gray-600 border-gray-400 cursor-pointer hover:!bg-gray-800/90"
					>
						{user.name && (
							<p className="hidden md:max-w-[6rem] truncate md:block">
								{user.name}
							</p>
						)}
					</Button>
				</Dropdown>
			</Header>

			<Layout
				style={{
					padding: "0 24px 24px",
				}}
			>
				<Content
					style={{
						marginTop: 20,
						padding: 24,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}
					className="drop-shadow-md"
				>
					<RoutesConfig />
				</Content>
			</Layout>

		</Layout>
	);
};

export default MainLayout;
