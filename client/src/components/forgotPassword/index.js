import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form"

import styles from "./styles.module.css";

const ForgotPassword = () => {

	const {
		register,
		handleSubmit,
		formState: { errors }, 
	
	  } = useForm()

	const [email, setEmail] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");

	const onSubmit = async () => {
		try {
			const url = `http://localhost:1111/api/auth/send-reset-password-email`;
			const { data } = await axios.post(url, { email });
			setMsg(data.message);
			setError("");
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
		<div className={styles.container}>
			<form className={styles.form_container} onSubmit={handleSubmit(onSubmit)}>
				<h1>Forgot Password</h1>
				<input
					type="text"
					placeholder="Email"
					name="email"
					value={email}
					className={styles.input}
					{...register("email",{required: "Email is required",pattern: {value:/^\S+@\S+.\S+$/,message: 'Invalid Email Address'}})} 
					onChange={(e) => setEmail(e.target.value)}

				/>
				{errors.email && (<small className='text-danger'>{errors.email.message}</small>)}

				{error && <div className={styles.error_msg}>{error}</div>}
				{msg && <div className={styles.success_msg}>{msg}</div>}
				<button type="submit" className={styles.green_btn}>
					Submit
				</button>
			</form>
		</div>
	);
};

export default ForgotPassword;