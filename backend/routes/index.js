const express = require("express");

const router = express.Router();

// const userSignUpController = require("../controller/user/userSignUp")
// const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require("../controller/user/userDetails");
// import { sign } from 'jsonwebtoken'
const { auth, isBuyer, isSeller, isAdmin } = require("../middleware/auth");
// const authToken = require('../middleware/authToken')
const {
  login,
  signup,
  sendotp,
  // forgotPassword,
  // resetPassword,
  // updatePassword
} = require("../controller/Auth");
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
//   sendPaymentSuccessEmail,
} = require("../controller/Payments")
const userLogout = require('../controller/user/userLogout')
const allUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");
const UploadProductController = require("../controller/product/uploadProduct");
const getProductController = require("../controller/product/getProduct");
const updateProductController = require("../controller/product/updateProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const getProductDetails = require("../controller/product/getProductDetails");
const countAddToCartProduct = require("../controller/user/countAddToCartProduct");
const addToCartViewProduct = require("../controller/user/addToCartViewProduct");
const updateAddToCartProduct = require("../controller/user/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");
const searchProduct = require("../controller/product/searchProduct");
const filterProductController = require("../controller/product/filterProduct");
const deleteProductController = require("../controller/product/deleteProductAdmin");
const addToCartController = require("../controller/user/addToCartNikku");
const authToken = require("../middleware/authToken");
const addToCart = require("../controller/user/addToCart");
const updateQuantity = require("../controller/user/updateQuantity");
const deleteFromCart = require("../controller/user/deleteFromCart");
const showCart = require("../controller/user/showCart");
const countProductsInCart = require("../controller/user/countProductsInCart");
const emptyCart = require("../controller/user/emptyCart");
const updateUserDetailsController = require("../controller/user/updateAdditionalDetails");
const fetchUserAdditionalDetailsController = require("../controller/user/showAdditionalDetails");
const { updateMyOrders } = require("../controller/user/updateMyOrders");
const trackOrder = require("../controller/user/trackOrder");
const UploadBlogController = require("../controller/blog/uploadBlog");
const getBlogController = require("../controller/blog/getBlog");
const updateBlogController = require("../controller/blog/updateBlog");
const deleteBlogController = require("../controller/blog/deleteBlog");
const UploadCategoryController = require("../controller/category/uploadCategory");
const deleteCategoryController = require("../controller/category/deleteCategory");
const getCategoryController = require("../controller/category/getCategory");
const UploadOrderController = require("../controller/order/uploadOrder");
const getOrderController = require("../controller/order/getOrder");
const userDetailsByIdController = require("../controller/user/getUserById");
const updateOrderController = require("../controller/order/updateOrder");
const getBlogDetails = require("../controller/blog/getBlogDetail");
const { getOrderById } = require("../controller/order/getOrderById");
const addReviewController = require("../controller/product/addRatingController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.get("/user-details",authToken, userDetailsController);
router.post("/logout", userLogout);
// Route for Changing the password
// router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
// router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
// router.post("/reset-password", resetPassword)

//admin panel
router.get("/all-user", allUsers);
router.post("/update-user", updateUser);

//blog
router.post("/upload-blog", UploadBlogController);
router.get("/get-blog", getBlogController);
router.post("/update-blog", updateBlogController);
router.delete("/delete-blog", deleteBlogController);
router.post("/get-blog-details", getBlogDetails);

//category
router.post("/upload-category", UploadCategoryController);
router.delete("/delete-category", deleteCategoryController);
router.get("/get-category", getCategoryController);

//order
router.post("/upload-order", authToken, UploadOrderController);
router.get("/get-order",  getOrderController);
router.post("/get-order-id" , getOrderById);
router.post("/update-order",  updateOrderController);

//product
router.post("/upload-product", UploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", updateProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetails);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);
router.delete("/delete-product", deleteProductController);
router.post("/add-rating",authToken , addReviewController);
//user add to cart
router.post("/addtocart",authToken, addToCart);
router.get("/countAddToCartProduct",authToken, countProductsInCart);
router.get("/view-card-product",authToken, showCart);
router.post("/update-cart-product",authToken, updateQuantity);
router.post("/delete-cart-product",authToken, deleteFromCart);
router.post("/empty-cart",authToken, emptyCart);
router.get("/track-order/:id", trackOrder);

//user
router.get("/show-additional-details",authToken, fetchUserAdditionalDetailsController);
router.post("/edit-additional-details",authToken, updateUserDetailsController);
router.post("/update-userOrders",authToken, updateMyOrders);
router.get("/get-user-details/:userId",userDetailsByIdController);
router.post("/get-user-details",userDetailsByIdController);

//payments
router.post("/capturePayment",authToken, capturePayment)
router.post("/verifyPayment",authToken, verifyPayment)

module.exports = router;
