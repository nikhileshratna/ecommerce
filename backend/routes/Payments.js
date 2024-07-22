// Import the required modules
const express = require("express");
const router = express.Router();
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  //   sendPaymentSuccessEmail,
} = require("../controller/Payments");
const { auth, isBuyer } = require("../middleware/auth");
router.post("/capturePayment", auth, isBuyer, capturePayment);
router.post("/verifyPayment", auth, isBuyer, verifyPayment);
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isStudent,
//   sendPaymentSuccessEmail
// )
// router.post("/verifySignature", verifySignature)

module.exports = router;
