import React, { useRef, useState } from "react";
import UploadFile from "../components/UploadFileSteps/UploadFile";
import {
  CloudUploadOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import FileCheckStep from "../components/UploadFileSteps/FileCheckStep";
import ResultStep from "../components/UploadFileSteps/ResultStep";
import { Form, Steps } from "antd";
import { useForm, useWatch } from "antd/es/form/Form";
import { SEARCH_SERVICE } from "../api/services/searchService";

const SearchEngineUpload = () => {
  const [current, setCurrent] = useState<number>(0);
  const [loading, setLoading] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");
  const [errors, setErrors] = useState<any[]>([]);
  const [uploadingPercentage, setUploadingPercentage] = useState<number>(0);
  const [importedFileDetails, setImportedFileDetails] = useState<any>(null);

  const [form] = useForm();

  const uploadedFile = useWatch("file", form);

  const abortControllerRef = useRef<AbortController | null>(null);

  const clearStates = () => {
    setCurrent(0);
    setUploadingPercentage(0);
    form.resetFields();
    setErrors([]);
    setImportedFileDetails(null);
    setErrorType("");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleFileUpload = async () => {
    form.validateFields().then(async (values: { file: any }) => {
      setLoading("upload");

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const formData = new FormData();
      formData.append("file", values.file?.fileList[0]?.originFileObj);

      try {
        const { data } = await SEARCH_SERVICE.uploadLmaParquetFile(formData, {
          signal: abortController.signal,
          onUploadProgress: (progressEvent: ProgressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );

            if (percent === 100) {
              setCurrent(1);
            }

            setUploadingPercentage(percent);
          },
        });

        const hasError = data?.errors?.length > 0 || data?.ignored;
        const ignoreList =
          (data?.ignored &&
            Object.entries(data?.ignored).map(([key, value]) => ({
              row: null,
              column: null,
              message: `Ignored: ${key} - ${value}`,
            }))) ||
          [];

        setImportedFileDetails(data || null);

        if (hasError) {
          setErrorType("partial");
          setErrors([...ignoreList, ...(data?.errors || [])]);
        } else {
          setErrorType("success");
          setErrors([]);
        }
      } catch (error: any) {
        const hasError = error?.data?.data?.errors?.length > 0;

        const ignoreList =
          (error?.ignored &&
            Object.entries(error?.data?.data?.ignored).map(([key, value]) => ({
              row: null,
              column: null,
              message: `Ignored: ${key} - ${value}`,
            }))) ||
          [];

        if (hasError) {
          setErrors([...ignoreList, ...(error?.data?.data?.errors || [])]);
          setErrorType("fileError");
        } else {
          setErrorType("other");
        }
      } finally {
        setCurrent(2);
        setLoading("");
      }
    });
  };

  const steps = [
    {
      title: "Upload File",
      icon: <CloudUploadOutlined />,
      content: (
        <UploadFile
          showUploadButton={uploadedFile && uploadedFile?.fileList?.length > 0}
          downloadtemplate={() => {}}
          loading={loading}
          onFinish={handleFileUpload}
          uploadingPercentage={uploadingPercentage}
          cancelUpload={clearStates}
        />
      ),
    },
    {
      title: "File Check",
      icon: <FileSearchOutlined />,
      content: <FileCheckStep />,
    },
    {
      title: "Result",
      icon: <FileTextOutlined />,
      content: (
        <ResultStep
          errorType={errorType}
          tryAgain={clearStates}
          errors={errors}
          onDone={() => {
            clearStates();
          }}
          fileDetails={[`File Saved Successfully`]}
        />
      ),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        disabled={loading === "upload"}
        className="w-full px-4 mx-auto"
        layout="vertical"
      >
        <Steps
          current={current}
          className="mt-4 mb-8"
          items={steps.map((step, index) => ({
            title: step.title,
            icon: step.icon,
            disabled: current !== index,
          }))}
        />
        <div className="w-full h-fit">{steps[current].content}</div>
      </Form>
    </div>
  );
};

export default SearchEngineUpload;
