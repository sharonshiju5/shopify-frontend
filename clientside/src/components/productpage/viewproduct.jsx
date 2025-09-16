import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import APIURL from '../path';
import Nav from "./nav"
import { ToastContainer, toast } from 'react-toastify';
import RazorpayPayment from './payment';
import Footer from './footer';
import { PageLoader, ButtonLoader } from '../LoaderVariants';

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [singleprod, setsingleprod] = useState({});
  const [product, setproduct] = useState([]);
  const [cart, setcart] = useState(false); // Initialize to false explicitly
  const [addres, setaddres] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const user_id = localStorage.getItem("userId");
  const [sizes,setsize]=useState("")
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  
  useEffect(() => {
    async function showsingleproduct() {
      try {
        setLoading(true);
        const res = await axios.post(APIURL + "/showsingleproduct", { _id });
        const { singleprod } = res.data;
        setsingleprod(singleprod);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    showsingleproduct();
  }, [_id,addres]);

  // Function to check if product is in cart
  async function checkcart() {
    try {
      // console.log(_id);
      const res=await axios.post(APIURL+"/checkcart",{_id,user_id})
      // console.log(res.data);
      if (res.status==200) {
        setcart(true)
      }
      else{
        setcart(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  checkcart()
  
  // Run checkcart when component mounts and when user_id or _id changes
  useEffect(() => {
    if (user_id && _id) {
      checkcart();
    }
  }, [user_id, _id]);

  // Function to add product to cart
  async function addtocart(_id) {
    try {
      if (!user_id) {
        toast.error("Please login to add items to cart");
        return;
      }
      
      setCartLoading(true);
      console.log("Adding to cart:", _id);
      const res = await axios.post(APIURL + "/addtocart", { _id, user_id ,sizes,quantity});
      console.log("Add to cart response:", res);
      
      if (res.status === 201) {
        toast.success("Item added to cart");
        setcart(true); // Update state immediately
        await checkcart(); // Double-check with server
      }
    } catch (error) {
      console.log("Add to cart error:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setCartLoading(false);
    }
  }

  async function showaddress() {
    try {
      setAddressLoading(true);
      const userId = user_id;
      const res = await axios.post(APIURL + "/showaddress", { userId });
      if (res.status === 200) {
        const { address } = res.data;
        setaddres(address);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || error.message, {
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

  function selectAddress(address) {
    setSelectedAddress(address);
    setShowPaymentOptions(true);
  }

  function closeAddressModal() {
    setaddres([]);
    setSelectedAddress(null);
    setShowPaymentOptions(false);
  }

  // Prepare order data for Razorpay component
  const prepareOrderData = () => {
    if (!selectedAddress || !singleprod || !user_id) return null;
    
    // Create a product array with the single product
    const productArray = [{
      ...singleprod,
      quantity: quantity
    }];
    
    // Calculate total amount
    const price = singleprod.price || 0;
    const totalAmount = price * quantity;
    
    return {
      product: productArray,
      user_id,
      address: selectedAddress,
      totalAmount: totalAmount > 2000 ? totalAmount : totalAmount + 250
    };
  };

  const handlePaymentSuccess = (data) => {

console.log(data);
    toast.success("Order placed successfully!");
    setaddres([]);
    setSelectedAddress(null);
    setShowPaymentOptions(false);
  };

  const handlePaymentCancel = () => {
    setShowPaymentOptions(false);
  };
console.log(sizes);

  return (
    <>
      <Nav />
      {loading ? (
        <PageLoader text="Loading product details..." />
      ) : (
        <div className="max-w-7xl pt-18 mx-auto px-4">
        {/* Top Banner */}
        <div className="bg-black text-white text-center py-2 -mx-4"></div>
        <div className="flex gap-2 text-gray-500 my-4">
          <Link to={"/"}>
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>{singleprod.category}</span>
          <span>/</span>
          <span className="text-black">{singleprod.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          {/* Image Gallery */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              {singleprod?.images?.length > 0 ? (
                singleprod.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-20 h-20 border rounded cursor-pointer ${selectedImage === idx ? 'border-red-500' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="flex-1">
              {singleprod?.images?.length > 0 && selectedImage !== null ? (
                <img
                  src={singleprod.images[selectedImage]}
                  alt="Main product view"
                  className="w-full rounded-lg"
                />
              ) : (
                <p>No main image available</p>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">{singleprod.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">{'★'.repeat(4)}{'☆'.repeat(1)}</div>
              <span className="text-gray-500">({singleprod.stock})</span>
              <span className="text-green-500">
                {singleprod.stock === 0 ? "Out of stock" : "| In Stock:"}
              </span>
            </div>
            <div className="text-2xl font-semibold mb-4">₹{singleprod.price}</div>
            <p className="text-gray-600 mb-6">
              {singleprod.description}
            </p>
            
            {/* Size */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Size:</h3>
              <div className="flex gap-2">
                {singleprod?.sizes?.length > 0 ? (
                  singleprod.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded hover:bg-gray-100 ${sizes === size ? "bg-red-500" : "bg-white"}`}
                      onClick={()=>{setsize(size)}}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p>No sizes available</p>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            {/* <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity:</h3>
              <div className="flex items-center border rounded-md w-32">
                <button 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-3 py-1"
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity.toString().padStart(2, '0')}
                  className="w-16 text-center py-1 border-none focus:outline-none"
                  readOnly
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1"
                >
                  +
                </button>
              </div>
            </div> */}

            {/* Action buttons */}
            {user_id ? (
              <div className="flex gap-4 items-center mb-6">
                
                {cart ? (
                  sizes===""? 
                  <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                  choose size first
                  </button>:
                  <button
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => addtocart(singleprod._id)}
                    disabled={cartLoading}
                  >
                    {cartLoading ? <ButtonLoader text="Adding..." /> : "Add to cart"}
                  </button>
                ) : (
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    <Link to={"/cart"}>Go to cart</Link>
                  </button>
                )}
                <button 
                  onClick={showaddress} 
                  className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  disabled={singleprod.stock === 0 || addressLoading}
                >
                  {addressLoading ? <ButtonLoader text="Loading..." /> : "Buy Now"}
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center mb-6">
                <Link to={"/login"}>
                  <div className="flex items-center shadow-sm rounded">
                    <button className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded transition-all duration-300 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center space-x-2 group">
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>
                      <span className="relative inline-block overflow-hidden">
                        Please login to purchase
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                      </span>
                    </button>
                  </div>
                </Link>
              </div>
            )}

            {/* Delivery Info */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl">🚚</span>
                <div>
                  <h3 className="font-semibold">{singleprod.price > 2000 ? "Free Delivery" : "₹250 Delivery charge"}</h3>
                  <p className="text-gray-500">Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">↩️</span>
                <div>
                  <h3 className="font-semibold">Return Delivery</h3>
                  <p className="text-gray-500">Free 30 Days Delivery Returns. Details</p>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>

        {/* Address Modal */}
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
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProductDetail;