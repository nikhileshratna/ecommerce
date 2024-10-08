import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';

import Logo from "../assest/ecommercelogo.jpg";
import { setPaymentLoading } from "../slices/productSlice";
import { apiConnector } from "../services/apiConnector";
import SummaryApi from "../common";
import { emptyCart } from '../slices/cartSlice';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PRODUCT_PAYMENT_API = `${BASE_URL}/capturePayment`;
const PRODUCT_VERIFY_API = `${BASE_URL}/verifyPayment`;
const EMAIL = process.env.REACT_APP_SHIPROCKET_EMAIL;
const PASSWORD = process.env.REACT_APP_SHIPROCKET_PASS;

const makeDataObject = (products,token, paymentStatus) => {
    const data = { 
        productIds: [],
        quantities: [],
        paymentStatus: paymentStatus,
        token : token
    };

    // Map through products and populate productIds and quantities
    products.forEach(product => {
        data.productIds.push(product.productId._id); // Push product ID
        data.quantities.push(product.quantity); // Push product quantity
    });

    return data;
};


const generateUniqueOrderId = () => {
    const timestamp = Date.now();
    const randomComponent = CryptoJS.lib.WordArray.random(16).toString(); // Generates a random string
    return `ORD-${timestamp}-${randomComponent}`;
};

const addOrderToShiprocket = async (products, totalPrice, user, token , cod) => {
    console.log("products", products);

    const shiprocketURL = "https://apiv2.shiprocket.in/v1/external";

    try {
        const loginResponse = await fetch(`${shiprocketURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": EMAIL,
                "password": PASSWORD
            })
        });

        const loginData = await loginResponse.json();
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
            "payment_method":`${cod ? "COD" : "Prepaid"}`,
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

        const orderData = await orderResponse.json();
        editMyOrders(token, products, orderData?.shipment_id , cod);

        if (orderResponse.ok) {
            console.log('Order added successfully to Shiprocket!');
        } else {
            console.error('Failed to add order to Shiprocket:', orderData.message || orderData.error);
        }

        await fetch(`${shiprocketURL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${shiprocketToken}`
            }
        });

        
      
        //   const responseData = await response.json();
      
        //   if (responseData.success) {
        //     toast.success(responseData.message);
        //     onClose();
        //     fetchData();
        //   } else {
        //     toast.error(responseData.message);
        //   }
       




    } catch (error) {
        console.error('Error:', error);
    }
};

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

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

const editMyOrders = async (token, products, shipment_id, cod) => {
    try {
        // First API call
        const response = await fetch(SummaryApi.uploadMyOrder.url, {
            method: SummaryApi.uploadMyOrder.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(makeDataObject(products, token, cod ? "COD" : "Prepaid")),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("uploadMyOrder response:", responseData?.data);

        // Check if we have a valid order ID from the first response
        if (!responseData.data || !responseData.data._id) {
            throw new Error("No valid order ID received from uploadMyOrder");
        }

        // Second API call
        const response2 = await fetch(SummaryApi.update_userOrders.url, {
            method: SummaryApi.update_userOrders.method,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                orderId: responseData.data._id,
                shipment_id: shipment_id 
            }),
        });

        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
        }

        const responseData2 = await response2.json();
        console.log("update_userOrders response:", responseData2);

        return responseData2;
    } catch (error) {
        console.error("Error in editMyOrders:", error);
        throw error;
    }
};


export async function BuyProduct(products, total_amount, token, user, navigate, dispatch, data , cod) {
    // console.log("cod:",cod);
    if(cod){
        const toastId1 = toast.loading("Loading...");
        await addOrderToShiprocket(data, total_amount, user, token , cod);
        toast.dismiss(toastId1);
        toast.success("Order placed successfully");
        toast.success("Order will be delivered soon");
        resetCart(token);
        navigate("/");
        
        return;
    }
    console.log("base:", BASE_URL);
    const toastId = toast.loading("Loading...");
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Check your Internet Connection.");
            return;
        }

        const orderResponse = await apiConnector(
            "POST",
            PRODUCT_PAYMENT_API,
            { total_amount },
            { Authorization: `Bearer ${token}` }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data);

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
                verifyPayment({ ...response }, products, token, navigate, dispatch, user, total_amount, data);
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

async function verifyPayment(bodyData, products, token, navigate, dispatch, user, totalPrice, data) {
    const toastId = toast.loading("Verifying Payment...");
    console.log("PAYMENT VERIFY BODY DATA............", bodyData);
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector(
            "POST",
            PRODUCT_VERIFY_API,
            { bodyData, products },
            { Authorization: `Bearer ${token}` }
        );

        console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        await addOrderToShiprocket(data, totalPrice, user, token);
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
