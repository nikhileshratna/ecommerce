// import { toast } from "react-hot-toast";
import { toast } from 'react-toastify';

import Logo from "../assest/ecommercelogo.jpg";
import { setPaymentLoading } from "../slices/productSlice";
import { apiConnector } from "../services/apiConnector";
import SummaryApi from "../common";
import { emptyCart } from '../slices/cartSlice';

// Assuming `user` is defined at a higher scope in your actual usage
const BASE_URL = process.env.REACT_APP_BASE_URL;
const PRODUCT_PAYMENT_API = BASE_URL + "/capturePayment";
const PRODUCT_VERIFY_API = BASE_URL + "/verifyPayment";

const crypto = require('crypto');

const generateUniqueOrderId = () => {
    const timestamp = Date.now();
    const randomComponent = crypto.randomBytes(8).toString('hex'); // Generates a longer random hex string
    return `ORD-${timestamp}-${randomComponent}`;
};

// Example usage in addOrderToShiprocket
const addOrderToShiprocket = async (products, totalPrice, user) => {
  console.log("products", products);

  const shiprocketURL = "https://apiv2.shiprocket.in/v1/external";

  try {
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
    const loginData = JSON.parse(loginText);
    const shiprocketToken = loginData.token;

    if (!loginResponse.ok || !shiprocketToken) {
      throw new Error('Login failed');
    }

    const orderItems = products.map(product => ({
      "name": product.productId.productName,
      "sku": product.productId._id,
      "units": product.quantity,
      "selling_price": product.productId.sellingPrice,
      "hsn": "441122"
    }));

    const uniqueOrderId = generateUniqueOrderId();
    const payload = {
      "order_id": uniqueOrderId,
      "order_date": new Date().toISOString(),
      "pickup_location": "haryana",
      "channel_id": "",
      "comment": "Reseller: M/s Goku",
      "billing_customer_name": user?.name,
      "billing_last_name": "",
      "billing_address": user?.additionalDetails?.address1,
      "billing_address_2": user?.additionalDetails?.address2 || "",
      "billing_city": user?.additionalDetails?.city,
      "billing_pincode": user?.additionalDetails?.pincode,
      "billing_state": user?.additionalDetails?.state,
      "billing_country": user?.additionalDetails?.country,
      "billing_email": user?.email,
      "billing_phone": user?.additionalDetails?.contactNumber,
      "shipping_is_billing": true,
      "order_items": orderItems,
      "payment_method": "Prepaid",
      "shipping_charges": 0,
      "giftwrap_charges": 0,
      "transaction_charges": 0,
      "total_discount": 0,
      "sub_total": totalPrice,
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

    let orderData;
    try {
      orderData = JSON.parse(orderText);
    } catch (error) {
      orderData = { error: orderText };
    }

    if (orderResponse.ok) {
      console.log('Order added successfully to Shiprocket!');
    } else {
      console.error('Failed to add order to Shiprocket:', orderData.message || orderData.error);
    }

    const logoutResponse = await fetch(`${shiprocketURL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shiprocketToken}`
      }
    });

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
export async function BuyProduct(products, total_amount, token, user, navigate, dispatch , data) {
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
        verifyPayment({ ...response }, products, token, navigate, dispatch, user, total_amount , data);
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
async function verifyPayment(bodyData, products, token, navigate, dispatch, user, toatalPrice , data) {
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
    await addOrderToShiprocket(data, toatalPrice, user);
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
