import React, { useContext, useEffect, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import GoogleLoginButton from '../components/GoogleLoginButton';
import {gapi} from 'gapi-script'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/operations/authAPI";

const Login = () => {
    const clientId = "571441638341-45rnsf56sp2qa2tr5tbdd31m9b3jin7n.apps.googleusercontent.com"
    console.log(clientId);
    // const { user } = useSelector((state) => state.profile);
    const [showPassword,setShowPassword] = useState(false)
    const [data,setData] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(login(data.email, data.password, navigate));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //         const response = await fetch(SummaryApi.signIn.url, {
    //             method: SummaryApi.signIn.method,
    //             body: JSON.stringify(data)
    //         });
    
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    
    //         const dataApi = await response.json();
    
    //         if (dataApi.success) {
    //             toast.success(dataApi.message);
    //             navigate('/');
    //             fetchUserDetails();
    //             fetchUserAddToCart();
    //             console.log(dataApi);
    //             // user.setUser(dataApi);
    //         } else if (dataApi.error) {
    //             toast.error(dataApi.message);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch', error);
    //         toast.error('An error occurred while logging in.');
    //     }
    // };
    
    useEffect(() => {
        function start(){
            gapi.client.init({
                clientId : clientId,
                scope: "email profile"
            })};
        
            gapi.load('client:auth2' , start);

    });

   

    // console.log("data login",data)
    
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
                                <label>Email : </label>
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
                                <label>Password : </label>
                                <div className='bg-slate-100 p-2 flex'>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder='enter password'
                                        value={data.password}
                                        name='password' 
                                        onChange={handleOnChange}
                                        className='w-full h-full outline-none bg-transparent'/>
                                    <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                                        <span>
                                            {
                                                showPassword ? (
                                                    <FaEyeSlash/>
                                                )
                                                :
                                                (
                                                    <FaEye/>
                                                )
                                            }
                                        </span>
                                    </div>
                                </div>
                                <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                    Forgot password ?
                                </Link>
                            </div>

                            <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>

                            

                        </form>


                        <p className='my-5'>Don't have account ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline'>Sign up</Link></p>
                </div>


            </div>
        
        </section>
        <button className='mb-4'>
          <GoogleLoginButton loginType = {'login'}/>
        </button>
    </div>
  )
}

export default Login;
