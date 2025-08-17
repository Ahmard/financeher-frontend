/** biome-ignore-all lint/correctness/useExhaustiveDependencies: not needed */
import type React from 'react';
import {type CSSProperties, useCallback, useMemo, useState} from 'react'
import {Button, Form, Modal} from 'antd';
import {xhrDelete, xhrPatch} from "@/lib/xhr";
import {useMessage} from "@/lib/hooks/message";
import TextArea from "antd/lib/input/TextArea";
import {HttpMethod} from "@/lib/enums/http";

// Define types for props
interface IProps {
  title: string;
  successMessage: string;
  okText?: string;
  cancelText?: string;
  endpoint: string;
  // Provide some statements/warnings
  statement?: string;
  httpMethod?: HttpMethod;
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onConfirmed?: () => void;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  onFinally?: () => void;
}

const Confirm: React.FC<IProps> = (props) => {
  const {
    title,
    successMessage,
    okText = 'Please',
    cancelText = 'Cancel',
    endpoint,
    statement,
    httpMethod = HttpMethod.Patch,
    visible,
    onVisibleChange,
    onConfirmed,
    onSuccess,
    onFinally,
    onCancel,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transformX, _setTransformX] = useState(0);
  const [transformY, _setTransformY] = useState(0);
  const {showMessage} = useMessage();

  // Transform style for modal
  const transformStyle = useMemo<CSSProperties>(() => {
    return {
      transform: `translate(${transformX}px, ${transformY}px)`,
    };
  }, [transformX, transformY]);

  // Handle form submission
  const submitForm = useCallback(() => {
    onConfirmed?.();
    setIsSubmitting(true);

    let request;
    if (httpMethod === HttpMethod.Delete) {
      request = xhrDelete(endpoint);
    } else {
      request = xhrPatch(endpoint);
    }

    request
      .then(resp => {
        showMessage({
          title,
          type: 'success',
          message: successMessage,
        });

        setTimeout(() => onSuccess?.(resp.data), 50);
        onVisibleChange?.(false);
      })
      .finally(() => {
        onFinally?.();
        setIsSubmitting(false);
      });
  }, [httpMethod, endpoint, title, successMessage, onConfirmed, onSuccess, onFinally]);

  // Handle modal OK button click
  const handleOk = useCallback(() => {
    // Trigger form submission
    submitForm();
  }, [submitForm]);

  // Handle modal Cancel button click
  const handleCancel = useCallback(() => {
    onCancel?.();
    onVisibleChange?.(false);
  }, [onVisibleChange]);

  return (
    <Modal
      title={
        <div
          style={{width: '100%', cursor: 'move'}}
          // In React, we would need to implement drag functionality separately
        >
          {title}
        </div>
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      footer={null}
      okText={okText}
      cancelText={cancelText}
      styles={{body: transformStyle}}
      // For custom modal rendering, you can use the wrapClassName or rootClassName props
    >
      {statement && (<div className="my-2">{statement}</div>)}

      <Form layout="vertical" onFinish={submitForm}>
        <div className="mt-3 flex justify-end">
          <Button
            shape="round"
            type="default"
            disabled={isSubmitting}
            htmlType="button"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            shape="round"
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="ms-2 !bg-[#006A4B]"
          >
            {isSubmitting ? 'Processing...' : okText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Confirm;
