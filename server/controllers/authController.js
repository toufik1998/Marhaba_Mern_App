const UserModel = require("../models/User");
const RoleModel = require("../models/Role");
const Joi = require("joi")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validateForms} = require("../validators/validateUserForms")
const transporter = require("../config/emailCofing");

const userRegistration = async (req, res) => {
  // Validate the data before we make a user
 // const {error} = validateForms.validateRegister(req.body);
  //if (error) return res.status(400).json({ error: error.details[0].message });


  const {
    name,
    email,
    password,
    password_confirmation,
    phone,
    address,
    role,
    tc,
  } = req.body;

  const user = await UserModel.findOne({ email: email });
  if (user) {
    res
      .status(409)
      .send({ status: "failed", message: "Sorry email already exist" });
  } else {
    if (
      name &&
      email &&
      password &&
      password_confirmation &&
      phone &&
      address &&
      role 
      // tc
    ) {
      if (password == password_confirmation) {
        try {
          // const salt = await bcrypt.genSalt(10);
          const salt = bcrypt.genSaltSync(10);
          // const hashPassword = await bcrypt.hash(password, salt);
          const hashPassword = bcrypt.hashSync(password, salt);
          // const saved_role = await RoleModel.findById(role);
          // console.log(saved_role.name);
          const doc = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            phone: phone,
            address: address,
            role: role,
            // tc: tc,
          });

          await doc.save();

          const saved_user = await UserModel.findOne({ email: email }).populate(
            "role",
            "name"
          );
          // console.log(saved_user.role.name);
          const token = jwt.sign(
            {
              userID: saved_user._id,
              name: saved_user.name,
              role: saved_user.role.name,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );

          const link = `http://localhost:3000/active-email/${token}`;

          // Send Email
          let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: saved_user.email,
            subject: "Marhaba - activate your account",
            html: `<a href=${link}>Click Here</a> activate your account`,
          });

          res.status(201).send({
            status: "success",
            message: "Registration success, Please verify your email",
            token: token,
          });
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .send({ status: "failed", message: "Unable to register" });
        }
      } else {
        res.status(400).send({
          status: "failed",
          message: "the password is not match the confirmation password",
        });
      }
    } else {
      res
        .status(400)
        .send({ status: "failed", message: "All field are required" });
    }
  }
};

const activeTrue = (req, res) => {
  // Update the user's account status to "active"
  UserModel.findByIdAndUpdate(req.profile._id, { active: true })
    .exec()
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(500).json({ error: "Failed to update user account status" });
      } else {
        res
          .status(200)
          .json({
            message: "Token verified and user account is now active",
            userId: updatedUser._id,
          });
      }
    })
    .catch((updateErr) => {
      res.status(500).json({ error: "Failed to update user account status" });
    });
};


const userLogin = async (req, res) => {

  const {error} = validateForms.validateLogin(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });


  const { email, password } = req.body;


  try {
    if (email && password) {
      const user = await UserModel.findOne({ email: email }).populate('role', 'name');
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch && email == user.email && user.active == true) {
          // generate token
          const token = jwt.sign(
            { userID: user._id, name: user.name, role: user.role.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );

          res.cookie("authToken", token, { httpOnly: true });

          // switch (user.role.name) {
          //   case "manager":
          //     return res.redirect("/api/user/manager/me");
          //   case "delivery":
          //     return res.redirect("/api/user/delivery/me");
          //   case "client":
          //     return res.redirect("/api/user/client/me");
          // }

          res.status(200).send({
            status: "success",
            message: "Login success",
            token: token,
            role: user.role.name
          });
        } else {
          res.status(401).send({
            status: "failed",
            message: "Email or password not valid or you don't activate your account",
          });
        }
      } else {
        res
          .status(404)
          .send({ status: "failed", message: "This account doesn't exist" });
      }
    } else {
      res
        .status(400)
        .send({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    res.status(401).send({ status: "failed", message: "Unable to login" });
    console.log(error);
  }
};



const changePassword = async (req, res) => {
  const { password, password_confirmation } = req.body;
  if (password && password_confirmation) {
    if (password !== password_confirmation) {
      res.status(400).send({
        status: "failed",
        message: "New password and confirm password doesn't match",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      // await UserModel.findByIdAndUpdate(req.user._id, {$set: {password: newHashPassword}});
      await UserModel.findByIdAndUpdate(req.user._id, {
        $set: { password: newHashPassword },
      });

      res.status(200).send({
        status: "success",
        message: "New password changed succefully",
      });
    }
  } else {
    res
      .status(400)
      .send({ status: "failed", message: "All field are required" });
  }
};

const loggedUser = (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: "Signout" });
};

const sendUserResetPasswordEmail = async (req, res) => {
  // const {error} = validateForms.validateEmail(req.body);
  // if (error) return res.status(400).json({ error: error.details[0].message });


  const { email } = req.body;
  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "1d" });
      const link = `http://localhost:3000/reset-password/?id=${user._id}&token=${token}`;
      // const link = `http://127.0.0.1:1111/api/auth/reset-password/${user._id}/${token}`;
      // /reset-password/:id/:token
      console.log(link);

      // Send Email
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Marhaba - Password Reset Link",
        html: `<a href=${link}>Click Here</a> to Reset Your Password`,
      });

      res.status(200).send({
        status: "success",
        message: "Password Reset Email Sent... Please Check Your Email",
        info: info,
      });
    } else {
      res
        .status(404)
        .send({ status: "failed", message: "Email doesn't exists" });
    }
  } else {
    res
      .status(400)
      .send({ status: "failed", message: "Email field is required" });
  }
};

