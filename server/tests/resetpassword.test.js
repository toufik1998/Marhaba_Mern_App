const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userPasswordReset } = require("../controllers/authController"); 
jest.mock("../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("userPasswordReset", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      method: "",
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

  it("should verify the token and return success message if the request method is GET", () => {
    req.method = "GET";
    req.params.id = "user-id";
    req.params.token = "valid-token";

    jwt.verify.mockReturnValue(true);
    UserModel.findById.mockResolvedValue({ _id: "user-id" });

    userPasswordReset(req, res);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", expect.stringContaining("user-id"));
    expect(UserModel.findById).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "Valid Token",
    });
  });

  it("should return an error message if the token is invalid and the request method is GET", () => {
    req.method = "GET";
    req.params.id = "user-id";
    req.params.token = "invalid-token";

    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    userPasswordReset(req, res);

    expect(jwt.verify).toHaveBeenCalledWith("invalid-token", expect.any(String));
    expect(UserModel.findById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "Invalid Token",
    });
  });

  it("should update the password and return success message if the request method is POST and passwords match", async () => {
    req.method = "POST";
    req.params.id = "user-id";
    req.body.password = "new-password";
    req.body.password_confirmation = "new-password";

    const user = {
      _id: "user-id",
    };

    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashed-password");
    UserModel.findByIdAndUpdate.mockResolvedValue(user);

    await userPasswordReset(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("new-password", "salt");
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith("user-id", {
      $set: { password: "hashed-password" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "Password Reset Successfully",
    });
  });

  it("should return an error message if the request method is POST and passwords don't match", async () => {
    req.method = "POST";
    req.params.id = "user-id";
    req.body.password = "new-password";
    req.body.password_confirmation = "invalid-password";

    await userPasswordReset(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "New Password and Confirm New Password don't match",
    });
  });

  it("should return an error message if the request method is POST and fields are missing", async () => {
    req.method = "POST";
    req.params.id = "user-id";

    await userPasswordReset(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "All Fields are Required",
    });
  });

  it("should return an error message if the request method is neither GET nor POST", () => {
    req.method = "PUT";

    userPasswordReset(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "Method Not Allowed",
    });
  });

  it("should return an error message if an internal server error occurs", async () => {
    req.method = "POST";
   req.params.id = "user-id";
    req.body.password = "new-password";
    req.body.password_confirmation = "new-password";

    bcrypt.genSalt.mockRejectedValue(new Error("Some error message"));

    await userPasswordReset(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      message: "Internal Server Error",
    });
  });
});