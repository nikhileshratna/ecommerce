const { response } = require("express");
const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    // Extracting JWT from request cookies, body or header
		const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(200).json({
        message: "Please Login...!",
        error: true,
        success: false,
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
      console.log(err);
      console.log("decoded", decoded);

      if (err) {
        console.log("error auth", err);
      }
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      data: [],
      error: true,
      success: false,
    });
  }
}

module.exports = authToken;
