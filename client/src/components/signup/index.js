import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form"
import Navbar from "../header/navbar";
import styles from "./styles.module.css"
import loginImage from '../../images/login.png'


const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }, 
    watch
  } = useForm()

    const [data, setData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        password: "",
        password_confirmation: ""
    });



    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("6530eae7063b3b0ff73260f2");

    const password = watch("password", ""); // Add this line to watch the value of the password field
    // Fetch roles from backend API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:1111/api/role/get-all-routes");
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

    const [error, setError] = useState("")
    const [msg, setMsg] = useState("");


    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    }

    const handleRoleChange = (e) => {
      setSelectedRole(e.target.value);
    };

    const onSubmit = async () => {
        // e.preventDefault();
        try {
            const url = "http://localhost:1111/api/auth/register"
            const {data: res} = await axios.post(url, { ...data, role: selectedRole });
            setMsg(res.message);
            // navigate("/login")
            // console.log(res.message);
            

        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500){
                setError(error.response.data.message)
            }
        }
    }


    return (
      <>
        <Navbar />
        <div className="container py-3 vh-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img src={loginImage} alt="login" className="img-fluid" />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input type="text" name="name" value={data.name}  id="name" className="form-control form-control-lg" placeholder="Name" {... register ("name",{required:"Name is required",minLength: {value: 6,message :"Min Length you need 6 caracters "},maxLength: {value: 15,message: "max Length is 15 caracters"}})} onChange={handleChange} />
                  {errors.name && (<small className='text-danger'>{errors.name.message}</small>)}
                </div>
                <div className="mb-4">
                  <input type="text" name="email" value={data.email}  id="email" className="form-control form-control-lg" placeholder="Email" {...register("email",{required: "Email is required",pattern: {value:/^\S+@\S+.\S+$/,message: 'Invalid Email Address'}})} onChange={handleChange} />
                  {errors.email && (<small className='text-danger'>{errors.email.message}</small>)}
                </div>
                <div className="mb-4">
                  <input type="text" name="address" value={data.address}  id="address" className="form-control form-control-lg" placeholder="Address" {... register ("address",{required:"Address is required",minLength: {value: 6,message :"Min Length you need 6 caracters "},maxLength: {value: 15,message: "max Length is 15 caracters"}})} onChange={handleChange}/>
                  {errors.address && (<small className='text-danger'>{errors.address.message}</small>)}
                </div>
                <div className="mb-4">
                  <input type="text" name="phone" value={data.phone}  id="phone" className="form-control form-control-lg" placeholder="Phone number" 
                    {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: new RegExp("^[0-9]{10}$"), // Assumes a 10-digit phone number
                          message: 'Invalid phone number format'
                        }
                      })
                    } 
                    onChange={handleChange}
                  />
                  {errors.phone && (<small className='text-danger'>{errors.phone.message}</small>)}
                </div>
                <div className="mb-4">
                  <input type="password" name="password" value={data.password}  id="password" className="form-control form-control-lg" placeholder="Password" 
                    
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
                <div className="mb-4">
                  <input type="password" name="password_confirmation" value={data.password_confirmation}  id="confirmpassword" className="form-control form-control-lg" placeholder="Confirm password" 
                    {...register('password_confirmation', {
                      validate: (value) =>
                        value === password || 'The passwords do not match'
                    })}
                    onChange={handleChange}
                  />
                  
                  {errors.password_confirmation && (<small className='text-danger'>{errors.password_confirmation.message}</small>)}

                </div>

                {/* Rest of the component code */}
                  <div className="mb-4">
                    <label htmlFor="role">Select Role:</label>
                    {roles.length > 0 ? (
                      <select name="role" id="role" value={selectedRole} onChange={handleRoleChange}>
                        {roles.map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p>Loading roles...</p>
                    )}
                  </div>
                {/* Rest of the component code */}
                
                {/* {error && <div>{error}</div>}
                {msg && <div>{msg}</div>} */}

                {error && <div className={styles.error_msg}>{error}</div>}
						    {msg && <div className={styles.success_msg}>{msg}</div>}


                <button type="submit" className="btn button">Create a new account</button>
              </form>
              <div className="d-flex mt-4">
                <p className="mb-0">If you have an account</p>
                <Link to={"/login"}>
                    <button type="submit" className="ms-3">Login</button>
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
    )
}

export default Signup;