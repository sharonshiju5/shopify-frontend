import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link,useNavigate ,useParams } from "react-router-dom";
import APIURL from '../path';
import { Heading1 } from 'lucide-react';
import Navbar from './nav';
import Footer from './footer';
import { PageLoader, ProductLoader } from '../LoaderVariants';

const WishlistPage = () => {
  const navigate=useNavigate()

  const [wishlistItems,setwishlist ]=useState([])
  const [_id,setId]=useState("")
  const [loading, setLoading] = useState(true);

  const { category } = useParams();
  console.log(category);
  const user_id=localStorage.getItem("useId")
  useEffect(()=>{

    async function filter() {
      try {
        setLoading(true);
        const res=await axios.post(APIURL+"/filter",{category,user_id})
        // console.log(res);
        const{product}=res.data
        setwishlist(product)
        console.log(product);
        
      } catch (error) {
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    }
    filter()
  },[category])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


async function addtocart(_id) {
  try {
    console.log(_id);
    const user_id=localStorage.getItem("userId")
    const res=await axios.post(APIURL+"/addtocart",{_id,user_id})
    if (res.status==201) {
        await checkcart();
        // setcart(true);
    }
    console.log(res.data);

  } catch (error) {
    console.log(error);
    
  }
}

function viewprodcut(_id) {
  navigate(`/productview/${_id}`)

}

  return (  
   <div className="flex flex-col min-h-screen bg-white">
  {/* Top banner */}
  <Navbar/>
  <div className="bg-black text-white py-3 px-4 text-center relative">
    <p className="text-sm">
      Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{' '}
      <span className="font-semibold">ShopNow</span>
    </p>
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
      <span className="text-sm">English</span>
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  {/* Main content */}
  <div className="container mx-auto py-8 overflow-auto px-4 flex-grow">
    {/* Wishlist header */}
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg font-medium">filtered by category</h2>
    </div>

    {/* Wishlist items */}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[...Array(8)].map((_, index) => (
          <ProductLoader key={index} />
        ))}
      </div>
    ) : wishlistItems && wishlistItems.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {wishlistItems.map((item) => (
          <div 
            onClick={()=>viewprodcut(item._id)}
            key={item._id} 
            className="relative  bg-gray-50 p-3 rounded group"
          >
            {item.discount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {item.discount}
              </div>
            )}
   
            <div className="mb-3 flex justify-center">
              <img src={item.images[0]} alt={item.name} className="h-40 object-cover" />
            </div>
            <div className="text-center mb-2">
              <h3 className="font-medium">{item.name}</h3>
              <div className="flex justify-center items-center w-full space-x-2">
                <span className="text-red-600 font-medium">₹{item.price}</span>
                {item.originalPrice !== item.price && (
                  <span className="text-gray-500 line-through">₹{(item.price / (1 - 0.60)).toFixed(2)}</span>
                )}
              </div>
            </div>
            <button className="w-full bg-black text-white py-2 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add To Cart</span>
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 mb-8">
        <h1 className="text-xl font-medium">No products found</h1>
        <p className="text-gray-500 mt-2">Try adjusting your filter criteria or browse other categories</p>
      </div>
    )}
  </div>
  
  {/* Footer - removed the mt-96 that was causing spacing issues */}
  <Footer/>
</div>
  );
};

export default WishlistPage;