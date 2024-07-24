import { toast } from "react-hot-toast";
import Logo from "../assest/ecommercelogo.jpg";
import { setPaymentLoading } from "../slices/productSlice";
import { apiConnector } from "../services/apiConnector";
import SummaryApi from "../common";
// import { studentEndpoints } from "../apis"

// const {
//   SEND_PAYMENT_SUCCESS_EMAIL_API,
// } = studentEndpoints

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PRODUCT_PAYMENT_API = BASE_URL + "/capturePayment";
const PRODUCT_VERIFY_API = BASE_URL + "/verifyPayment";

// Load the Razorpay SDK from the CDN
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

//reset cart
const resetCart = async (token) => {
  try {
    const response = await fetch(SummaryApi.emptyCart.url, {
      method: SummaryApi.emptyCart.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (responseData.success) {
      toast.success(responseData.message);
    }
  }
  catch(error) {
    console.log(error)
  }
};

// Buy the Course
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
        // sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifyPayment({ ...response },products, token, navigate, dispatch);
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
async function verifyPayment(bodyData, products, token , navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  console.log("PAYMENT VERIFY BODY DATA............", bodyData);
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", PRODUCT_VERIFY_API, 
      {
        bodyData,
        products
      }, 
      {
      Authorization: `Bearer ${token}`,
    });

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful. You will receive the product shortly.");
    navigate("/");
    resetCart(token);
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error);
    toast.error("Could Not Verify Payment.");
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
