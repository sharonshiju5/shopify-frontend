import React, { useEffect, useContext,useState } from "react";
import {  Package,  MapPin, Plus, Edit2 } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import "../css/index.css"
import { data, Link,useNavigate } from "react-router-dom";
import { Menu,Store ,Filter ,Eye, EyeOff , X, Search, ShoppingCart, User, LogOut, Settings, Heart,  } from 'lucide-react';
import axios from "axios";
import APIURL from "../path";
import ProductForm from "../productpage/addproduct";
import SellerProducts from "../productpage/productview";
import Navbar from "../productpage/nav";
import sound from "../../assets/sound.mp3"
import { MessageContext } from "../context";
import LoginPrompt from "../productpage/LoginPrompt";


const ProfilePage = () => {
  const [edit, setEdit] = useState(false);
  const [address, setaddres] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: "",
    phone: '',
  });
  const [addresformData, setaddresFormData] = useState({
    userId: '',
    phone: '',
    name: "",
    pincode: '',
    locality: '',
    address: '',
    city: "",
    state: '',
    land: '',
    altrenativ: '',
  });
  const { isUserBlocked } = useContext(MessageContext);
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
      setaddresFormData((prev) => ({ ...prev, userId: storedUserId }));
    }
  }, []);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [fetched, setFetched] = useState(false);
  const [user, setUser] = useState({});

  useEffect(()=>{
    const profile =async (e) => {
      try {
        
        const res = await axios.post(APIURL+"/profiledata", formData);
        const{user}=res.data
        setUser(user[0])
        setFetched(true); 
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
    if (!fetched) {
      profile();
    }
  }, [fetched,formData,isUserBlocked]);
// console.log(user);

  


  const[input,setInput]=useState(true)
  const[filter,setFilter]=useState(true)

  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);


  function showinput() {
      setInput(!input)
  }


  const userId=localStorage.getItem("userId")

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-menu')) {
      setShowProfileMenu(false);
    }
  };

  function showfilter() {
    setFilter(!filter)
  }


  function shoedit() {
    if (!edit) {
      setFormData({
        fname: user.fname || "",
        lname: user.lname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
    setEdit(!edit);
  }

  function shoaddres() {
    setaddres(!address)
  }

  async function saveform(){
     console.log("Saving Data:", formData);
     setUser((prevUser) => ({ ...prevUser, ...formData,}));
    //  console.log(formData);
     try {
       const res = await axios.put(APIURL+"/saveprofile", formData);
      //  console.log(res+"response");
       
     } catch (error) {
       console.log(error);
       
     }
       setEdit(false);
  }

  // adding address 
  // adding address 
  // adding address 

  const saveaddress = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(APIURL + "/addaddress", addresformData, {
            headers: { "Content-Type": "application/json" }
        });

        // console.log("Response:", res.data);
        // if (res.data.address) {
          // setAddresses(res.data.address); 
          if (res.status==201) {
            const{msg}=res.data
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

            setaddres(!address)
            showaddress()
  
          console.log("Stored addresses:", res.data.address);
      } else {
          console.warn("No address data received.");
      }
    } catch (error) {
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
        console.error("Axios error:", error.response?.data || error.message);
    }
  };


// fetching address
// fetching address
// fetching address

const [addresses, setAddresses] = useState([]); 
const showaddress = async () => {
  try {
      const res = await axios.post(APIURL + "/showaddress", addresformData);
      console.log("Full API Response:", addresformData); 
    const{msg}=res.data
      if (res.data.address && Array.isArray(res.data.address)) {
          setAddresses(res.data.address); 
          console.log("Updated State (Addresses):", res.data.address);
          if (res.status==200) {
            toast.success(msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          }
      } else {
          console.warn("Invalid or missing 'address' array in response.");
      }
  } catch (error) {
      console.error("Axios error:", error.response?.data || error.message);
  }
};

//delete address
//delete address
//delete address

const deleteAddress = async (_id) => {
  try {
    console.log(_id);
    const res = await axios.post(APIURL + "/deleteaddress",{_id});
      console.log("Full API Response:", res.data); 
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
            showaddress()
          }, 2500);
      }

  } catch (error) {
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
      console.error("Axios error:", error.response?.data || error.message);
  }
};
function logout() {
  localStorage.removeItem("email");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.reload()
}

  return (
    <>
    <Navbar/>
    {
      userId?(
    <div className="main-container">
    <div className="flex h-full w-full bg-gray-100">
      {/* Sidebar */}

      <aside className="w-1/5 bg-white p-5 shadow-md flex flex-col space-y-3">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full">
            <img src="https://cdn-icons-png.flaticon.com/128/428/428933.png" alt="" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.fname || ""}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>
        <button className={`p-3 rounded-md flex items-center space-x-2 ${activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("profile")}>
          <User /> <span>Personal Info</span>
        </button>
        <Link to={"/orderpage"}>
        <button className={`p-3 rounded-md flex items-center space-x-2 ${activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("orders")}>
          <Package /> <span>My Orders</span>
        </button>
        </Link>
        <button  className={`rounded-md flex items-center space-x-2 ${activeTab === "addresses" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("addresses")}>
          <MapPin className="ml-3" /> <span onClick={showaddress} className="p-3 address-span">Addresses</span>
        </button>
        {
            user && user.account === "buyer" ? (
              ""
            ) : (
              <>
        <button className={`p-3 rounded-md flex items-center space-x-2 ${activeTab === "addProduct" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("addProduct")}>
           <span>view Products</span>
        </button>

        <button className={`p-3 rounded-md flex items-center space-x-2 ${activeTab === "addproduct" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("addproduct")}>
           <span>add Products</span>
        </button></>
       ) }
        <button onClick={logout} className="mt-auto p-3 rounded-md flex items-center space-x-2 text-red-600 hover:bg-red-100">
          <LogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "profile" && (
          <section className=".sect bg-white p-6 rounded-md shadow-md">
    
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <button onClick={shoedit} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                <Edit2 className="mr-2" /> Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                
              <p>
                <strong>first Name: </strong>
                <input type="text"
                  className={edit?"bg-gray-200 rounded-md border  pl-3":""}
                  disabled={!edit}
                  name="fname"
                  onChange={(e)=>setFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  value={edit ? formData.fname : user?.fname || ""}   />
              </p>
              <p>
                <strong>last name: </strong>
                <input type="text"
                  className={edit?"bg-gray-200 rounded-md border  pl-3":""}
                  disabled={edit?"":"disabled"}
                  name="lname"
                  onChange={(e)=>setFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  value={edit ? formData.lname : user?.lname || ""} />
              </p>
              <p>
                <strong>Email: </strong>
                <input type="text"
                  disabled
                  name="email"
                  value={edit ? formData.email : user?.email || ""}   />
              </p>
              <p>
                <strong>Phone: </strong>
                <input type="number"
                  className={edit?"bg-gray-200 rounded-md border  pl-3":""}
                  disabled={!edit} 
                  name="phone"
                  onChange={(e)=>setFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  value={edit ? formData.phone : user?.phone || ""}   />
              </p>
              {
              edit?<button className="w-40 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700" onClick={saveform}>save</button>:""
              }
            </div>
          </section>
        )}
        {activeTab === "orders" && (
          <section className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold">Order History</h2>
            <p>No recent orders</p>
          </section>
        )}
        {activeTab === "wishlist" && (
          <section className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <p>No saved items</p>
          </section>
        )}
        {activeTab === "addresses" && (
          <section className="bg-whiteh-screen  p-6 rounded-md shadow-md">
            <button onClick={shoaddres}><Plus /> </button> add address
            <h2 className="text-lg font-semibold">Saved Addresses</h2>
            {/* <button onClick={showaddress}>Show Address</button> */}
            {/* <p>No addresses saved</p> */}
            {address?

            <div className="addres-div w-xl h-full bg-whiteh-screen ">
              <form action="">
                <input type="text"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  name="name" required placeholder="name" />

                <input type="number"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  name="phone" required placeholder="10-digit mobile number" />

                <input type="text"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  name="pincode" required placeholder="pincode" />

                <input type="text"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  name="locality" required placeholder="locality" />

                <textarea required
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  style={{width:"97%",height:"120px", border:"1px solid grey"}} name="address" id="" placeholder="address(address area and street)"></textarea>

                <input type="text"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  name="city" required placeholder="city/district/town" />

                <select  
                    name="state"
                    onChange={(e) => setaddresFormData((pre) => ({ ...pre, [e.target.name]: e.target.value }))}
                    required 
                    className="border border-gray-400 rounded-md px-3 py-2 w-[47%]"
                    >
                    <option value="">Select State</option>
                    <option value={"Andhra Pradesh"}>Andhra Pradesh</option>
                    <option value={"Arunachal Pradesh"}>Arunachal Pradesh</option>
                    <option value={"Assam"}>Assam</option>
                    <option value={"Bihar"}>Bihar</option>
                    <option value={"Chhattisgarh"}>Chhattisgarh</option>
                    <option value={"Goa"}>Goa</option>
                    <option value={"Gujarat"}>Gujarat</option>
                    <option value={"Haryana"}>Haryana</option>
                    <option value={"Himachal Pradesh"}>Himachal Pradesh</option>
                    <option value={"Jharkhand"}>Jharkhand</option>
                    <option value={"Karnataka"}>Karnataka</option>
                    <option value={"Kerala"}>Kerala</option>
                    <option value={"Madhya Pradesh"}>Madhya Pradesh</option>
                    <option value={"Maharashtra"}>Maharashtra</option>
                    <option value={"Manipur"}>Manipur</option>
                    <option value={"Meghalaya"}>Meghalaya</option>
                    <option value={"Mizoram"}>Mizoram</option>
                    <option value={"Nagaland"}>Nagaland</option>
                    <option value={"Odisha"}>Odisha</option>
                    <option value={"Punjab"}>Punjab</option>
                    <option value={"Rajasthan"}>Rajasthan</option>
                    <option value={"Sikkim"}>Sikkim</option>
                    <option value={"Tamil Nadu"}>Tamil Nadu</option>
                    <option value={"Telangana"}>Telangana</option>
                    <option value={"Tripura"}>Tripura</option>
                    <option value={"Uttar Pradesh"}>Uttar Pradesh</option>
                    <option value={"Uttarakhand"}>Uttarakhand</option>
                    <option value={"West Bengal"}>West Bengal</option>
                    <option value={"Andaman and Nicobar Islands"}>Andaman and Nicobar Islands</option>
                    <option value={"Chandigarh"}>Chandigarh</option>
                    <option value={"Dadra and Nagar Haveli and Daman and Diu"}>Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value={"Delhi"}>Delhi</option>
                    <option value={"Jammu and Kashmir"}>Jammu and Kashmir</option>
                    <option value={"Ladakh"}>Ladakh</option>
                    <option value={"Lakshadweep"}>Lakshadweep</option>
                    <option value={"Puducherry"}>Puducherry</option>
                </select>
                            
                <input type="text"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                   name="land" placeholder="land mark(optional)" />
                
                <input type="text"
                  onChange={(e)=>setaddresFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  name="altrenativ" placeholder="altrenative phone (optional)" />
                
                <div className="flex justify-center w-full">
                  <button onClick={saveaddress} class="address-btn bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 ...">save</button>
                </div>
              </form>
            </div>
            :""}

              <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{address.name}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{address.phone}</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-700">
                      {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                    </p>

                    {address.land && (
                      <p className="mt-1 text-sm text-gray-600">Landmark: {address.land}</p>
                    )}

                    {address.altrenativ && (
                      <p className="mt-1 text-sm text-gray-600">Alt. Address: {address.altrenativ}</p>
                    )}

                    <div className="mt-3 flex justify-end gap-2">

                    <button onClick={() => {
                      const addressId = address._id;
                      console.log("Address ID to delete:", addressId);
                      // Call your delete function with this ID
                      deleteAddress(addressId);}} class="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition duration-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      Delete
                    </button>

                    </div>
                  </div>
                ))}
              </div>
          </section>
        )}
        
        {activeTab === "addProduct" && (
          <section className="bg-white p-6 ">
            <h2 className="text-lg font-semibold">Products</h2>
            <p>Form goes here</p>
            <div className="bg-white p-6 w-full max-h-135 overflow-y-auto rounded-lg border border-gray-200 shadow-md">
              <SellerProducts/>
            </div>
          </section>
        )}
        {activeTab === "addproduct" && (
          <div className="bg-white p-6 w-full max-h-162 overflow-y-auto rounded-lg border border-gray-200 shadow-md">

            <ProductForm/>
          </div>
          )}
      </main>

        <ToastContainer/>
    </div>
    </div>
        ):(
        <div className="pt-12"><LoginPrompt/></div>
      )}
    </>
  );
};

export default ProfilePage;
