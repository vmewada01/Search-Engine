import { Button, Result } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { JSX } from "react";

export type excelImportError = {};

type ResultStepProps = {
	errorType: string;
	errors: excelImportError[];
	tryAgain: () => void;
	onDone: () => void;
	fileDetails: string[] | any[];
	showDetails?: boolean;
};

const ResultStep: React.FC<ResultStepProps> = ({
	errorType,
	tryAgain,
	errors,
	onDone,
	fileDetails,
}) => {
	const isSuccess = errorType === "success";
	const isPartial = errorType === "partial";
	const isFileError = errorType === "fileError";
	const hasErrors = errors?.length > 0;

	const getTitle = (): string => {
		if (isSuccess) return "File uploaded successfully";
		if (isPartial) return "Partial Import Successful";
		if (isFileError) return "Error in file";
		return "Uploading failed!";
	};

	const getSubtitle = (): string | JSX.Element | null => {
		if (isSuccess || isPartial) {
			if (fileDetails?.length === 0) return null;

			return (
				<span style={{ fontSize: "17px", fontWeight: 600 }}>
					{fileDetails?.filter(Boolean).join(" | ")}
				</span>
			);
		}
		if (isFileError) {
			return "There were some errors in your uploaded file. Please review the details below.";
		}

		return "Unable to upload the file right now. Please try again later.";
	};

	const columns: ColumnProps<excelImportError>[] = [
		{
			title: "Row",
			dataIndex: "row",
			key: "row",
			align: "center",
			width: 100,
			render: text => text || "-",
		},
		{
			title: "Column",
			dataIndex: "column",
			key: "column",
			align: "center",
			width: 100,
			render: text => text || "-",
		},
		{
			title: "Error message",
			dataIndex: "message",
			key: "message",
		},
	];

	return (
		<>
			<Result
				status={isSuccess ? "success" : isPartial ? "info" : "error"}
				title={getTitle()}
				subTitle={getSubtitle()}
				extra={
					<Button.Group>
						{!isSuccess && !isPartial && (
							<Button type="dashed" onClick={tryAgain}>
								Try Again
							</Button>
						)}
						{(isSuccess || isPartial) && (
							<Button type="primary" onClick={onDone}>
								Done
							</Button>
						)}
					</Button.Group>
				}
			/>

			{hasErrors && (
				<Table
					className="mt-4"
					columns={columns}
					dataSource={errors}
					bordered
					tableLayout="fixed"
					//@ts-ignore
					rowKey={(record, index) => index?.toString()}
					scroll={{ x: 1000 }}
				/>
			)}
		</>
	);
};

export default ResultStep;
