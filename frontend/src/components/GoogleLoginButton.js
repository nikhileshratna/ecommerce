import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Context from "../context";
import { login, signUp } from "../services/operations/authAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import "./GoogleLoginButton.css";

const GoogleLoginButton = ({ loginType, accountType }) => {
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async (data) => {
    if (loginType === "signup") {
      console.log(loginType, "inside login function");
      const otp = -1;
      const signupData = {
        ...data,
        accountType,
        otp,
      };
      dispatch(
        signUp(
          signupData.accountType,
          signupData.name,
          signupData.email,
          signupData.password,
          signupData.confirmPassword,
          signupData.profilePic,
          signupData.otp,
          navigate
        )
      );
    } else {
      console.log(loginType, "inside else part");
      dispatch(login(data.email, data.password, navigate));
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      // Proceed with user data
      const user = result.user;
      if (loginType === "signup") {
        const newSignupData = {
          email: user.email,
          password: user.uid,
          name: user.displayName,
          confirmPassword: user.uid,
          profilePic: user.photoURL,
        };
        signin(newSignupData);
      } else {
        const newLoginData = {
          email: user.email,
          password: user.uid,
        };
        signin(newLoginData);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error.message, error.code);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-center cursor-pointer" onClick={googleLogin}>
        <button className="gsi-material-button">
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{ display: "block" }}
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
              {loginType === "signup" ? (
                <div>Signup with Google</div>
              ) : (
                <div>Login with Google</div>
              )}
            </span>
            <span style={{ display: "none" }}>
              {loginType === "signup" ? (
                <div>Signup with Google</div>
              ) : (
                <div>Login with Google</div>
              )}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GoogleLoginButton;
