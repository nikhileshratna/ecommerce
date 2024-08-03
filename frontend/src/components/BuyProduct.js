// import { toast } from "react-hot-toast";
import { toast } from 'react-toastify';

import Logo from "../assest/ecommercelogo.jpg";
import { setPaymentLoading } from "../slices/productSlice";
import { apiConnector } from "../services/apiConnector";
import SummaryApi from "../common";
import { emptyCart } from '../slices/cartSlice';

// Assuming `user` is defined at a higher scope in your actual usage
const BASE_URL = process.env.REACT_APP_BASE_URL;
const user = JSON.parse(localStorage.getItem("userData")) || null;
const PRODUCT_PAYMENT_API = BASE_URL + "/capturePayment";
const PRODUCT_VERIFY_API = BASE_URL + "/verifyPayment";

// Load the Razorpay SDK from the CDN
const addOrderToShiprocket = async (products, totalPrice, user) => {
  const shiprocketURL = "https://apiv2.shiprocket.in/v1/external";

  try {
    // Step 1: Login and get the token
    const loginResponse = await fetch(`${shiprocketURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": "dhananjaysharma2021@gmail.com",
        "password": "@Rock2024"
      })
    });

    const loginText = await loginResponse.text();
    console.log("Login Response Text:", loginText);
    const loginData = JSON.parse(loginText);
    const shiprocketToken = loginData.token;
    console.log("Login Data:", loginData);

    if (!loginResponse.ok || !shiprocketToken) {
      throw new Error('Login failed');
    }

    // Step 2: Create the order
    const payload = {
      "order_id": "4005",
      "order_date": "2024-07-24 11:11",
      "pickup_location": "haryana",
      "channel_id": "",
      "comment": "Reseller: M/s Goku",
      "billing_customer_name": "Naruto",
      "billing_last_name": "Uzumaki",
      "billing_address": "House 221B, Leaf Village",
      "billing_address_2": "Near Hokage House",
      "billing_city": "New Delhi",
      "billing_pincode": "110002",
      "billing_state": "Delhi",
      "billing_country": "India",
      "billing_email": "naruto@uzumaki.com",
      "billing_phone": "9876543210",
      "shipping_is_billing": true,
      "order_items": [
        {
          "name": "Kunai",
          "sku": "chakra123",
          "units": 10,
          "selling_price": "900",
          "hsn": 441122
        }
      ],
      "payment_method": "Prepaid",
      "shipping_charges": 0,
      "giftwrap_charges": 0,
      "transaction_charges": 0,
      "total_discount": 0,
      "sub_total": 9000,
      "length": 10,
      "breadth": 15,
      "height": 20,
      "weight": 2.5
    };

    console.log("Payload:", payload);

    const orderResponse = await fetch(`${shiprocketURL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shiprocketToken}`
      },
      body: JSON.stringify(payload)
    });

    const orderText = await orderResponse.text();
    console.log('Order Response Text:', orderText);

    // Attempt to parse the response as JSON
    let orderData;
    try {
      orderData = JSON.parse(orderText);
    } catch (error) {
      console.error('Failed to parse order response as JSON:', error);
      orderData = { error: orderText }; // Capture the response text in case of parsing error
    }

    console.log('Response from Shiprocket:', orderData);

    if (orderResponse.ok) {
      console.log('Order added successfully to Shiprocket!');
    } else {
      console.error('Failed to add order to Shiprocket:', orderData.message || orderData.error);
    }

    // Step 3: Logout
    const logoutResponse = await fetch(`${shiprocketURL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shiprocketToken}`
      }
    });

    // const logoutText = await logoutResponse.text();
    // console.log("Logout Response Text:", logoutText);

    // let logoutData;
    // try {
    //   logoutData = JSON.parse(logoutText);
    // } catch (error) {
    //   console.error('Failed to parse logout response as JSON:', error);
    //   logoutData = { error: logoutText }; // Capture the response text in case of parsing error
    // }

    // console.log("Logout Data:", logoutData);
    // if (logoutResponse.ok) {
    //   console.log('Logged out successfully from Shiprocket!');
    // } else {
    //   console.error('Failed to logout from Shiprocket:', logoutData.message || logoutData.error);
    // }

  } catch (error) {
    console.error('Error:', error);
  }
};



function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// Reset cart
const resetCart = async (token) => {
  try {
    console.log("emptyCart called");
    const response = await fetch(SummaryApi.emptyCart.url, {
      method: SummaryApi.emptyCart.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("emptyCart", responseData);

    if (responseData.success) {
      toast.success(responseData.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const editMyOrders = async (token, products) => {
  console.log("editMyOrders called with products:", products);
  try {
    const response = await fetch(SummaryApi.update_userOrders.url, {
      method: SummaryApi.update_userOrders.method,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        products,
      }),
    });

    const responseData = await response.json();
    console.log("editMyOrders response:", responseData);

    // if (responseData.success) {
    //   addOrderToShiprocket(products);
    // }



  } catch (error) {
    console.error("Error in editMyOrders:", error);
  }
};

// Buy the Product
export async function BuyProduct(products, total_amount, token, user, navigate, dispatch) {
  const toastId = toast.loading("Loading...");
  try {
    // Loading the script of Razorpay SDK
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      );
      return;
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      PRODUCT_PAYMENT_API,
      {
        total_amount
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    console.log(
      "PAYMENT RESPONSE FROM BACKEND............",
      orderResponse.data
    );

    // Opening the Razorpay SDK
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "Sidham",
      description: "Thank you for Purchasing product on our website.",
      image: Logo,
      prefill: {
        name: `${user.name}`,
        email: user.email,
      },
      handler: function (response) {
        verifyPayment({ ...response }, products, token, navigate, dispatch, user, total_amount);
      },
    };
    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.");
      console.log(response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR............", error);
    toast.error("Could Not make Payment.");
  }
  toast.dismiss(toastId);
}

// Verify the Payment
async function verifyPayment(bodyData, products, token, navigate, dispatch, user, toatalPrice) {
  const toastId = toast.loading("Verifying Payment...");
  console.log("PAYMENT VERIFY BODY DATA............", bodyData);
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", PRODUCT_VERIFY_API,
      {
        bodyData,
        products,
      },
      {
        Authorization: `Bearer ${token}`,
      });

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    await editMyOrders(token, products);
    await addOrderToShiprocket(products, toatalPrice, user);
    toast.success("Payment Successful. You will receive the product shortly.");
    localStorage.setItem("verifyPayment", true);
    resetCart(token);
    dispatch(emptyCart());
    navigate("/");
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error);
    toast.error("Could Not Verify Payment.");
    localStorage.setItem("verifyPayment", false);

  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}


// Send the Payment Success Email
// async function sendPaymentSuccessEmail(response, amount, token) {
//   try {
//     await apiConnector(
//       "POST",
//       SEND_PAYMENT_SUCCESS_EMAIL_API,
//       {
//         orderId: response.razorpay_order_id,
//         paymentId: response.razorpay_payment_id,
//         amount,
//       },
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     )
//   } catch (error) {
//     console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
//   }
// }
