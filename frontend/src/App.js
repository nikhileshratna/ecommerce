// import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import { getUserDetails } from './services/operations/profileAPI';
import { useNavigate } from 'react-router-dom';
import { setCartCount } from './slices/cartSlice';
import toast from 'react-hot-toast';

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [cartProductCount,setCartProductCount] = useState(0)

  // const fetchUserDetails = async()=>{
  //     const dataResponse = await fetch(SummaryApi.current_user.url,{
  //       method : SummaryApi.current_user.method,
  //       credentials : 'include'
  //     })

  //     const dataApi = await dataResponse.json()

  //     if(dataApi.success){
  //       dispatch(setUserDetails(dataApi.data))
  //     }
  // }

  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })

    const dataApi = await dataResponse.json()

    setCartProductCount(dataApi?.data?.count)
  }

  useEffect(()=>{
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
      const fetchData = async () => {
        const response = await fetch(SummaryApi.cartProductView.url, {
          method: SummaryApi.cartProductView.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        const responseData = await response.json();
    
        console.log("response data", responseData);
    
        if (responseData.success) {
          console.log("cart count", responseData?.cart.length);
          dispatch(setCartCount(responseData?.cart.length));
        }
        else{
          toast.error("Something went wrong while feftching cart data");
        }
      };

      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    /**user Details cart product */
    // fetchUserAddToCart()

  },[])
  return (
    <>
      <Context.Provider value={{
          fetchUserDetails: getUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        <Header/>
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet/>
        </main>
        <Footer/>
      </Context.Provider>
    </>
  );
}

export default App;
