const { instance } = require("../config/razorpay")
const productModel = require("../models/productModel")
const crypto = require("crypto")
const userModel = require("../models/userModel")
// const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
// const {
//   courseEnrollmentEmail,
// } = require("../mail/templates/courseEnrollmentEmail")
// const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
// const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { products } = req.body
  const userId = req.userId
  if (products.length === 0) {
    return res.json({ success: false, message: "Please Provide Product ID" })
  }

  let total_amount = 0

  for (let i = 0 ; i < products.length ; i++) {
    let product
    const product_id = products[i]._id;
    const quantity = products[i].quantity;
    try {
      // Find the course by its ID
      product = await productModel.findById(product_id)

      // If the course is not found, return an error
      if (!product) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Product" })
      }

      // Add the price of the course to the total amount
      total_amount += product.price*quantity;
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.bodyData.razorpay_order_id
  const razorpay_payment_id = req.body?.bodyData.razorpay_payment_id
  const razorpay_signature = req.body?.bodyData.razorpay_signature
  const products = req.body?.products

  const userId = req.userId

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !products ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await sendProduct(products, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.userId

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await userModel.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// send the product to user
const sendProduct = async (products, userId, res) => {
  if (!products || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const productId of products) {
    try {
      // Send the product to user

      console.log("Product Sent successfully");

      // Send an email notification to the enrolled student
    //   const emailResponse = await mailSender(
    //     enrolledStudent.email,
    //     `Successfully Enrolled into ${enrolledCourse.courseName}`,
    //     courseEnrollmentEmail(
    //       enrolledCourse.courseName,
    //       `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
    //     )
    //   )

    //   console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}