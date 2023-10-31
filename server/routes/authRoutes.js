const express = require("express");
const {userRegistration, userLogin, changePassword, loggedUser, sendUserResetPasswordEmail, userPasswordReset, activeTrue} = require("../controllers/authController")
const {checkUserAuth, userById} = require("../middlewares/auth-middleware")
const router = express.Router();

//protected routes middleware level
router.use("/changepassword", checkUserAuth);
// router.use("/loggeduser", checkUserAuth);

// Public Routes
// swagger documentation ( register )
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Registration
 *     summary: Registers a new user
 *     description: This endpoint allows users to register a new account.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object containing registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             password_confirmation:
 *               type: string
 *             phone:
 *               type: number
 *             address:
 *               type: string
 *             role:
 *               type: string
 *             tc:
 *               type: boolean
 *     responses:
 *       201:
 *         description: Registration success
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Registration success, Please verify your email
 *             token:
 *               type: string
 *               example: <token>
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: All field are required
 *       409:
 *         description: Conflict - Email already exists
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Sorry email already exists
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Unable to register
 */
router.post('/register', userRegistration)

// swagger documentation ( login )
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: This endpoint allows users to log in to their accounts.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: User credentials for login
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login success
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Login success
 *             token:
 *               type: string
 *               example: <token>
 *             role:
 *               type: string
 *               example: manager
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: All fields are required
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Email or password not valid or you haven't activated your account
 *       404:
 *         description: Not Found
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: This account doesn't exist
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Unable to login
 */
router.post('/login', userLogin)


// swager documentation ( forget & reset password )
/**
 * @swagger
 * /api/auth/send-reset-password-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send reset password email
 *     description: This endpoint sends a reset password email to the user's registered email address.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: User's email address
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Password Reset Email Sent... Please Check Your Email
 *             info:
 *               type: object
 *               properties:
 *                 // properties of the 'info' object
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Email field is required
 *       404:
 *         description: Not Found
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Email doesn't exist
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Unable to send reset password email
 */
router.post("/send-reset-password-email", sendUserResetPasswordEmail)
// router.get("/reset-password/:id/:token", userPasswordReset)

/**
 * @swagger
 * /api/auth/reset-password/{id}/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Validate password reset token
 *     description: This endpoint validates the password reset token.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         description: Password reset token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Valid token
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Valid Token
 *       401:
 *         description: Invalid token
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Invalid Token

 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset user password
 *     description: This endpoint resets the user's password.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         description: Password reset token
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: passwordResetData
 *         description: New password and confirmation
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *             password_confirmation:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Password Reset Successfully
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: New Password and Confirm New Password don't match or All Fields are Required
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Internal Server Error
 *       405:
 *         description: Method Not Allowed
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: failed
 *             message:
 *               type: string
 *               example: Method Not Allowed
 */
router.route("/reset-password/:id/:token")
  .get(userPasswordReset)
  .post(userPasswordReset);


/**
 * @swagger
 * /api/auth/profile/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Activate user account
 *     description: This endpoint activates the user's account based on the provided token.
 *     parameters:
 *       - in: path
 *         name: token
 *         description: Activation token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Token verified and user account is now active
 *             userId:
 *               type: string
 *               example: 1234567890
 *       401:
 *         description: Token verification failed
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Token verification failed
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal server error
 */  
router.get('/profile/:token', userById ,activeTrue);
// router.param('token', userById)



// protected routes
router.post("/changepassword", changePassword)
router.get("/loggeduser", loggedUser)


module.exports = router;

