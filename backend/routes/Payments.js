// Import the required modules
const express = require("express");
const router = express.Router();
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
//   sendPaymentSuccessEmail,
} = require("../controller/Payments")
const { authToken } = require("../middleware/authToken")
router.post("/capturePayment", authToken, capturePayment)
router.post("/verifyPayment", authToken, verifyPayment)
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isStudent,
//   sendPaymentSuccessEmail
// )
// router.post("/verifySignature", verifySignature)

module.exports = router;
