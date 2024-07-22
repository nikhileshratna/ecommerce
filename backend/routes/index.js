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
const userLogout = require('../controller/user/userLogout')
const allUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");
const UploadProductController = require("../controller/product/uploadProduct");
const getProductController = require("../controller/product/getProduct");
const updateProductController = require("../controller/product/updateProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const getProductDetails = require("../controller/product/getProductDetails");
const addToCartController = require("../controller/user/addToCartController");
const countAddToCartProduct = require("../controller/user/countAddToCartProduct");
const addToCartViewProduct = require("../controller/user/addToCartViewProduct");
const updateAddToCartProduct = require("../controller/user/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");
const searchProduct = require("../controller/product/searchProduct");
const filterProductController = require("../controller/product/filterProduct");
const deleteProductController = require("../controller/product/deleteProductAdmin");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.get("/user-details", userDetailsController);
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
router.post("/update-user", auth, updateUser);

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

//user add to cart
router.post("/addtocart", addToCartController);
router.get("/countAddToCartProduct", countAddToCartProduct);
router.get("/view-card-product", addToCartViewProduct);
router.post("/update-cart-product", updateAddToCartProduct);
router.post("/delete-cart-product", deleteAddToCartProduct);

module.exports = router;
