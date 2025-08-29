import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate } from "react-router-dom";
import Navbar from './nav';
import Footer from './footer';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('story');
  
  // Create multiple refs for different sections to trigger animations at different scroll points
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [teamRef, teamInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3, triggerOnce: false });
  
  // Stats with icons
  const stats = [
    { value: "15+", label: "Years Experience", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { value: "50K+", label: "Happy Customers", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { value: "200+", label: "Products", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { value: "12", label: "Countries Served", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  // Team members
  const emp = [
    {
        img: "https://img.freepik.com/free-photo/ambitious-businessman_1098-18160.jpg?t=st=1741805618~exp=1741809218~hmac=24b6a4bdbf9a7efcc86f159e52172e1a06637a638eecca3b3024478107ae6fe1&w=1380",
        position: "CEO & Founder",
        description: "With over 20 years of experience in e-commerce and retail, Michael brings vision and expertise to our executive team."
    },
    {
      img: "https://img.freepik.com/free-photo/content-successful-male-manager-using-tablet-looking-camera_1262-14194.jpg?t=st=1741805261~exp=1741808861~hmac=5ce6a71a4ac7d04480281156fb70f6c0ecb80312dbdd5709c4716a44ecb14e27&w=1380",
      position: "Chief Technology Officer",
      description: "With over 12 years of experience in software development and IT infrastructure, Daniel brings innovation and technical acumen to our organization."
    },
    {
      img: "https://img.freepik.com/free-photo/successful-handsome-business-man-office_1303-20918.jpg?t=st=1741805355~exp=1741808955~hmac=f3567e05fd73afda6bf3bebc918069e5719c5dcdea88ecdeaf35d9be34e6b803&w=1380",
      position: "Creative Director",
      description: "With over 8 years of experience in digital marketing and brand development, James brings creativity and strategic insight to our marketing initiatives."
    }
  ];

  return (
    <div className="w-full bg-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-24 px-4 pt-70 sm:px-6 lg:px-8 overflow-hidden"
        style={{ 
          backgroundImage: "url('/api/placeholder/1920/600')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`transition-all duration-1000 transform ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-pulse">Our Story</h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8">Creating exceptional shopping experiences since 2010</p>
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-md font-medium transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg hover:scale-105 flex items-center group">
              Learn More 
              <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div ref={statsRef} className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`bg-white shadow-md rounded-lg p-6 text-center transition-all duration-700 transform ${statsInView ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-3'} hover:shadow-xl hover:-translate-y-2 hover:bg-indigo-50`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mx-auto bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center text-indigo-600 mb-4 transition-all duration-300 hover:scale-110 hover:bg-indigo-200">
                {stat.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h2>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* About Content Section */}
      <div ref={aboutRef} className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Image Column */}
            <div 
              className={`md:w-1/2 transition-all duration-1000 transform ${aboutInView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
            >
              <div className="relative overflow-hidden group">
                <div className="bg-stone-400 absolute -top-6 -left-6 w-full h-full rounded-lg -z-10 transition-all duration-500 group-hover:-top-4 group-hover:-left-4" />
                <img 
                  src="https://media.gettyimages.com/id/1225833689/photo/boxes-on-conveyor-belt.jpg?s=1024x1024&w=gi&k=20&c=Ynkezj9YP-XpmKBYn3Q0WA2jyFCqsfAuktX8KTcT-6s="
                  alt="About Our Company" 
                  className="w-full h-auto rounded-lg shadow-lg relative z-10 transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            </div>
            
            {/* Content Column */}
            <div 
              className={`md:w-1/2 transition-all duration-1000 transform ${aboutInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              style={{ transitionDelay: '300ms' }}
            >
              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200 mb-8">
                {['story', 'mission', 'values'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-lg font-medium relative transition-colors duration-300 ${
                      activeTab === tab 
                        ? 'text-indigo-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transition-transform duration-300 ${
                      activeTab === tab ? 'scale-100' : 'scale-0'
                    }`} />
                  </button>
                ))}
              </div>
              
              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'story' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Founded in 2010, our e-commerce store began with a simple mission: to provide high-quality products with exceptional customer service. What started as a small family business has grown into an international brand that serves customers across the globe.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Over the years, we've expanded our product line while maintaining our commitment to quality and sustainability. Our team has grown from 3 dedicated founders to over 100 passionate team members who share our vision.
                    </p>
                  </div>
                )}
                
                {activeTab === 'mission' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                      We aim to revolutionize the online shopping experience by combining cutting-edge technology with personalized service. Our mission is to connect customers with products that enhance their lives while maintaining ethical business practices.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      We believe in transparent pricing, honest marketing, and building lasting relationships with our customers and suppliers. Every decision we make is guided by our commitment to excellence and integrity.
                    </p>
                  </div>
                )}
                
                {activeTab === 'values' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                    <ul className="space-y-3">
                      {[
                        { label: 'Quality', desc: 'We never compromise on the quality of our products or services.' },
                        { label: 'Sustainability', desc: 'We\'re committed to environmentally responsible practices.' },
                        { label: 'Innovation', desc: 'We continuously evolve our offerings and technology.' },
                        { label: 'Community', desc: 'We value the relationships with our customers and partners.' }
                      ].map((value, index) => (
                        <li key={index} className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                          <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-1 transition-all duration-300 group-hover:bg-indigo-200">
                            <div className="bg-indigo-600 rounded-full w-2 h-2 transition-all duration-300 group-hover:scale-125" />
                          </div>
                          <p className="text-gray-600"><span className="font-semibold">{value.label}:</span> {value.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 flex items-center group">
                  Join Our Team 
                  <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div ref={teamRef} className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-12 transition-all duration-1000 transform ${teamInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '150ms' }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Meet Our Leadership
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-indigo-600 rounded-full transition-all duration-700 hover:left-0 hover:right-0"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our experienced team brings decades of industry expertise and a shared passion for innovation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {emp.map((person, index) => (
            <div 
              key={index}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-700 transform ${teamInView ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-2'} hover:shadow-xl group`}
              style={{ transitionDelay: `${300 + (index * 150)}ms` }}
            >
              <div className="overflow-hidden">
                <img 
                  src={person.img} 
                  alt="Team Member" 
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[20px] border-l-[20px] border-indigo-600 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 transition-all duration-300 group-hover:translate-x-2">
                  {`Team Member ${index + 1}`}
                </h3>
                <p className="text-indigo-600 mb-3 font-medium">{person.position}</p>
                <p className="text-gray-600 mb-4">{person.description}</p>
                <div className="flex space-x-3">
                  {[
                    "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                    "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                    "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  ].map((path, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="text-gray-500 hover:text-indigo-600 transition-all duration-300 hover:scale-125"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d={path} clipRule="evenodd" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to Action */}
      <div ref={ctaRef} className="bg-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-16 w-48 h-48 bg-purple-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-8 left-32 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div 
          className={`max-w-6xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${ctaInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to transform your shopping experience?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who have discovered the difference of shopping with us.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={"/"}>
                <button className="bg-white text-indigo-700 px-8 py-3 rounded-md font-medium transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg hover:scale-105">
                  Shop Now
                </button>
            </Link>

            <Link to={"/contact"}>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105">
              Contact Us
            </button>
            </Link>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Define keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.7s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 3s infinite;
  }
`;
document.head.appendChild(style);

export default AboutPage;