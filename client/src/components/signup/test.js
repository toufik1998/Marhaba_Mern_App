import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validateToken from "../helpers/validateToken";
import { useUser } from "../contexts/UserContext";

export const Register = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    async function checkTOKEN() {
      let result = await validateToken();
      if (result.success) {
        setUser(result.user);
        navigate("/client");
      }
    }

    checkTOKEN();
  }, []);

  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(8).max(16),
    role: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    await axios
      .post("http://localhost:3000/api/auth/register", data)
      .then((response) => {
        console.log(response.data);
        // setSuccess(response.data.success);
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };
  // use effect to load roles from http://localhost:3000/api/roles once the component is mounted
  useEffect(() => {
    axios.get("http://localhost:3000/api/roles").then((response) => {
      console.log(response.data);
      setRoles(response.data);
    });
  }, []);

  return (
    <div>
      <h3>Register</h3>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          style={{ maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}
        >
          {success && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          <div>
            <TextField
              error={!!errors.name}
              label="name"
              {...register("name")}
            />
            {errors.name && (
              <p style={{ margin: 0, color: "red" }}>{errors.name.message}</p>
            )}
          </div>
          <div>
            <TextField
              error={!!errors.email}
              label="email"
              {...register("email")}
            />
            {errors.email && (
              <p style={{ margin: 0, color: "red" }}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <TextField
              type="password"
              error={!!errors.password}
              label="password"
              {...register("password")}
            />
            {errors.password && (
              <p style={{ margin: 0, color: "red" }}>
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <div>
              <h5 style={{ margin: 0 }}>Select a Role:</h5>
              {roles.map((role) => (
                <label key={role._id}>
                  <input
                    type="radio"
                    name="selectedRole"
                    value={role._id}
                    {...register("role")}
                  />
                  {role.name}
                </label>
              ))}
            </div>
            {/*    show error. role*/}
            <div>
              {errors.role && (
                <p style={{ margin: 0, color: "red" }}>{errors.role.message}</p>
              )}
            </div>
          </div>
        </div>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  );
};