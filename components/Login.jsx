import { postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Signup from "./sign-up";

const initialValue = {
  phoneNumber: "",
  password: "",
};

function Login({ show, setShow }) {
  const [formData, setFormData] = useState(initialValue);
  const [validated, setValidated] = useState(false);
  const [signup, setSignup] = useState(false);

  // ✅ modal open/close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ✅ input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const reqBody = {
          identifier: formData.phoneNumber,
          password: formData.password,
        };

        const res = await postRequest(endPoints.login, reqBody);

        if (res.success) {
          toast.success("Login successful 🎉");
          localStorage.setItem("token", res.token);
          handleClose();
          setFormData(initialValue);
        }
      } catch (err) {
        console.log(err.response?.data);
        toast.error(err.response?.data?.error || "Login failed");
      }
    }

    setValidated(true);
  };
  const openSignup = ()=>{
    setSignup(true)
    setShow(false)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Phone Number */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                pattern="^[0-9]{10}$"
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid 10-digit phone number.
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                minLength={6}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
<Modal.Footer className="d-flex flex-column justify-content-center align-items-center">
  <Button type="submit" variant="primary" className="mb-2 w-100">
    Login
  </Button>
  <span className="cursor-pointer" style={{ fontSize: "0.9rem" }}>
    Don’t have an account?{" "}
    <strong className="text-primary" onClick={openSignup}>Register here</strong>
  </span>
</Modal.Footer>

        </Form>
      </Modal>
      <Signup show={signup} setShow={setSignup} />
    </>
  );
}

export default Login;
