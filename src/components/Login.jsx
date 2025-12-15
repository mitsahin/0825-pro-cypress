import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from 'reactstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    terms: false,
  });
  const [isValid, setIsValid] = useState(false);

  const history = useHistory();

  // ----------------------------
  // Email validasyonu
  // ----------------------------
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ----------------------------
  // useEffect → form genel doğrulama
  // ----------------------------
  useEffect(() => {
    if (
      validateEmail(form.email) &&
      form.password.trim().length >= 4 &&
      form.terms
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [form]);

  // ----------------------------
  // handleChange → alan bazlı validasyon
  // ----------------------------
  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    value = type === 'checkbox' ? checked : value;

    setForm({ ...form, [name]: value });

    // Email
    if (name === 'email') {
      if (validateEmail(value)) {
        setErrors({ ...errors, [name]: false });
      } else {
        setErrors({ ...errors, [name]: true });
      }
    }

    // Password
    if (name === 'password') {
      if (value.trim().length >= 4) {
        setErrors({ ...errors, [name]: false });
      } else {
        setErrors({ ...errors, [name]: true });
      }
    }

    // Terms
    if (name === 'terms') {
      if (value === true) {
        setErrors({ ...errors, [name]: false });
      } else {
        setErrors({ ...errors, [name]: true });
      }
    }
  };

  // ----------------------------
  // Form Submit
  // ----------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValid) return;

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.email === form.email && item.password === form.password
        );

        if (user) {
          setForm(initialForm);
          history.push('/main');
        } else {
          history.push('/error');
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* EMAIL */}
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          invalid={errors.email}
        />
        {errors.email && (
          <FormFeedback id='emailError'>Please enter a valid email address</FormFeedback>
        )}
      </FormGroup>

      {/* PASSWORD */}
      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          invalid={errors.password}
        />
        {errors.password && (
          <FormFeedback id='passwordError'>
            Password must be at least 4 characters long
          </FormFeedback>
        )}
      </FormGroup>

      {/* TERMS */}
      <FormGroup check>
        <Input
          type="checkbox"
          id="terms"
          name="terms"
          checked={form.terms}
          onChange={handleChange}
          invalid={errors.terms}
        />
        <Label htmlFor="terms" check>
          I agree to terms of service and privacy policy
        </Label>
        {errors.terms && <FormFeedback>You must accept the terms</FormFeedback>}
      </FormGroup>

      {/* BUTTON */}
      <FormGroup className="text-center p-4">
        <Button color="primary" type="submit" disabled={!isValid}>
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
