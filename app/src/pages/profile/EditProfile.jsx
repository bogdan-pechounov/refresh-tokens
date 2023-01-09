import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { AppContext } from '../../App'
import PasswordStrength from '../../components/password-strength/PasswordStrength'
import api from '../../utils/api'

//validation
const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'Username should contain at least 4 characters')
    .required('Username required'),
  email: Yup.string().email('Invalid email'),
})

function validate({ password, confirmPassword }) {
  const errors = {}
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  return errors
}

function EditProfile() {
  const { user, setUser } = useContext(AppContext)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  if (!user) return
  const initialValues = {
    name: user.name,
    email: user.email,
    password: '',
    confirmPassword: '',
  }

  async function onSubmit(values, { setFieldError, setErrors }) {
    //ignore empty string ("A component is changing an uncontrolled input to be controlled"")
    const user = { ...values }
    if (!user.email) delete user.email
    if (!user.password) delete user.password
    try {
      setUser(await api.editUser(user))
      navigate('/')
    } catch (err) {
      setErrors(err.response.data)
    }
  }

  //focus next field when enter is pressed
  function handleEnter(event) {
    if (event.keyCode === 13) {
      const form = event.target.form
      const index = Array.prototype.indexOf.call(form, event.target)
      form.elements[index + 1].focus()
      event.preventDefault()
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
        <Form className="container mt-2">
          {/* Image Upload */}
          <label htmlFor="image" className="form-label">
            Profile Picture
          </label>
          <input
            id="image"
            name="image"
            type="file"
            className="form-control"
            onChange={(event) => {
              setFieldValue('image', event.currentTarget.files[0])
            }}
          />
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Username
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              placeholder={'Username'}
              className={`form-control ${
                touched.name ? (errors.name ? 'is-invalid' : 'is-valid') : ''
              }`}
              onKeyDown={handleEnter}
            />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder={'optional@optional.com'}
              className={`form-control ${
                touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''
              }`}
              aria-describedby="emailHelp"
              onKeyDown={handleEnter}
            />
            <div id="emailHelp" className="form-text">
              An email will be sent upon sign up.
            </div>
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Field
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-control mb-1 ${
                  touched.password
                    ? errors.password
                      ? 'is-invalid'
                      : 'is-valid'
                    : ''
                }`}
                style={{ backgroundImage: 'none' }}
                onKeyDown={handleEnter}
              />
              <i
                className={`bi bi-eye${showPassword ? '' : '-slash'}`}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',

                  transform: 'translateY(-50%)',
                }}
                onClick={() => setShowPassword((v) => !v)}
              ></i>
            </div>
            <PasswordStrength password={values.password} />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          {/* Confirm password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${
                touched.confirmPassword
                  ? errors.confirmPassword
                    ? 'is-invalid'
                    : 'is-valid'
                  : ''
              }`}
              onKeyDown={handleEnter}
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="error"
            />
          </div>
          <button type="submit" className="btn btn-primary" component="div">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default EditProfile
