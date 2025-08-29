import "../css/index.css"
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Menu, Store, Filter, X, Search, ShoppingCart, User, LogOut, Settings, Heart,ShoppingBag, Package, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import APIURL from "../path";

export default function Navbar() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [input, setInput] = useState(true);
  const [filter, setFilter] = useState(true);
  const [price, setPrice] = useState(100);
  
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
   
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Products', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' }
  ];
      
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
  
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function showinput() {
    setInput(!input);
  }
  const email=localStorage.getItem("email")
  
  
  const user_id = localStorage.getItem("userId");
  useEffect(()=>{
    const profile =async (e) => {
      try {
        
        const res = await axios.post(APIURL+"/profiledata", {email});
        const{user}=res.data
        console.log(res);
        
        setUser(user[0])
        // setFetched(true); 
        console.log(user);
        if (user[0].block===true) {
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          localStorage.removeItem("email")
          alert("you have been blocked by the admin")
          window.location.reload()
        }
        // console.log(user[0].fname);
        
      } catch (error) {
        console.log(error);
        
      }
    }
    // if (!fetched) {
      profile();
    // }
  }, [token]);

  function logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload()
  }

  function showfilter() {
    setFilter(!filter);
  }


  useEffect(() => {
    async function fetchData() {
      try {      
        const user_id = localStorage.getItem("userId");
  
        const productsRes = await axios.post(APIURL + "/showproduct", {user_id});
        
        if (productsRes.status === 200) { 
          const productsData = productsRes.data.Data || [];
          setProducts(productsData); 
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);

  // Filter products based on search input
  const filteredProducts = products.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const isVisible = search.length > 0;


  function viewProdct(_id) {
    navigate(`/productview/${_id}`)
    setSearch("");
    setShowSearch(false);
  }

  function Home() {
    useNavigate("/")
  }


  const [gradientPosition, setGradientPosition] = useState(0);
  
  // Animate gradient continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const menuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transformOrigin: "top right",
      boxShadow: "0px 0px 0px rgba(0,0,0,0.1)"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.08,
        boxShadow: { delay: 0.1, duration: 0.4 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      boxShadow: "0px 0px 0px rgba(0,0,0,0.1)",
      transition: { 
        duration: 0.2,
        ease: "easeIn",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, height: 0 },
    visible: { 
      opacity: 1, 
      x: 0, 
      height: "auto",
      transition: { 
        opacity: { duration: 0.2 },
        x: { type: "spring", stiffness: 200, damping: 15 },
        height: { duration: 0.3 }
      }
    },
    exit: { 
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, rotate: -10 },
    visible: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  const gradientStyle = {
    background: `linear-gradient(
      ${gradientPosition * 3.6}deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(240, 240, 255, 0.9) 50%,
      rgba(230, 230, 255, 0.8) 100%
    )`
  };

  return (
    <>
      <nav className="bg-white shadow-sm" >
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to={"/"}>
                <span className="text-2xl font-bold text-blue-600 cursor-pointer">
                  Shippe
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to={"/"} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                    Home
              </Link>
              
              <Link 
              to={"/Allproduct"}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                    products
              </Link>
              <Link to={"/about"}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                    about
              </Link>
              <Link to={"/contact"}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                    contact
                </Link>
              {showSearch && (
                <div className="relative">
                  <div className="flex items-center w-full max-w-md animate-slideIn">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-1 search-input rounded-xl border focus:outline-none"
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        setShowSearch(false);
                        setSearch("");
                      }}
                      className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {isVisible && (
                      <motion.div 
                        className="absolute mt-1 w-full bg-white overflow-hidden border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ul className="py-2 divide-y divide-gray-100">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((item, index) => (
                              <motion.li 
                                key={item._id} 
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center text-gray-800"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  duration: 0.2,
                                  delay: index * 0.05
                                }}
                                whileHover={{ backgroundColor: "#F3F4F6" }}
                                onClick={()=>viewProdct(item._id)}
                              >
                                {item.images && (
                                  <img 
                                    src={item.images[0]} 
                                    alt={item.name} 
                                    className="w-10 h-10 object-cover rounded mr-3"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/40';
                                    }}
                                  />
                                )}
                                <div>
                                  <span className="font-medium block" >{item.name}</span>
                                </div>
                              </motion.li>
                            ))
                          ) : (
                            <motion.li 
                              className="px-4 py-3 text-gray-500 italic text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              No results found
                            </motion.li>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {!token ? (
                <Link to={"/login"}>
                  <button type="button" className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                    Login
                  </button>
                </Link>
              ) : null}
              
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <Link to={"/cart"}>
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </Link>
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <Link to={"/orderpage"}>
                  <ShoppingBag size={24} />
                </Link>
              </button>
              
              {/* Profile Menu */}
              <div className="relative profile-menu">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </button>
            
                {/* Dropdown Menu */}
            
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden z-50 backdrop-blur-sm"
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={gradientStyle}
                    >
                      <motion.div 
                        className="w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"
                        animate={{ 
                          backgroundPosition: [`0% 0%`, `100% 100%`],
                        }}
                        transition={{ 
                          repeat: Infinity,
                          repeatType: "mirror",
                          duration: 2,
                          ease: "linear"
                        }}
                      />
                      
                      <div className="py-2">
                        <motion.div variants={itemVariants}>
                          <Link
                            to="/userprofile"
                            className="block px-4 py-2"
                          >
                            <motion.div 
                              className="flex items-center w-full rounded-md p-2 relative overflow-hidden"
                              whileHover={{ 
                                backgroundColor: "rgba(240, 240, 255, 0.6)",
                                x: 5,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0"
                                whileHover={{ opacity: 1 }}
                              />
                              
                              <motion.div
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full text-white mr-3"
                              >
                                <User className="h-4 w-4" />
                              </motion.div>
                              
                              <motion.span 
                                className="text-gray-700 font-medium"
                                whileHover={{ 
                                  color: "#4f46e5",
                                  x: 3,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                User Profile
                              </motion.span>
                            </motion.div>
                          </Link>
                        </motion.div>
                              
                        <motion.div 
                          className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-1"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <motion.div variants={itemVariants}>
                          <a
                            href="#"
                            className="block px-4 py-2"
                            onClick={(e) => {
                              e.preventDefault();
                              logout();
                            }}
                          >
                            <motion.div 
                              className="flex items-center w-full rounded-md p-2 relative overflow-hidden"
                              whileHover={{ 
                                backgroundColor: "rgba(255, 240, 240, 0.6)",
                                x: 5,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-500/20 opacity-0"
                                whileHover={{ opacity: 1 }}
                              />
                              
                              <motion.div
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                className="bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-full text-white mr-3"
                              >
                                <LogOut className="h-4 w-4" />
                              </motion.div>
                              
                              <motion.span 
                                className="text-gray-700 font-medium"
                                whileHover={{ 
                                  color: "#e11d48",
                                  x: 3,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                Logout
                              </motion.span>
                            </motion.div>
                          </a>
                        </motion.div>
                      </div>
                              
                      <motion.div
                        className="h-1 w-full bg-gradient-to-r from-purple-500 to-blue-400"
                        animate={{ 
                          backgroundPosition: [`100% 100%`, `0% 0%`],
                        }}
                        transition={{ 
                          repeat: Infinity,
                          repeatType: "mirror",
                          duration: 2,
                          ease: "linear"
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <div className="flex items-center">
                {!token ? (
                <Link to={"/login"}>
                  <button type="button" className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                    Login
                  </button>
                </Link>
              ) : null}
                  <Menu className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <div className="px-3 relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search ? (
                      <button 
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-2.5"
                      >
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    ) : (
                      <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Mobile Search Results */}
                  <AnimatePresence>
                    {isVisible && (
                      <motion.div 
                        className="absolute left-3 right-3 mt-1 bg-white overflow-hidden border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ul className="py-2 divide-y divide-gray-100">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((item, index) => (
                              <motion.li 
                                key={item._id} 
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center text-gray-800"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  duration: 0.2,
                                  delay: index * 0.05
                                }}
                                onClick={()=>viewProdct(item._id)}
                                whileHover={{ backgroundColor: "#F3F4F6" }}
                              >
                                {item.images && (
                                  <img 
                                    src={item.images[0]} 
                                    alt={item.name} 
                                    className="w-10 h-10 object-cover rounded mr-3"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/40';
                                    }}
                                  />
                                )}
                                <div>
                                  <span className="font-medium block">{item.name}</span>
                                  {/* {item.price && ( */}
                                     <span className="text-sm text-gray-500">{item.price}</span>
                                  {/* )} */}
                                </div>
                              </motion.li>
                            ))
                          ) : (
                            <motion.li 
                              className="px-4 py-3 text-gray-500 italic text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              No results found
                            </motion.li>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Mobile Nav Links */}
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    {link.name}
                  </a>
                ))}
                
                {/* Mobile Profile Menu */}
                <div className="px-3 pt-4 border-t">
                    <Link
                      to={"/userprofile"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-3" />
                      <span>User profile</span>
                    </Link>
                  <a 
                    href="#"
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span onClick={logout}>LogOut</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="subnav">
          <div className="nav-filter-div">
            {/* <button onClick={showfilter} className="p-2 duration-200">
              <Filter className="filter-icon h-5 w-5 text-gray-600" />
            </button> */}
          </div>
          <p>Get additional 10% off* on your first purchase. Use Code VHGET10.</p>
          <div className="nav-filter-div">
          </div>
        </div>
      </nav>
    </>
  );
}