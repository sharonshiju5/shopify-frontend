import { useEffect, useState } from "react";
import axios from "axios";
import APIURL from "../path";
import { ToastContainer, toast } from 'react-toastify';
import Editproduct from "./editproduct";
import { Tag } from 'lucide-react';
import sound from "../../assets/sound.mp3"
import  "../css/sellerproduct.css";
import { motion } from "framer-motion";
import { PageLoader, ButtonLoader, ProductLoader } from '../LoaderVariants';
const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [productid, setProductid] = useState("");
    const[block,setblock]=useState(true)
    const [isOpen, setIsOpen] = useState(false);
    const[deltproduct,setdeltproduct]=useState()
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [offerLoading, setOfferLoading] = useState(false);
    const [blockLoading, setBlockLoading] = useState(false);
    const userId = localStorage.getItem("userId"); 
    

    if (!userId) {
      setError("Seller ID not found. Please log in.");
      setLoading(false);
      return;
    }
        async function fetchproduct() {
          try {
                setLoading(true);
                const res = await axios.post(APIURL + "/fetchproduct", {userId})
                console.log(res);
                const {products}=res.data
                console.log(products);
                setProducts(products)
              } catch (error) {
                setError("Failed to load products");
              } finally {
                setLoading(false);
              }
            }
    useEffect(() => {
        fetchproduct()
    }, [userId,block]);


    async function deleteProduct() {
      const productId=deltproduct
      console.log(productId);
      
        try {
          setDeleteLoading(true);
          setIsOpen(false);
          
            const res = await axios.post(APIURL + "/deleteproduct", {productId})
            const{msg}=res.data
            console.log(res);
            console.log(msg);
            if (res.status==201) {
              const audio = new Audio(sound);
              audio.play();
              toast.success(msg, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
                setTimeout(() => {
                  fetchproduct()
                }, 1500);
            }
            
        } catch (error) {
            
        } finally {
          setDeleteLoading(false);
        }
    }


    function showeditproduct(prodId){
        setProductid(prodId)
        setShow(false)
    }
    
    async function addoffer(_id,offer) {
        try {
            setOfferLoading(true);
            const res = await axios.post(APIURL + "/addoffer",{_id,offer} )
            const{msg}=res.data
            if (res.status==200) {
                toast.success(msg, {
                  position: "top-right",
                  autoClose: 700,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setOfferLoading(false);
        }
    }

    async function blockProduct(_id) {
        try {
            setBlockLoading(true);
            const res = await axios.post(APIURL + "/block",{_id} )
            const{msg}=res.data
            if (res.status==201) {
                toast.success(msg, {
                  position: "top-right",
                  autoClose: 700,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                setblock(!block)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setBlockLoading(false);
        }
    }

    return (
      <div className="p-2 w-full">
      <h2 className="text-xl font-semibold mb-4">Your Products</h2>
    
      {error && <p className="text-red-500">{error}</p>}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[...Array(6)].map((_, index) => (
            <ProductLoader key={index} />
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 && <p>No products found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {products.map(product => (
          <div key={product._id} className="border p-3 md:p-4 rounded-lg shadow-lg flex flex-col">
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-md bg-gray-100">
              <img 
                src={product.images?.[0] || "https://via.placeholder.com/150"} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <h3 className="font-bold mt-2 text-sm md:text-base truncate">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.offer}% off</p>
            <p className="text-gray-600 text-sm">${product.price}</p>
            <p className="text-xs md:text-sm text-gray-500">Stock: {product.stock}</p>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mt-2">
              <h3 className="text-gray-700 font-medium text-xs md:text-sm my-auto">Add Offers</h3>
              <div className="grid grid-cols-2 gap-1 md:gap-2 flex-grow">
                <button 
                  onClick={() => addoffer(product, 15)}  
                  className="group relative bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-0.5 px-1 md:px-2 rounded transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md h-6 whitespace-nowrap"
                >
                  <Tag size={13} className="inline-block" />
                  <span>15% OFF</span>
                </button>
                
                <button 
                  onClick={() => addoffer(product, 30)} 
                  className="group relative bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-0.5 px-1 md:px-2 rounded transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md h-6 whitespace-nowrap"
                >
                  <Tag size={13} className="inline-block" />
                  <span>30% OFF</span>
                </button>
                
                <button 
                  onClick={() => addoffer(product, 60)} 
                  className="group relative bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-0.5 px-1 md:px-2 rounded transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md h-6 whitespace-nowrap"
                >
                  <Tag size={13} className="inline-block" />
                  <span>60% OFF</span>
                </button>
                
                <button 
                  onClick={() => addoffer(product, 0)} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs py-0.5 px-1 md:px-2 rounded transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md h-6 whitespace-nowrap"
                >
                  <span>Full Price</span>
                </button>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex flex-wrap justify-end gap-2">
              {product.block ? (
                <button 
                  onClick={() => blockProduct(product._id)} 
                  className="bg-gray-500 hover:bg-gray-600 text-white text-xs md:text-sm font-medium py-1 md:py-1.5 px-2 md:px-4 rounded-lg transition duration-300"
                >
                  UN Block
                </button>
              ) : (
                <button 
                  onClick={() => blockProduct(product._id)} 
                  className="bg-gray-500 hover:bg-gray-600 text-white text-xs md:text-sm font-medium py-1 md:py-1.5 px-2 md:px-4 rounded-lg transition duration-300"
                >
                  Block
                </button>
              )}
            
              <a href="#edit">
                <button 
                  onClick={() => showeditproduct(product)} 
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-medium py-1 md:py-1.5 px-2 md:px-4 rounded-lg transition duration-300 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 md:h-4 md:w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
              </a>
            
              
                <div className="flex justify-center items-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium py-1 md:py-1.5 px-2 md:px-4 rounded-lg transition duration-300 flex items-center"
                    onClick={() => {setIsOpen(true);setdeltproduct(product._id)}}
                  ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                    Delete
                  </button>

                  {isOpen && (
                    <motion.div
                      className="fixed inset-0 bg-opacity-50 flex justify-center items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center w-80"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                      >
                        <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-4">
                          Are you sure you want to delete <strong>{product.name}</strong>?
                        </p>
                  
                        <div className="flex justify-between">
                          <button
                            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => deleteProduct()}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium py-1 md:py-1.5 px-2 md:px-4 rounded-lg transition duration-300 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 md:h-4 md:w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delete
                            </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
            </div>
          </div>
            ))}
          </div>
        </>
      )}
      
      <ToastContainer />
      
      {!show && (
        <div id="edit" className="mt-4 p-3 border rounded-lg shadow-md">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1 px-4 rounded-lg mb-4">
            cancel
          </button>
          <Editproduct prodId={productid}/>
        </div>
      )}
    </div>
    );
};

export default SellerProducts;
