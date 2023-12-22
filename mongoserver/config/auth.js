
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  console.log(token);
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token provided!",
      data: []
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized!",
        data: []
      });
    }
    req.username = decoded.username;
    console.log(req.username);
    next();
  });
  // next();
};


exports.verifyOTPToken = (req, res, next) => {
  let token = req.headers["otp_token"];
  console.log(token);
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No OTP token provided!",
      data: []
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized OTP token!",
        data: []
      });
    }
    req.otp_token_id = decoded.id;
    console.log(decoded);
    next();
  });
  // next();
};

exports.verifyForgotPassToken = (req, res, next) => {
  let token = req.headers["forgot_pass_token"];
  console.log(token);
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No OTP token provided!",
      data: []
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized OTP token!",
        data: []
      });
    }
    req.forgot_pass_token_id = decoded.id;
    console.log(decoded);
    next();
  });
  // next();
};

exports.generateToken = async (data) => {
  console.log('generateToken Data :: ', data)
  data.iat = Date.now()
  // eslint-disable-next-line no-undef
  const token = jwt.sign({ data }, process.env.SECRET || '', {
    expiresIn: '7d',
  });
  return token;
}