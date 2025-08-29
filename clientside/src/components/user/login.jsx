import React, { useState } from 'react';
import { ArrowRight, Mail, Lock,  } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import APIURL from "../path.js"
import axios from 'axios';
const Login = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  console.log(APIURL);
  
  const[pass,setPass]=useState(true)
  function showpass() {
    setPass(!pass)
  }

  const submit = (e) => {
    
  }

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(formData);
  try {
    const res = await axios.post(APIURL+"/login", formData);
    console.log(res.data.msg);
    
    if (res.status==200) {
      const { token, msg,email,userId } = res.data;
      console.log(res.data);
      console.log(userId);


        if (msg=="you hav been blocked by the user") {
          toast.error(msg, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }else{
          toast.success(msg, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
          localStorage.setItem("token",token)
          localStorage.setItem("email",email)
          localStorage.setItem("userId",userId)
          console.log(token,msg);
          console.log("user login succes");
          setTimeout(() => {
            navigate("/")
          }, 1500);
        }
  }
  
} catch (error) {
  toast.error(error.response.data.msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
  console.log(error);
  
} 
 };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="w-full max-w-md p-6 m-4 bg-white rounded-2xl shadow-lg transform hover:scale-[1.01] transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-1">Login to you'r account</h2>
          <p className="text-gray-500 text-sm">Join our community today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
         
          {/* Personal Information Section */}
          <div className="mb-4">
            {/* <h3 className="text-sm font-semibold text-gray-600 mb-3">Personal Information</h3> */}
            <div className="grid grid-cols-2 gap-3">


            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 `} size={18} />
                <input
                  type="email"
                  name='email'
                  placeholder="Email Address"
                  onChange={(e)=>setFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                  required
                  />
              </div>

            </div>
          </div>

          {/* Password Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Security</h3>
            <div className="space-y-3">
              <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                <Lock onClick={showpass} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 `} size={18} />
                <input
                  name="password"
                  type={pass?"password":"text"}
                  placeholder="Password"
                  onChange={(e)=>setFormData((pre)=>({...pre,[e.target.name]:e.target.value}))}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                  required
                  />

              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={submit}
            className="w-full py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg hover:from-gray-700 hover:to-gray-800 active:scale-95"
            >
            login Account
            <ArrowRight size={18} />
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500 text-sm text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200">
            <Link to={"/forgetuser"}>
              forget password
            </Link>
        </p>
        <p className="text-center mt-4 text-gray-500 text-sm">
          dont have an account?{' '}
          <Link to={"/register"} className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200">
            Sign up
          </Link>
        </p>
      </div>

  <ToastContainer/>
    </div>
  </>
  );
};

export default Login;