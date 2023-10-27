import React, { useEffect, useState } from "react";
import { Button, Container, Card, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, loginUser } from "../../../actions/userActions";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../layouts/loader";

function Login() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, isAuthenticated } = useSelector(
    (state) => state.persistedReducer.user
  );

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      toast.error("please enter email id and password");
    } else {
      event.preventDefault();
      dispatch(loginUser(email, password));
    }
    setValidated(true);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (isAuthenticated == true && user && user.isAdmin == true) {
      navigate("/admin");
      toast.success("welcome admin");
    } else if (isAuthenticated == true && user && user.isAdmin == false) {
      navigate("/join");
      toast.success(`welcome ${user.firstName}`);
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, user, navigate, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container className="my-5 ">
          <Card>
          <Form onSubmit={handleSubmit} validated={validated} noValidate>
            <Row className="g-0">
              <Col md="6">
                <Card.Img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form"
                  className="rounded-start w-100"
                />
              </Col>

              <Col md="6">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex flex-row mt-2">
                    <i
                      className="fa fa-cubes fa-3x me-3"
                      style={{ color: "#ff6219" }}
                    />
                    <span className="h1 fw-bold mb-0">ZoomClone</span>
                  </div>

                  <h5
                    className="fw-normal my-4 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Sign into your account
                  </h5>
         
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmail}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePassword}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your password.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button
                      variant="dark"
                      className="mb-4 px-5 mt-3"
                      size="lg"
                      type="submit"
                    >
                      Login
                    </Button>
                 
                
                  <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#393f81" }}>
                      Register
                    </Link>
                  </p>

                  <div className="d-flex flex-row justify-content-start">
                    <a href="#!" className="small text-muted me-1">
                      Terms of use.
                    </a>
                    <a href="#!" className="small text-muted">
                      Privacy policy
                    </a>
                  </div>
                </Card.Body>
              </Col>
            </Row>
            </Form>
          </Card>
        </Container>
      )}
    </>
  );
}

export default Login;
