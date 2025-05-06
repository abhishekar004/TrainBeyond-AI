import React from 'react';
import { Dumbbell, Heart, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Dumbbell className="h-6 w-6" />
              <h2 className="text-xl font-bold">TrainBeyond AI</h2>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              Train with Purpose. Powered by AI. Inspired by You.
            </p>
            <p className="text-gray-400 text-sm">
              More than just a fitness app - TrainBeyond AI is your gateway to transcending limits. 
              We combine cutting-edge AI technology with the spirit of continuous evolution, 
              inspiring you to push beyond conventional boundaries and unlock your true potential.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="mailto:abhishekarpulla@gmail.com"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                abhishekarpulla@gmail.com
              </a>
              <div className="text-sm text-gray-400">
                Feel free to reach out for:
                <ul className="list-disc list-inside mt-1 ml-1">
                  <li>Feedback & Suggestions</li>
                  <li>Support Inquiries</li>
                  <li>Partnership Opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TrainBeyond AI. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by TrainBeyond Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
