// Import the required modules
const express = require("express");
const router = express.Router();
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
//   sendPaymentSuccessEmail,
} = require("../controller/Payments")
const { auth } = require("../middleware/auth")
const { authToken } = require("../middleware/authToken")
router.post("/capturePayment",auth, capturePayment)
router.post("/verifyPayment",auth, verifyPayment)
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isStudent,
//   sendPaymentSuccessEmail
// )
// router.post("/verifySignature", verifySignature)

module.exports = router;
