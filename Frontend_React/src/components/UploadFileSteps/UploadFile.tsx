import {
  CloseOutlined,
  CloudUploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Button, Form, Popconfirm, Progress, Upload } from "antd";
import { JSX } from "react";

const { Dragger } = Upload;

type UploadFileProps = {
  loading: string;
  showUploadButton: boolean;
  downloadtemplate: () => void;
  cancelUpload: () => void;
  onFinish: () => void;
  uploadingPercentage: number;
  title?: string;
  description?: string;
  accept?: string;
  children?: JSX.Element;
};

const UploadFile: React.FC<UploadFileProps> = ({
  loading,
  showUploadButton,
  cancelUpload,
  onFinish,
  uploadingPercentage,
  accept = ".parquet",
  title = "Click or drag file to this area to upload",
  description = "Only .parquet files are allowed",
  children,
}) => {
  return (
    <>
      <Form.Item name="file" required className="h-full">
        <Dragger
          accept={accept}
          maxCount={1}
          beforeUpload={() => {
            return false;
          }}
          listType="picture"
          onRemove={() => {
            return undefined;
          }}
          className=""
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>

          <p className="ant-upload-text">{title}</p>

          <p className="ant-upload-hint">{description}</p>
        </Dragger>
      </Form.Item>

      {uploadingPercentage ? (
        <Progress
          percent={uploadingPercentage}
          status={uploadingPercentage === 100 ? "success" : "active"}
          className="mb-4"
          format={(percent) => `Uploading (${percent}%)`}
        />
      ) : null}

      <div className="flex items-center justify-center gap-3">
        <div className="flex items-start gap-4">
          {children}

          {showUploadButton && (
            <Button
              icon={<CloudUploadOutlined />}
              type="primary"
              onClick={() => onFinish()}
              loading={loading === "upload"}
            >
              Upload
            </Button>
          )}

          {uploadingPercentage ? (
            <Popconfirm
              title="Are you sure you want to cancel the upload?"
              onConfirm={() => cancelUpload()}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ disabled: false }}
              cancelButtonProps={{ disabled: false }}
            >
              <Button icon={<CloseOutlined />} disabled={false} type="dashed">
                Cancel
              </Button>
            </Popconfirm>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default UploadFile;
