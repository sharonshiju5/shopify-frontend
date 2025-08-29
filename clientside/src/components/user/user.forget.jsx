import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import APIURL from '../path';
const ForgotPassword = () => {
  const [formemail, setEmail] = useState({
    email:""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formemail.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    //   console.log(email);
      const res = await axios.post(APIURL+"/forgetuser", formemail);
      console.log(formemail);
      
    } catch (err) {
        console.log(err);
        
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
console.log("user");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Just enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {success ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <p className="text-sm text-green-600">
                Reset link has been sent to your email. Please check your inbox and follow the instructions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formemail.email}     
                    onChange={(e)=>setEmail((pre)=>({...pre,[e.target.name]:e.target.value}))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                    <Link to={"/login"}>
                      Remember your password?
                    </Link>
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              {/* <a href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500"> */}
                <Link to={"/login"}>
                <p className="text-m font-medium text-blue-600 hover:text-blue-500">
                  Back to login
                </p>
                </Link>
              {/* </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;