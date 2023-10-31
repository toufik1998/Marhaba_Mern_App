const jwt = require("jsonwebtoken");

class jwtToken {
  static generateToken = async (user) => {
    const token = await jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });

    return token;
  };

  static verifyToken = async (req, res, next) => {
    try {
      const token = req.params.token || req.cookies._cks_ui || req.body.token;
      if (!token)
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });

      const decoded = await this.decoded(token);

      if (!decoded)
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      req.userData = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
  };

  static decoded = async (user) => {
    const decoded = await jwt.verify(user, process.env.PRIVATEKEY);
    return decoded;
  };
  static RefreshToken = (req, res) => {};
}

module.exports = jwtToken;