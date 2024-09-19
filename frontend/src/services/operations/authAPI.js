// import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { emptyCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BASE_URL

const SENDOTP_API = `${BASE_URL}/sendotp`
const SIGNUP_API = `${BASE_URL}/signup`
const LOGIN_API = `${BASE_URL}/login`
const GOOGLE_AUTH_API = `${BASE_URL}/google-login`
// const RESETPASSTOKEN_API = `${BASE_URL}/reset-password-token`
// const RESETPASSWORD_API = `${BASE_URL}/reset-password`

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      if(error.response.data.message === "User is Already Registered"){
        console.log("user is already registered");
        console.log("SENDOTP API ERROR............", error);
        toast.error("User is Already Registered")
        navigate("/login")
      }
      else {
        console.log("other error");
        console.log("SENDOTP API ERROR............", error)
        toast.error("Could Not Send OTP")
      }
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  name,
  email,
  password,
  confirmPassword,
  profilePic,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        name,
        email,
        password,
        confirmPassword,
        profilePic,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/sign-up")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser({...response.data.user}))
      console.log("login response", response);
      localStorage.setItem("token", JSON.stringify(response.data.token))
      navigate("/")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
      navigate("/login")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)

  }
}

export function googleLogin(userData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in with Google...")
    dispatch(setLoading(true))
    console.log("userData",userData);
    try {
      const response = await apiConnector("POST", GOOGLE_AUTH_API, {
        userData, 
      })

      console.log("GOOGLE LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Google Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser({...response.data.user}))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      navigate("/")
    } catch (error) {
      console.log("GOOGLE LOGIN API ERROR............", error)
      toast.error("Google Login Failed")
      navigate("/login")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// export function getPasswordResetToken(email, setEmailSent) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true))
//     try {
//       const response = await apiConnector("POST", RESETPASSTOKEN_API, {
//         email,
//       })

//       console.log("RESETPASSTOKEN RESPONSE............", response)

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }

//       toast.success("Reset Email Sent")
//       setEmailSent(true)
//     } catch (error) {
//       console.log("RESETPASSTOKEN ERROR............", error)
//       toast.error("Failed To Send Reset Email")
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false))
//   }
// }

// export function resetPassword(password, confirmPassword, token) {
//   return async(dispatch) => {
//     dispatch(setLoading(true));
//     try{
//       const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

//       console.log("RESET Password RESPONSE ... ", response);


//       if(!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       toast.success("Password has been reset successfully");
//     }
//     catch(error) {
//       console.log("RESET PASSWORD TOKEN Error", error);
//       toast.error("Unable to reset password");
//     }
//     dispatch(setLoading(false));
//   }
// }

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(emptyCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
