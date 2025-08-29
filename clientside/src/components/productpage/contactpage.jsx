import React, { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import APIURL from '../path';
import Navbar from './nav';
import Footer from './footer';
import { Link } from 'react-router-dom';

const ContactComponent = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const userId=localStorage.getItem("userId")
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    hasError: false
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res=await axios.post(APIURL+"/contact",{formState,email})
        console.log(res);
        
        if (res.status==200) {

            setFormStatus({ isSubmitting: true, isSubmitted: false, hasError: false });
        
            // Simulate API call
            setTimeout(() => {
                // Success simulation (in production, handle actual API response)
                setFormStatus({ isSubmitting: false, isSubmitted: true, hasError: false });
                setFormState({ name: '', email: '', subject: '', message: '' });
                
                // Reset success message after 5 seconds
                setTimeout(() => {
                    setFormStatus(prev => ({ ...prev, isSubmitted: false }));
                }, 5000);
            }, 1500);
        }
    } catch (error) {
        
    }
  };

  
  return (
    <>
    <Navbar/>
    <div className='pt-30'>

    <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto my-12 mt-0 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Contact Information */}
        <div className="bg-gray-900 p-8 md:p-12 text-white relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern)"/>
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 relative">
              Get in Touch
              <span className="block w-20 h-1 bg-blue-500 mt-2"></span>
            </h2>
            
            <p className="mb-8 text-gray-300">
              We're here to help! Send us a message and we'll respond as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="bg-blue-600 p-3 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-blue-600 p-3 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Us</h3>
                  <p className="text-gray-300">support@yourstore.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-blue-600 p-3 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-gray-300">123 E-Commerce St, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-blue-600 p-3 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business Hours</h3>
                  <p className="text-gray-300">Monday - Friday: 9am - 6pm<br />Saturday: 10am - 4pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="p-8 md:p-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 relative">
            Send a Message
            <span className="block w-20 h-1 bg-blue-600 mt-2"></span>
          </h2>
          
          {formStatus.isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center text-green-700 shadow-sm">
              <CheckCircle className="w-6 h-6 mr-3" />
              <p>Thank you for your message! We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Order Inquiry"
                />
              </div>
              
              <label htmlFor="message" className="text-sm font-medium text-gray-700 -mt-50">Your Message</label>
              <div className="space-y-1  w-255">
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Please describe how we can help you..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={formStatus.isSubmitting}
                
                className={`w-full ${userId? "bg-blue-600 hover:bg-blue-700" : "bg-red-500"} text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex justify-center items-center ${formStatus.isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {formStatus.isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                   userId?
                    <div className="flex items-center">
                      Send Message <Send className="ml-2 w-4 h-4" />
                    </div>
                    :
                    <Link to={"/login"}>
                    <div className="flex items-center">
                       login to send message 
                    </div>
                    </Link>
                )   }
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                We respect your privacy and will never share your information with third parties.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
    

    </div>
    <Footer/>
    </>
  );
};

export default ContactComponent;