import { Link } from "react-router-dom";
import logo from '../assets/aastu-logo.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaTelegram, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../index.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          {/* Logo & University Name */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-6 md:mb-0">
            <img src={logo} alt="AASTU Logo" className="h-14 mb-2 rounded-full" />
            
            <span className="text-xs text-gray-400 mt-1">© 2024 All rights reserved.</span>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-semibold text-yellow-400 mb-2">Contact Us</h4>
            <div className="flex items-center gap-2 mb-1 text-sm">
              <FaEnvelope className="text-yellow-400" />
              <span>info@aastu.edu.et</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaPhone className="text-yellow-400" />
              <span>+251 11 123 4567</span>
            </div>
            <div className="mt-3 text-xs text-gray-400">Kilinto, Addis Ababa, Ethiopia</div>
          </div>

          {/* Social Media & Quick Links */}
          <div className="flex flex-col items-center md:items-end w-full md:w-1/3">
            <h4 className="font-semibold text-yellow-400 mb-2">Connect with Us</h4>
            <div className="flex gap-4 mb-3">
              <a href="https://www.facebook.com/aastuedu/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 text-2xl transition-colors"><FaFacebook /></a>
              <a href="https://twitter.com/aastuethiopia" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 text-2xl transition-colors"><FaTwitter /></a>
              <a href="https://www.linkedin.com/school/addis-ababa-science-and-technology-university/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 text-2xl transition-colors"><FaLinkedin /></a>
              <a href="https://www.aastu.edu.et/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 text-2xl transition-colors"><FaTelegram /></a>
            </div>
            <div className="flex gap-4 mt-2 text-sm">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
