import { GoogleLogin } from '@react-oauth/google';
import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Context from '../context';
import { login } from '../services/operations/authAPI';
import { signUp } from '../services/operations/authAPI';

const GoogleLoginButton = ({ loginType, accountType }) => {
    const user = useSelector(state => state.profile);
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

    const onSuccess = (res) => {
        console.log("Login Successful", res.profileObj);

        if (loginType === "signup") {
            console.log(loginType, "inside onSuccess function");

            const newSignupData = {
                email: res.profileObj.email,
                password: res.profileObj.googleId,
                name: res.profileObj.name,
                confirmPassword: res.profileObj.googleId,
                profilePic: res.profileObj.imageUrl,
            };

            signin(newSignupData);
        } else {
            console.log(loginType, "inside else part");

            const newLoginData = {
                email: res.profileObj.email,
                password: res.profileObj.googleId
            };

            signin(newLoginData);
        }
    };

    const onFailure = (res) => {
        console.log("Login Failed", res);
    };

    return (
        <div>
            <GoogleLogin
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
};

export default GoogleLoginButton;
