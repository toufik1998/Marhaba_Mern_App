import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form"
import Navbar from "../header/navbar";

import loginImage from "../../images/login.png"

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors }, 

  } = useForm()


  const navigate = useNavigate();
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");


	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const onSubmit = async () => {
		// e.preventDefault();
		try {
			const url = "http://localhost:1111/api/auth/login";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", JSON.stringify(data));
      console.log(res.role)
      switch (res.role) {
        case "manager":
          navigate("/api/user/manager/me");
          break;
        case "delivery":
          navigate("/api/user/delivery/me");
          break;
        case "client":
          navigate("/api/user/client/me");
          
          break;
        default:
          break;
      }
			// window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
    <>
        {/* < Navbar /> */}
        <div className="container py-3 vh-100">
              <div className="row d-flex align-items-center justify-content-center h-100">
                <div className="col-md-8 col-lg-7 col-xl-6">
                  <img src={loginImage} alt="login" className="img-fluid" />
                </div>
                <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                    <label htmlFor="email" className="form-label">Address Email:</label>

                      <input type="text" id="email" name="email" value={data.email}  className="form-control form-control-lg"  
                        {...register("email",{required: "Email is required",pattern: {value:/^\S+@\S+.\S+$/,message: 'Invalid Email Address'}})} 
                        onChange={handleChange}
                      />
                      {errors.email && (<small className='text-danger'>{errors.email.message}</small>)}

                    </div>
                    <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password:</label>

                      <input type="password" id="password" name="password" value={data.password}  className="form-control form-control-lg" 
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                        onChange={handleChange}
                      />
                      {errors.password && (<small className='text-danger'>{errors.password.message}</small>)}

                    </div>
                    <div className="form-check mb-4">
                      <input type="checkbox" name="remember" id="remember" className="form-check-input" />
                      <label htmlFor="remember" className="form-check-label">Remember me</label>
                    </div>

                    <Link to="/send-reset-password-email" style={{ alignSelf: "flex-start" }}>
                      <p style={{ padding: "0px" }}>forget password ?</p>
                    </Link>
                    {error && <div>{error}</div>}

                    <button type="submit" className="btn button">Login</button>
                  </form>
                  <div className="d-flex mt-4">
                    <p className="mb-0">If you don't have an account</p>
                    <Link to={"/signup"}>
                        <button type="submit" className="ms-3">Create a new account</button>
                    </Link>
                  </div>
                  {/* <div className="d-flex mt-4">
                    <p className="fw-bold mx-3 mb-0 text-muted">
                      Or you can login with 
                    </p>
                  </div>
                  <div className="social-media-login">
                    <a href="#" className="btn login-button" role="button">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="btn login-button" role="button">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div> */}
                </div>
              </div>
        </div>
    </>
	);
};

export default Login;
