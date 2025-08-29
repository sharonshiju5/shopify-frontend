import React from 'react';
import axios from 'axios';
import APIURL from '../path';
import { toast } from 'react-toastify';

const RazorpayPayment = ({ orderData, onSuccess, onCancel }) => {
  const { product, user_id, address, totalAmount } = orderData || {};

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
        toast.error("Razorpay SDK failed to load. Check your internet connection");
      };
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    const res = await initializeRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Calculate the total amount from products
    const calculatedAmount = product.reduce(
      (sum, item) => sum + (item.price * (item.quantity || 1)), 
      0
    );
    
    // Add shipping if needed (free for orders over 2000)
    const finalAmount = calculatedAmount > 2000 ? calculatedAmount : calculatedAmount + 250;
    
    try {
      // Create order on your backend
      const orderResponse = await axios.post(`${APIURL}/create-razorpay-order`, {
        amount: finalAmount * 100, // Razorpay expects amount in paise
        currency: "INR"
      });
      
      if (!orderResponse.data.id) {
        toast.error("Server error. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_uyJ0fRCB1C8Y7l", // Replace with your actual key from dashboard
        amount: finalAmount * 100,
        currency: "INR",
        name: "Your E-commerce Store",
        description: "Purchase Transaction",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          // Verify payment with your backend
          const data = {
            orderCreationId: orderResponse.data.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            product: product,
            user_id: user_id,
            address: address
          };

          const paymentVerifyResponse = await axios.post(`${APIURL}/verify-payment`, data);
          
          if (paymentVerifyResponse.status === 200) {
            toast.success("Payment successful!");
            onSuccess && onSuccess(paymentVerifyResponse.data);
          } else {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: address?.name || "",
          email: "", // You could store email in user profile and fetch it
          contact: "" // Similarly for contact
        },
        notes: {
          address: `${address?.address || ""}, ${address?.pincode || ""}`
        },
        theme: {
          color: "#F37254"
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
            onCancel && onCancel();
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.msg || "Payment initialization failed");
    }
  };

  return (
    <button 
      onClick={makePayment}
      disabled={!orderData || !product || !user_id || !address}
      className={`px-6 py-2 rounded font-medium focus:outline-none focus:ring-2 
        ${!orderData || !product || !user_id || !address 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'bg-teal-500 text-white hover:bg-teal-600'}`}
    >
      Pay with Razorpay
    </button>
  );
};

export default RazorpayPayment;