// const userPasswordReset = async (req, res) => {
//   const { password, password_confirmation } = req.body;
//   const { id, token } = req.params;
//   const user = await UserModel.findById(id);
//   const new_secret = user._id + process.env.JWT_SECRET_KEY;
//   console.log("new_secret", new_secret);

//   console.log("token", token);
//   try {
//     jwt.verify(token, new_secret);
//     if (password && password_confirmation) {
//       if (password !== password_confirmation) {
//         res.status(400).send({
//           status: "failed",
//           message: "New Password and Confirm New Password doesn't match",
//         });
//       } else {
//         const salt = await bcrypt.genSalt(10);
//         const newHashPassword = await bcrypt.hash(password, salt);
//         await UserModel.findByIdAndUpdate(user._id, {
//           $set: { password: newHashPassword },
//         });
//         res
//           .status(200)
//           .send({ status: "success", message: "Password Reset Successfully" });
//       }
//     } else {
//       res
//         .status(400)
//         .send({ status: "failed", message: "All Fields are Required" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({ status: "failed", message: "Invalid Token" });
//   }
// };


const userPasswordReset = async (req, res) => {
  
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  const new_secret = user._id + process.env.JWT_SECRET_KEY;
  console.log("new_secret", new_secret);

  console.log("token", token);

  // Check request method
  if (req.method === 'GET') {
    try {
      jwt.verify(token, new_secret);
      res.status(200).send({ status: "success", message: "Valid Token" });
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Invalid Token" });
    }
  } else if (req.method === 'POST') {
    try {
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.status(400).send({
            status: "failed",
            message: "New Password and Confirm New Password don't match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res
            .status(200)
            .send({ status: "success", message: "Password Reset Successfully" });
        }
      } else {
        res
          .status(400)
          .send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: "Internal Server Error" });
    }
  } else {
    res.status(405).send({ status: "failed", message: "Method Not Allowed" });
  }
};

// const userPasswordReset = async (req, res) => {
//   const { password, password_confirmation } = req.body;
//   const { id, token } = req.params;
//   const user = await UserModel.findById(id);
//   const new_secret = user._id + process.env.JWT_SECRET_KEY;
//   console.log("new_secret", new_secret);
//   console.log("token", token);

//   try {
//     if (password && password_confirmation) {
//       if (password !== password_confirmation) {
//         res.status(400).send({
//           status: "failed",
//           message: "New Password and Confirm New Password don't match",
//         });
//       } else {
//         const salt = await bcrypt.genSalt(10);
//         const newHashPassword = await bcrypt.hash(password, salt);
//         await UserModel.findByIdAndUpdate(user._id, {
//           $set: { password: newHashPassword },
//         });
//         res
//           .status(200)
//           .send({ status: "success", message: "Password Reset Successfully" });
//       }
//     } else {
//       res
//         .status(400)
//         .send({ status: "failed", message: "All Fields are Required" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ status: "failed", message: "Internal Server Error" });
//   }
// };


module.exports = {
  userRegistration,
  userLogin,
  changePassword,
  loggedUser,
  sendUserResetPasswordEmail,
  userPasswordReset,
  activeTrue,
};
