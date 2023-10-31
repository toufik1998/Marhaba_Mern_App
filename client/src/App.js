import React from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
// import Main from "./components/main";
import Signup from "./components/signup";
import Login from "./components/login";
import ClientWelcomePage from "./components/client/welcome";
import DeliveryWelcomePage from "./components/delivery/welcome";
import ManagerWelcomePage from "./components/manager/welcome";
import EmailVerify from "./components/verifyemail/index";
import ForgotPassword from "./components/forgotPassword";
import PasswordReset from "./components/PasswordReset";
import Navbar from "./components/header/navbar";
import 'bootstrap/dist/css/bootstrap.css'
import '../src/style.css'
import './components/sign.css'


function App() {
	// const user = localStorage.getItem("token");

	return (
		<>
		    <Navbar />
			<Routes>
				{/* {user && <Route path="/" exact element={<Main />} />} */}
				<Route path="/signup" exact element={<Signup />} />
				<Route path="/login" exact element={<Login />} />
				<Route path="/api/user/client/me" exact element={<ClientWelcomePage />} />
				<Route path="/api/user/delivery/me" exact element={<DeliveryWelcomePage />} />
				<Route path="/api/user/manager/me" exact element={<ManagerWelcomePage />} />
				<Route path="/active-email/:token" element={<EmailVerify />} />
				<Route path="/send-reset-password-email" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<PasswordReset />} />
			



				<Route path="/" element={<Navigate replace to="/login" />} />
			</Routes>
		</>	
	);
}

export default App;
