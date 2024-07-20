import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "../slices/productSlice";
import cartReducer from "../slices/cartSlice";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  auth: authReducer,
  profile: profileReducer,
});

export default rootReducer;
