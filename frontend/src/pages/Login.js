import React, { useContext, useEffect, useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Context from '../context';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authAPI";
import { gapi } from 'gapi-script';



const Login = () => {
    const clientId = "571441638341-45rnsf56sp2qa2tr5tbdd31m9b3jin7n.apps.googleusercontent.com";
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(data.email, data.password, navigate));
    };

    // useEffect(() => {
    //     function start() {
    //         if (!gapi.auth2.getAuthInstance()) {
    //             gapi.auth2.init({
    //                 clientId: clientId,
    //                 scope: "email profile"
    //             });
    //         }
    //     }
    
    //     gapi.load('client:auth2', start);
    // }, [clientId]);
    
    

    return (
        <div className='flex flex-col justify-center'>
            <section id='login'>
                <div className='mx-auto container p-4'>
                    <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                        <div className='w-20 h-20 mx-auto'>
                            <img src={loginIcons} alt='login icons'/>
                        </div>
                        <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                            <div className='grid'>
                                <label>Email: </label>
                                <div className='bg-slate-100 p-2'>
                                    <input 
                                        type='email' 
                                        placeholder='enter email' 
                                        name='email'
                                        value={data.email}
                                        onChange={handleOnChange}
                                        className='w-full h-full outline-none bg-transparent'/>
                                </div>
                            </div>
                            <div>
                                <label>Password: </label>
                                <div className='bg-slate-100 p-2 flex'>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder='enter password'
                                        value={data.password}
                                        name='password' 
                                        onChange={handleOnChange}
                                        className='w-full h-full outline-none bg-transparent'/>
                                    <div className='cursor-pointer text-xl' onClick={() => setShowPassword((prev) => !prev)}>
                                        <span>
                                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                        </span>
                                    </div>
                                </div>
                                <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                    Forgot password?
                                </Link>
                            </div>
                            <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>
                        </form>
                        <p className='my-5'>Don't have an account? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline'>Sign up</Link></p>
                    </div>
                </div>
            </section>
            <button className='mb-4 w-50 mx-auto '
            >
                <GoogleLoginButton loginType='login' />
            </button>
        </div>
    );
};

export default Login;
