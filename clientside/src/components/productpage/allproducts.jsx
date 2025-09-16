import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import APIURL from '../path';
import { Filter, X } from 'lucide-react';
import Navbar from './nav';
import Footer from './footer';
import { PageLoader, ProductLoader } from '../LoaderVariants';

const Allproduct = () => {
  const navigate = useNavigate();
  const [wishlistItems, setwishlist] = useState([]);
  const [_id, setId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("recommended");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterAnimating, setFilterAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const { category } = useParams();
  console.log(category);
  const user_id = localStorage.getItem("useId");
  
  const[categories,setcategories]=useState([])

  useEffect(() => {
    async function filter() {
      try {
        const res = await axios.post(APIURL + "/filter", { category, user_id });
        const { product } = res.data;
        setwishlist(product);
        setFilteredItems(product);
        console.log(product);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    filter();
  }, [category]);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    if (wishlistItems.length > 0 && !loading) {
      let filtered = [...wishlistItems];
      
      // Apply price filter
      filtered = filtered.filter(item => 
        item.price >= minPrice && item.price <= maxPrice
      );
      
      // Apply category filter if any are selected
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(item => 
          selectedCategories.includes(item.category)
        );
      }
      
      // Apply sorting
      if (sortBy === "price-low-high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high-low") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "newest") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setFilteredItems(filtered);
    }
  }, [minPrice, maxPrice, sortBy, wishlistItems, selectedCategories, loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function viewprodcut(_id) {
    navigate(`/productview/${_id}`);
  }

  function toggleFilters() {
    setFilterAnimating(true);
    setShowFilters(!showFilters);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setFilterAnimating(false);
    }, 300);
  }
  
  function handleCategoryToggle(category) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }



//   console.log(categories);

  async function getcategory() {
    try {
        setCategoriesLoading(true);
        const res=await axios.get(APIURL+"/category ")
        if (res.status==200) {
            const{categories}=res.data
            setcategories(categories)
        }
          
        // console.log(res);
        
    } catch (error) {
        console.log(error);
    } finally {
        setCategoriesLoading(false);
    }
  }
  useEffect(()=>{
    getcategory()
  },[selectedCategories])


  async function filteredprod() {
    try {
        setLoading(true);
        const res=await axios.post(APIURL+"/products/filterd",{selectedCategories,minPrice,maxPrice})
        // console.log(res);
        if (res.status==200) {
            const{products}=res.data
            setFilteredItems(products)
        }
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  }
  useEffect(()=>{
    if(categories.length > 0) {
      filteredprod()
    }
  },[minPrice,maxPrice,selectedCategories])
  console.log(filteredItems);
  
  return (
    <>
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top banner */}
      <Navbar />

      {/* Main content with side-by-side layout */}
      <div className="container mx-auto py-8 px-4 flex-grow overflow-auto">
        {/* Header with filter toggle button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium">Filtered by: {category}</h2>
          <button 
            onClick={toggleFilters}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-300
              ${showFilters ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 hover:bg-gray-200'}
              ${filterAnimating ? 'scale-95' : 'scale-100'}`}
          >
            <div className={`transition-transform duration-300 ${showFilters ? 'rotate-90' : 'rotate-0'}`}>
              {showFilters ? <X size={18} /> : <Filter size={18} />}
            </div>
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>
        
        {/* Flex container for product grid and filters */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product grid - takes remaining space */}
          <div className={`w-full transition-all duration-300 ease-in-out ${showFilters ? 'md:w-2/3' : 'w-full'}`}>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {[...Array(6)].map((_, index) => (
                  <ProductLoader key={index} />
                ))}
              </div>
            ) : filteredItems && filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredItems.map((item) => (
                  <div 
                    onClick={() => viewprodcut(item._id)}
                    key={item._id} 
                    className="relative bg-gray-50 p-3 rounded group cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 duration-200"
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
                    <button className="w-full bg-black text-white py-2 flex items-center justify-center space-x-2 hover:bg-gray-800 transition duration-300">
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
          
          {/* Filter sidebar - with animation effects */}
          <div 
            className={`md:w-96 md:max-w-md md:flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
              ${showFilters ? 'opacity-100 max-h-screen md:translate-x-0' : 'md:opacity-0 md:max-h-0 md:-translate-x-full max-h-0 opacity-0 md:hidden'}`}
          >
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sticky top-4 shadow-md transition-all duration-300 ease-in-out transform 
                           ${showFilters ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                <button 
                  onClick={toggleFilters}
                  className="md:hidden text-gray-500 hover:text-gray-700 transition-transform duration-300 hover:rotate-90"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    [...Array(4)].map((_, index) => (
                      <div key={index} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    ))
                  ) : (
                    categories.map((cat, index) => (
                    <div 
                      key={cat} 
                      className="flex items-center transition-opacity duration-300" 
                      style={{
                        animationDelay: `${index * 50}ms`,
                        opacity: showFilters ? 1 : 0,
                        transition: `opacity 300ms ${index * 50}ms`
                      }}
                    >
                      <input 
                        type="checkbox" 
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="mr-2"
                      />
                      <label htmlFor={`cat-${cat}`} className="text-sm">{cat}</label>
                    </div>
                  ))
                  )}
                </div>
              </div>
              
              {/* Price range with input fields */}
              <div className="mb-6 transition-all duration-300 ease-in-out" style={{ transitionDelay: '100ms' }}>
                <h4 className="text-sm font-medium mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <div className="w-1/2">
                    <label className="text-xs text-gray-500">Min Price</label>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <span className="px-2 bg-gray-100 text-gray-500">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full p-2 outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs text-gray-500">Max Price</label>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <span className="px-2 bg-gray-100 text-gray-500">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full p-2 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sort options */}
              {/* <div className="mb-6 transition-all duration-300 ease-in-out" style={{ transitionDelay: '150ms' }}>
                <h4 className="text-sm font-medium mb-3">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { id: "recommended", label: "Recommended" },
                    { id: "newest", label: "Newest First" },
                    { id: "price-low-high", label: "Price: Low to High" },
                    { id: "price-high-low", label: "Price: High to Low" }
                  ].map((option, index) => (
                    <button 
                      key={option.id}
                      className={`w-full px-3 py-2 text-sm text-left border rounded-md transition-all duration-300 
                        ${sortBy === option.id ? "bg-black text-white" : "border-gray-300 hover:bg-gray-100"}`}
                      onClick={() => setSortBy(option.id)}
                      style={{ 
                        transitionDelay: `${200 + index * 50}ms`,
                        transform: showFilters ? 'translateX(0)' : 'translateX(-10px)',
                        opacity: showFilters ? 1 : 0 
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div> */}
              
              {/* Results count */}
              <div className="text-sm text-gray-600 mb-2 transition-all duration-300 ease-in-out" style={{ transitionDelay: '300ms' }}>
                Showing {filteredItems.length} of {wishlistItems.length} products
              </div>
              
              {/* Clear filters button */}
              <button 
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(10000);
                  setSortBy("recommended");
                  setSelectedCategories([]);
                }}
                className="w-full border border-gray-300 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
      <Footer/>
      </>
  );
};

export default Allproduct;