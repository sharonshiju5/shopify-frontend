import React, { useState } from 'react';
import { ArrowRight, Mail, Eye, EyeOff, Lock, User, Phone, Store, ShoppingCart } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import APIURL from '../path';
import axios from 'axios';
import { ButtonLoader } from '../LoaderVariants';
const RegisterPage = () => {
    const navigate=useNavigate();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    account: 'buyer',
    email: '',
    phone: '',
    company:'',
    licence:'',
    password: '',
    cPassword: ''
  });


  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await convertBase64(file);
        setFormData((prev) => ({ ...prev, licence: base64 }));
        console.log("Base64 String:", base64); 
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [emailerrorMsg, setemailErrorMsg] = useState("");
  const[phoneerrorMsg,setphoneerrorMsg]=useState("")
  const [disable, setDisable] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 4) { 
      setDisable(true);
      return "Password must be at least 4 characters.";
    }
    if (!/[A-Z]/.test(password)) {
      setDisable(true);
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      setDisable(true);
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      setDisable(true);
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      setDisable(true);
      return "Password must contain at least one special character.";
    }
    setDisable(false);
    return "";
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        setDisable(true);
        return "Email is required.";
    }
    if (!emailRegex.test(email)) {
        setDisable(true);
        return "Invalid email format.";
    }
    
    setDisable(false);
    return "";
};

const validateIndianPhone = (phone) => {
  const phoneRegex = /^[6789]\d{9}$/;

  if (!phone) {
      setDisable(true);
      return "Phone number is required.";
  }
  if (!phoneRegex.test(phone)) {
      setDisable(true);
      return "Invalid phone number format.";
  }
  
  setDisable(false);
  return "";
};


  const setForm = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    setPasswordStrength(formData.password.length)
    if (name==="email") {
      const error = validateEmail(value);
      setemailErrorMsg(error)
    }
    if (name === "phone") {
      const error = validateIndianPhone(value);
      setphoneerrorMsg(error);
    }
    if (name === "password") {
      const error = validatePassword(value);
      setErrorMsg(error);
    }
  };
  
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [pass,setpass]=useState(true)
  function showpass() {
    setpass(!pass)
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    try {
      setRegisterLoading(true);
      const res = await axios.post(APIURL+"/adduser", formData);
      console.log(res);
      console.log("created");
      if (res.status==201) {
        toast.success(res.data.msg, {
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
          
          navigate("/login")
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });      
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="w-full max-w-md p-6 m-4 bg-white rounded-2xl shadow-lg transform hover:scale-[1.01] transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Join our community today</p>
        </div>
        <ToastContainer/>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Account Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              name='account'
              onClick={(e)=>setFormData((pre)=>({...pre,[e.target.name]:"buyer"}))}
              className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                formData.account === 'buyer'
                  ? 'bg-gray-50 border-gray-400 text-gray-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={18} />
              <span className="font-medium">Buyer</span>
            </button>
            <button
              type="button"
              name='account'
              onClick={(e)=>setFormData((pre)=>({...pre,[e.target.name]:"seller"}))}
              className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                formData.account === 'seller'
                  ? 'bg-gray-50 border-gray-400 text-gray-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Store size={18} />
              <span className="font-medium">Seller</span>
            </button>
          </div>
        </div>

          {/* Personal Information Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 `} size={18} />
                  <input
                    type="text"
                    name='fname'
                    onChange={setForm}
                    placeholder="First Name"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                  <User onClick={showpass} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200`} size={18} />
                  <input
                    type="text"
                    name='lname'
                    onChange={setForm}
                    placeholder="Last Name"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                    required
                  />
                </div>
              </div>
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
                  onChange={setForm}
                  placeholder="Email Address"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"

                  required
                />
                  {emailerrorMsg && <p className="text-red-500 text-sm">{emailerrorMsg}</p>}

              </div>

              <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200`} size={18} />
                <input
                  type="number"
                  name='phone'
                  onChange={setForm}
                  placeholder="Phone Number"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                  required
                />
                  {phoneerrorMsg && <p className="text-red-500 text-sm">{phoneerrorMsg}</p>}

              </div>
              {formData.account === "buyer" ? "" : (
                <>
                  {/* Company Phone Number input */}
                  <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02] mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                    >
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="6" x2="12" y2="6.01"></line>
                      <line x1="12" y1="12" x2="12" y2="12.01"></line>
                      <line x1="12" y1="18" x2="12" y2="18.01"></line>
                    </svg>
                    <input
                      type="text"
                      name="company"
                      onChange={setForm}
                      placeholder="company name"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                      required
                    />
                  </div>
                            
                  {/* Company License section */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-2 ml-1">Company License</div>
                    <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                      </div>
                      <input
                        type="file"
                        name="licence"
                        onChange={handleFileChange}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30 cursor-pointer"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-medium">
                        Choose File
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Password Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Security</h3>
            <div className="space-y-3">
              <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
                <Lock  className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 `} size={18} />
                <input
                  type= {pass?"password":"text"}
                  placeholder="Password"
                  name='password'
                  onChange={setForm}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                  required
                />
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={showpass}>
                  {pass?<Eye size={20} className="text-gray-500" />:<EyeOff size={20} className="text-gray-500" />}
                </button>
                <div className="mt-1 flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-full rounded-full transition-all duration-300 ${
                        i < passwordStrength ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative transform transition-all duration-200 scale-100 hover:scale-[1.02]">
              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <Lock  className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 `} size={18} />
                <input
                  type= {pass?"password":"text"}
                  placeholder="Confirm Password"
                  name='cpassword'
                  onChange={setForm}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-transparent placeholder-gray-400 text-gray-600 transition-all duration-200 hover:bg-orange-50/30"
                  required
                />
                <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={showpass}
            > {pass?<Eye size={20} className="text-gray-500" />:<EyeOff size={20} className="text-gray-500" />}</button>
              </div>
            </div>
          </div>
            {disable ? <p>complete the validation </p>:
          <button
          type="submit"
          disabled={registerLoading}
          className="w-full py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg hover:from-gray-700 hover:to-gray-800 active:scale-95 disabled:opacity-50"
          >
            {registerLoading ? <ButtonLoader text="Creating Account..." /> : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
          }
        </form>

        <p className="text-center mt-4 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to={"/login"} className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;