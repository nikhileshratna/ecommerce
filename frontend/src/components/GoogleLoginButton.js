import { GoogleLogin } from 'react-google-login';
import React, { useContext, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GoogleLoginButton = ({ loginType }) => {
    const user = useSelector(state => state?.user?.user)
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
    const navigate = useNavigate();
    const clientId = "571441638341-45rnsf56sp2qa2tr5tbdd31m9b3jin7n.apps.googleusercontent.com";

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [signupData, setSignupData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: ""
    });

    const login = async (data) => {
        if (loginType === "signup") {
            console.log(loginType, "inside login function");
            const dataResponse = await fetch(SummaryApi.signUP.url, {
                method: SummaryApi.signUP.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                toast.success(dataApi.message);
                navigate("/login");
            }

            if (dataApi.error) {
                toast.error(dataApi.message);
            }
        } else {
            console.log(loginType, "inside else part");
            try {
                const response = await fetch(SummaryApi.signIn.url, {
                    method: SummaryApi.signIn.method,
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const dataApi = await response.json();

                if (dataApi.success) {
                    toast.success(dataApi.message);
                    navigate('/');
                    fetchUserDetails();
                    fetchUserAddToCart();
                    console.log(dataApi);
                    // user.setUser(dataApi);
                } else if (dataApi.error) {
                    toast.error(dataApi.message);
                }
            } catch (error) {
                console.error('Failed to fetch', error);
                toast.error('An error occurred while logging in.');
            }
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

            // setSignupData(newSignupData);
            login(newSignupData);
        } else {
            console.log(loginType, "inside else part");

            const newLoginData = {
                email: res.profileObj.email,
                password: res.profileObj.googleId
            };

            // setLoginData(newLoginData);
            login(newLoginData);
        }
    };

    const onFailure = (res) => {
        console.log("Login Failed", res);
    };

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
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
