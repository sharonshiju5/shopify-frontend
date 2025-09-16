import axios from 'axios';
import React, { useEffect, useState } from 'react';
import APIURL from '../path';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../productpage/nav";
import OrderSuccessAnimation from './orderconformation';
import "../css/order.css"
import { ToastContainer, toast } from 'react-toastify';
import LoginPrompt from './LoginPrompt';
import OrderLoadingScreen from './orderprocessing';
import Footer from './footer';
import RazorpayPayment from '../productpage/payment';
import { PageLoader, ButtonLoader } from '../LoaderVariants';

const CartPage = () => {
  const [fullprice, setFullprice] = useState(0);
  const [product, setProducts] = useState([]);
  const [ordersucces, setordersucces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addres, setaddres] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedProducts = product.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setProducts(updatedProducts);
    // Recalculate total after updating quantity
    calculateTotal(updatedProducts);
  };

  const removeItem = async(id) => {
    const updatedProducts = product.filter(item => item._id !== id);
    try {
      const res = await axios.post(APIURL + "/removecart", { id });
      if (res.status==201) {
        // showsingleproduct()
        setProducts(updatedProducts);
        calculateTotal(updatedProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to calculate the total price
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
    setFullprice(total);
    return total;
  };
  
  const user_id = localStorage.getItem("userId");
  
  useEffect(() => {
    async function showsingleproduct() {
      try {
        setCartLoading(true);
        const res = await axios.post(APIURL + "/showcart", { user_id });
        console.log(res);
    
        if (res.status === 200) {
          const { cartItems, products } = res.data;
    
          // Update products to only contain the selected size
          const updatedProducts = products.map(product => {
            const cartItem = cartItems.find(item => item.product_id === product._id);
            return {
              ...product,
              selectedSize: cartItem ? cartItem.size : null, // Store the selected size
              sizes: cartItem ? [cartItem.size] : [], // Replace sizes array with only the selected size
            };
          });
    
          setProducts(updatedProducts);
          calculateTotal(updatedProducts);
        } else {
          setProducts([]);
          setFullprice(0);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
        setFullprice(0);
      } finally {
        setCartLoading(false);
      }
    }
    
    
    showsingleproduct();
  }, [user_id, ordersucces]);
console.log(product);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Function to select an address
  function selectAddress(address) {
    setSelectedAddress(address);
    setShowPaymentOptions(true);
  }

  // Function to close address modal
  function closeAddressModal() {
    setaddres([]);
    setSelectedAddress(null);
    setShowPaymentOptions(false);
  }

  // Prepare order data for Razorpay component
  const prepareOrderData = () => {
    if (!selectedAddress || !product.length || !user_id) return null;
    
    // Calculate total amount including shipping if applicable
    const totalAmount = fullprice > 2000 ? fullprice : fullprice + 250;
    
    return {
      product,
      user_id,
      address: selectedAddress,
      totalAmount
    };
  };

  // Handle payment success
  const handlePaymentSuccess = (data) => {
    console.log(data);
    toast.success("Order placed successfully!");
    setordersucces(true);
    setTimeout(() => {
      setordersucces(false);
      setLoading(false);
    }, 10000);
    closeAddressModal();
  };

  // Handle payment cancel
  const handlePaymentCancel = () => {
    setShowPaymentOptions(false);
  };

  async function ordertheproduct(address) {
    // For COD orders
    setaddres([]);
    setLoading(true);
    try {
      const res = await axios.post(APIURL + "/buyproduct", { product, user_id, address });
      console.log(res);
      if (res.status === 200) {
        const { msg } = res.data;
        toast.success(msg, {
          position: "top-right",
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setordersucces(true);
        setTimeout(() => {
          setordersucces(false);
          setLoading(false);
        }, 10000);
      }
    } catch (error) {
      if (error.response?.data.msg || error.message) {
        setLoading(false);
      }
      toast.error(error.response?.data.msg || error.message, {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error details:", error.response?.data || error.message);
    }
  }

  async function showaddress() {
    try {
      setAddressLoading(true);
      const userId = user_id;
      const res = await axios.post(APIURL + "/showaddress", { userId });
      console.log(res);
      if (res.status == 200) {
        const { address } = res.data;
        setaddres(address);
      }
    } catch (error) {
      console.log(error);
      toast.error("address not found" || error.message, {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setAddressLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {user_id ? (
        <>
          {ordersucces ? (
            <div className="flex-grow flex items-center mt-15 justify-center animate-appear">
              <OrderSuccessAnimation />
            </div>
          ) : (
            <>
              {loading ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100/75 backdrop-blur-sm z-50 animate-fade-in">
                  <div className="transform transition-all duration-300 scale-100 hover:scale-105">
                    <OrderLoadingScreen />
                  </div>
                </div>
              ) : ""}
              <div className="container mx-auto px-6 pb-16 flex-grow overflow-auto">
                {cartLoading ? (
                  <PageLoader text="Loading your cart..." />
                ) : (
                  <>
                    {/* Cart Table */}
                    <div className="overflow-x-auto max-w-full relative">          
                      <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b">
                        <th className="py-4 text-left">Product</th>
                        <th className="py-4 text-left">Price</th>
                        <th className="py-4 text-left">size</th>
                        <th className="py-4 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.map((item) => (
                        <tr key={item._id} className="border-b">
                          <td className="py-6">
                            <div className="flex items-center space-x-4">
                              <button onClick={() => removeItem(item._id)} className="text-red-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <img src={item.images && item.images[0]} alt={item.name} className="h-25" />
                              <span>{item.name}</span>
                            </div>
                          </td>
                                              
                          <td className="py-6">₹{item.price}</td>
                                              
                          {/* Added Size Column */}
                          <td className="py-6">
                            <span className="px-3 py-1 border rounded bg-gray-100 text-sm">
                              {item.selectedSize || (item.sizes && item.sizes[0]) || "N/A"}
                            </span>
                          </td>
                                              
                          <td className="py-6">
                            <div className="flex items-center border rounded-md w-24">
                              <input 
                                type="text" 
                                value={(item.quantity || 1).toString().padStart(2, '0')}
                                className="w-12 text-center py-1 border-none focus:outline-none"
                                readOnly
                              />
                              <div className="flex flex-col">
                                <button 
                                  onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                  className="px-1"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                                  className="px-1"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </td>
                                              
                          <td className="py-6">₹{item.price * (item.quantity || 1)}</td>
                        </tr>

                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cart Actions */}
                <div className="flex flex-col md:flex-row justify-between mt-8">
                  <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded mb-4 w-full md:w-auto hover:bg-gray-50">
                      <Link to={"/"}>
                        Return To Shop
                      </Link> 
                    </button>
                  </div>

                  <div className="w-full md:w-1/2 lg:w-2/5">
                    <div className="border rounded p-6">
                      <h3 className="font-medium text-lg mb-4">Cart Total</h3>
                      <div className="border-b pb-4">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>₹{fullprice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{fullprice > 2000 ? "Free shipping (Yoou saved 250 on this order" : product.length==0?"₹0":"₹250"}</span>
                        </div>
                      </div>
                      <div className="flex justify-between py-4">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">
                          ₹{(fullprice > 2000 ? fullprice : fullprice + 250).toFixed(2)}
                        </span>
                      </div>
                      {product.length === 0?
                      <Link to={"/"}>
                        <button 
                          onClick={showaddress} 
                          className="w-full bg-black text-white py-3 rounded ">
                         pleace add product to order 
                        </button>
                      </Link>
                      :
                      <button 
                      onClick={showaddress} 
                      className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600"
                      disabled={addressLoading}
                      >
                        {addressLoading ? <ButtonLoader text="Loading..." /> : "Proceed to Checkout"}
                      </button>
                      }
                    </div>
                  </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          
          {/* Address Modal with Payment Options */}
          {addres.length !== 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-gray-800 text-2xl font-bold">Saved Addresses</h2>
                  <button onClick={closeAddressModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {addres.map((address, index) => (
                    <div
                      key={index}
                      className={`
                        bg-gray-50 rounded-lg p-5 border shadow-sm transition-all cursor-pointer
                        ${selectedAddress && selectedAddress._id === address._id 
                          ? 'border-teal-500 ring-2 ring-teal-500/50' 
                          : 'border-gray-100 hover:border-teal-500'}
                      `}
                      onClick={() => selectAddress(address)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-teal-500 p-2 rounded-full mr-3">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-800 text-lg font-medium">{address.name}</p>
                        
                        {selectedAddress && selectedAddress._id === address._id && (
                          <div className="ml-auto bg-teal-500 text-white p-1 rounded-full">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="ml-2 pl-6 border-l-2 border-teal-500">
                        <p className="text-gray-600 my-2">{address.address}</p>
                        <p className="text-gray-500 text-sm">Pincode: {address.pincode}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedAddress && showPaymentOptions && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
                    <RazorpayPayment 
                      orderData={prepareOrderData()} 
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                    />
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between">
                <button onClick={closeAddressModal} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Cancel
                </button>
                <Link to={"/userprofile"}>
                  <button className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-400 transition-colors">
                    + Add New Address
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      {/* footer */}
      <Footer/>
      <ToastContainer/>
      </>
    ):(
    <div className='mt-10'>
      <LoginPrompt/>
    </div>
    )}
</div>
  );
};

export default CartPage;