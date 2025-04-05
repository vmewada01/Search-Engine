import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BG from "../../assets/bg.avif";
import { useAuth } from "../../contexts/authProvider";


const { Text, Title } = Typography;

const Login = () => {
	const { setUserDetails } = useAuth();

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const navigate = useNavigate();

	const onFinish = async (values: { username: string; password: string }) => {
		values.password = btoa(values?.password);

		setIsSubmitting(true);

		try {
			// const res = await AUTH_SERVICES.login(values);

			// if (!res.data.token) {
			// 	showError(res);
			// 	return;
			// }

			// const { token, role, ...rest } = res?.data;

			// localStorage.setItem("token", token);
			// setUserDetails({ ...rest, roles: role });

			navigate("/", { replace: true });
		} catch (error) {
			// @ts-ignore
			showError(error, "Invalid credentials!");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			style={{
				backgroundImage: `url(${BG})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
			className="flex items-center justify-center h-full px-6 md:px-0 bg-red-500"
		>
			<Card className="w-full md:w-[25rem] drop-shadow-md text-center">
				<div className="flex items-center justify-center w-full my-4">
					<img src="/company_logo.png" alt="logo" className="size-10" />
				</div>

				<Title className="!text-3xl">Login</Title>

				<Text>
					Welcome to Search Engine tool! Enter the given details to login.
				</Text>

				<Form onFinish={onFinish} layout="vertical" className="mt-6 text-start">
					<Form.Item
						name="username"
						rules={[
							{
								required: true,
								validator: (_, value) => {
									if (!value) {
										return Promise.reject("Enter username");
									}
									if (value.trim().length === 0) {
										return Promise.reject("Enter a valid username");
									}
									if (value.trim().length < 3) {
										return Promise.reject("Min 3 characters required");
									}
									if (value.includes(" ")) {
										return Promise.reject("Spaces are not allowed");
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input
							autoFocus
							size="large"
							prefix={<UserOutlined className="pr-1" />}
							placeholder="Username"
						/>
					</Form.Item>

					<Divider className="invisible !my-1" />

					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: "Enter your password",
							},
							{
								min: 8,
								message: "Password must be at least 8 characters long",
							},
							{ max: 15, message: "Password must not exceed 20 characters." },
						]}
					>
						<Input.Password
							size="large"
							prefix={<LockOutlined className="pr-1" />}
							type="password"
							placeholder="Password"
						/>
					</Form.Item>

					<Button
						htmlType="submit"
						type="primary"
						size="large"
						className="mt-1.5"
						loading={isSubmitting}
						block
					>
						Login
					</Button>
				</Form>
			</Card>

		</section>
	);
};

export default Login;
