import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import logoLight from "../../assets/images/logo-light.png";
import { LoginCollaborator } from "../ApiCalls/LoginAPI";
import {useNavigate} from "react-router-dom";
import {apiError, loginSuccess} from "../../slices/auth/login/reducer";
import {resetLoginFlag} from "../../slices/auth/login/thunk";
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, loading, errorMsg } = useSelector(state => state.Login);

    const [passwordShow, setPasswordShow] = useState(false);

    const validation = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email format").required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await LoginCollaborator(values);
                const token = response;
                dispatch(loginSuccess(token));
                navigate('/dashboard');
            } catch (error) {
                dispatch(loginFail(error));
                dispatch(apiError(error.message || 'Login Failed'));
            }
        }
    });

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, errorMsg]);
    document.title = "Basic SignIn | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue to Velzon.</p>
                                        </div>
                                        {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                            >
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Email</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email}
                                                        invalid={validation.touched.email && !!validation.errors.email}
                                                        autoComplete="username"
                                                    />
                                                    {validation.touched.email && validation.errors.email && (
                                                        <FormFeedback>{validation.errors.email}</FormFeedback>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div>
                                                    <Label className="form-label" htmlFor="password-input">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={validation.touched.password && !!validation.errors.password}
                                                            autoComplete="current-password"
                                                        />
                                                        {validation.touched.password && validation.errors.password && (
                                                            <FormFeedback>{validation.errors.password}</FormFeedback>
                                                        )}
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                            type="button"
                                                            onClick={() => setPasswordShow(!passwordShow)}
                                                        >
                                                            <i className="ri-eye-fill align-middle"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                </div>
                                                <div className="mt-4">
                                                    <Button disabled={loading} color="success" className="btn btn-success w-100" type="submit">
                                                        {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : 'Sign In'}
                                                    </Button>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">Sign In with</h5>
                                                    </div>
                                                    <div>
                                                        <Link to="#" className="btn btn-primary btn-icon me-1" onClick={(e) => e.preventDefault()}>
                                                            <i className="ri-facebook-fill fs-16" />
                                                        </Link>
                                                        <Link to="#" className="btn btn-danger btn-icon me-1" onClick={(e) => e.preventDefault()}>
                                                            <i className="ri-google-fill fs-16" />
                                                        </Link>
                                                        <Button color="dark" className="btn-icon"><i className="ri-github-fill fs-16"></i></Button>{" "}
                                                        <Button color="info" className="btn-icon"><i className="ri-twitter-fill fs-16"></i></Button>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account? <Link to="/register" className="fw-semibold text-primary text-decoration-underline">Signup</Link></p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Login;