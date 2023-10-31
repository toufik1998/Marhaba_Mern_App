const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailCofing");
const { sendUserResetPasswordEmail } = require("../controllers/authController"); // Replace "your-file" with the actual file containing the function

jest.mock("../models/User");
jest.mock("jsonwebtoken");
jest.mock("../config/emailCofing");

describe("sendUserResetPasswordEmail", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send a password reset email if the email exists", async () => {
    const user = {
      _id: "653781b4ecea7412db9e9547",
      email: "ahmed@gmail.com",
    };

    UserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
    jwt.sign.mockReturnValue("generated-token");
    transporter.sendMail.mockResolvedValue({});

    await sendUserResetPasswordEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "Password Reset Email Sent... Please Check Your Email",
      info: {},
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "ahmed@gmail.com" });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userID: "653781b4ecea7412db9e9547" },
      expect.stringContaining("653781b4ecea7412db9e9547"),
      { expiresIn: "1d" }
    );
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_FROM,
      to: "ahmed@gmail.com",
      subject: "Marhaba - Password Reset Link",
      html: expect.stringContaining("http://localhost:3000/reset-password/?id=user-id&token=generated-token"),
    });
  });

  it("should return an error if the email does not exist", async () => {
    UserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

    await sendUserResetPasswordEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "Email doesn't exist",
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "ahmedtty@gmail.com" });
  });

  it("should return an error if the email field is missing", async () => {
    req.body.email = undefined;

    await sendUserResetPasswordEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "Email field is required",
    });
  });
});