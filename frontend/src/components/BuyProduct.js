import { toast } from "react-hot-toast";
import Logo from "../assest/ecommercelogo.jpg";
import { setPaymentLoading } from "../slices/productSlice";
import { apiConnector } from "../services/apiConnector";
import SummaryApi from "../common";

// Assuming `user` is defined at a higher scope in your actual usage
const BASE_URL = process.env.REACT_APP_BASE_URL;
const user = JSON.parse(localStorage.getItem("userData")) || null;
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

// Reset cart
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
    if (responseData.success) {
      toast.success(responseData?.message);
    } else if (responseData.error) {
      toast.error(responseData?.message);
    }
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
        verifyPayment({ ...response }, products, token, navigate, dispatch);
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
async function verifyPayment(bodyData, products, token, navigate, dispatch) {
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

    editMyOrders(token, products);
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
