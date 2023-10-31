import { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate ,useLocation } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import styles from "./styles.module.css";

const PasswordReset = () => {

  const {
    register,
    handleSubmit,
    formState: { errors }, 
    watch
  } = useForm()


  const navigate = useNavigate();  
  const {search} = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id") 
  const token = query.get("token") 
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const param = useParams();
  console.log(id);
  console.log(token);
  const url = `http://127.0.0.1:1111/api/auth/reset-password/${id}/${token}`;

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [param, url]);

    const password1 = watch("password", ""); // Add this line to watch the value of the password field


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Password and Confirm Password do not match");
        setMsg("");
        return;
      }

      const { data } = await axios.post(url, { password, password_confirmation: confirmPassword });
      setMsg(data.message);
      setError("");
      navigate("/login")
    //   window.location = "/login";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  

  return (
    <Fragment>
      {validUrl ? (
        <div className={styles.container}>
          <form className={styles.form_container} onSubmit={handleSubmit(onSubmit)}>
            <h1>Add New Password</h1>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              className={styles.input}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              onChange={(e) => setPassword(e.target.value)}

            />
            {errors.password && (<small className='text-danger'>{errors.password.message}</small>)}

            <input
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              value={confirmPassword}
              className={styles.input}
              {...register('password_confirmation', {
                validate: (value) =>
                  value === password1 || 'The passwords do not match'
              })}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.password_confirmation && (<small className='text-danger'>{errors.password_confirmation.message}</small>)}

            {error && <div className={styles.error_msg}>{error}</div>}
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button type="submit" className={styles.green_btn}>
              Submit
            </button>
          </form>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </Fragment>
  );
};

export default PasswordReset;