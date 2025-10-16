import { postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";

const initialValue ={
    name: "",
    phoneNumber: "",
    confirmPhoneNumber: "",
    email: "",
    password: "",
}
function Signup({show,setShow}) {

  // ✅ form state
  const [formData, setFormData] = useState(initialValue);

  const [validated, setValidated] = useState(false);

  // ✅ open/close handlers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ✅ handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ submit handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if(formData.phoneNumber!==formData.confirmPhoneNumber){
      toast.error("Confirm Mobile number doen not match with Phone number")
      return
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const res = await postRequest(endPoints.signup, formData);
        if (res.success) {
          toast.success(res.msg);
          localStorage.setItem("token", res.token);
          handleClose();
          setFormData(initialValue)
        }
        // close modal on success
      } catch (err) {
        toast.error(err.response.data.error)

      }
    }

    setValidated(true); // trigger Bootstrap validation feedback
  };

  return (
    <>
    {}
  

      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Signup</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>

            {/* Phone */}
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
                Please provide a valid 10-digit phone number.
              </Form.Control.Feedback>
            </Form.Group>
             <Form.Group className="mb-3">
              <Form.Label>Confirm Phone Number</Form.Label>
              <Form.Control
                required
                pattern="^[0-9]{10}$"
                type="text"
                name="confirmPhoneNumber"
                value={formData.confirmPhoneNumber}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter same Mobile Number
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
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
                Password must be at least 6 characters long.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Signup;
