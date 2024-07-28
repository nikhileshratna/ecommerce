import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Context from '../context';
import { login, signUp } from '../services/operations/authAPI';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

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
            dispatch(signUp(
                signupData.accountType,
                signupData.name,
                signupData.email,
                signupData.password,
                signupData.confirmPassword,
                signupData.profilePic,
                signupData.otp,
                navigate
            ));
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
                    password: user.uid
                };
                signin(newLoginData);
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    return (
        <div>
            <div
                className='flex justify-center cursor-pointer'
                onClick={googleLogin}
            >
                <img
                    src='https://developers.google.com/identity/images/g-logo.png'
                    width="60%"
                    alt="Google Sign-In"
                />
            </div>
        </div>
    );
};

export default GoogleLoginButton;
