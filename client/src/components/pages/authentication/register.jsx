import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, registerUser } from '../../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../../layouts/loader';
import { REGISTER_USER_RESET } from '../../../constants/userConstants';

function Register() {
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, success } = useSelector((state) => state.persistedReducer.user);

    useEffect(() => {
        if (success) {
            navigate("/join");
            toast.success("registered successfully")
           dispatch({
            type: REGISTER_USER_RESET
           })
        }
        if (error) {
            toast.error(error);
        }
        dispatch(clearErrors());
    }, [navigate, success, error, dispatch]);
    


	const handleSubmit = (event) => {
		event.preventDefault();
		const form = event.currentTarget;

		if (form.checkValidity() === false) {
			event.stopPropagation();
		} else {
			const formData = new FormData();
			formData.set("firstName", event.target.firstName.value);
			formData.set("lastName", event.target.lastName.value);
			formData.set("email", event.target.email.value);
			formData.set("password", event.target.password.value);
			dispatch(registerUser(formData));
		}
		setValidated(true);
	};

  return (
    <>
      {loading ? <Loader /> : 
    <Container>
      <div className="p-5 bg-image" style={{backgroundImage: 'url(https://mdbootstrap.com/img/new/textures/full/171.jpg)', height: '300px'}}></div>
      
      <Card className='mx-5 mb-5 p-5 shadow-5' style={{marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Card.Body className='p-5 text-center'>
          <h2 className="fw-bold mb-5">Sign up now</h2>

          <Row>
            <Col col='6'>
              <Form.Group controlId='formFirstName'>
                <Form.Label>First name</Form.Label>
                <Form.Control type='text' placeholder='First name' name='firstName'/>
              </Form.Group>
            </Col>

            <Col col='6'>
              <Form.Group controlId='formLastName'>
                <Form.Label>Last name</Form.Label>
                <Form.Control type='text' placeholder='Last name' name='lastName' />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId='formEmail' className='mt-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' placeholder='Email' name='email' />
          </Form.Group>

          <Form.Group controlId='formPassword' className='mt-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' name='password' />
          </Form.Group>

          <Button type='submit' className='w-100 mb-4 mt-3' size='md' variant='dark'>Sign up</Button>
          
          <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
            Already have an account?{" "}
            <Link to="/">
              <span style={{ color: "#393f81" }}>
                Login
              </span>
            </Link>
          </p>         
        </Card.Body>
        </Form>
      </Card>
    </Container> }
    </>
  );
}

export default Register;
