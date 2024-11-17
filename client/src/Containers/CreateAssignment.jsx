import { Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";

const CreateAssignment = ({ isModalOpen, handleOk, handleCancel }) => {
  const navigate = useNavigate();
  const OnFormSubmit = () => {};
  return (
    <Modal
      title="Create assignment"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
    </Modal>
  );
};

export default CreateAssignment;
