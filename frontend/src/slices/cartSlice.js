import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state) => {
      state.totalItems++
    },
    removeFromCart: (state) => {
        state.totalItems--
    },
    emptyCart: (state) => {
      state.totalItems = 0
    },
    setCartCount: (state, value) => {
      state.totalItems = value.payload
    }
  },
})

export const { addToCart, removeFromCart, emptyCart, setCartCount } = cartSlice.actions

export default cartSlice.reducer
