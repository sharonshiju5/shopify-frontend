import { useState } from "react";
import axios from "axios";

const Checkout = ({ cartItems, userId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create an order on the backend
      const response = await axios.post("http://localhost:5000/api/buy-product", {
        product: cartItems,
        user_id: userId
      });

      const { order, key } = response.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key, // Razorpay public key
        amount: order.amount, // Amount in paise (e.g., ₹100 = 10000 paise)
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        order_id: order.id, // Razorpay Order ID
        handler: async (response) => {
          // Step 3: Send payment verification request to backend
          const verifyRes = await axios.post("http://localhost:5000/api/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.data.success) {
            alert("Payment Successful! Your order has been placed.");
            // Redirect to order confirmation page
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Your Name",
          email: "youremail@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
