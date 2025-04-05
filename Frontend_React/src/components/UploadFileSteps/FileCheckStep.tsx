import { LoadingOutlined } from "@ant-design/icons";
import { Result } from "antd";

const FileCheckStep = () => {
	return (
		<Result
			icon={<LoadingOutlined />}
			title="File check ongoing..."
			subTitle="Wait while we are verifying your uploaded file."
		/>
	);
};

export default FileCheckStep;
